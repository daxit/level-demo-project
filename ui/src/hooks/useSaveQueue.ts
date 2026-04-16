import { useCallback, useRef, useState } from 'react';

import type { UpdateAutomationInput } from '../gql/graphql';

type SaveStatus = 'idle' | 'debouncing' | 'saving' | 'saved' | 'retrying' | 'failed';

const DEBOUNCE_MS = 600;
const RETRY_DELAYS = [2000, 4000, 8000];
const SAVED_DISPLAY_MS = 3000;

interface UseSaveQueueOptions {
  mutateFn: (payload: UpdateAutomationInput) => Promise<void>;
}

export function useSaveQueue({ mutateFn }: UseSaveQueueOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [retryCountdown, setRetryCountdown] = useState(0);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  const queuedPayload = useRef<UpdateAutomationInput | null>(null);
  const lastPayload = useRef<UpdateAutomationInput | null>(null);
  const retryAttempt = useRef(0);

  const clearTimers = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (retryTimer.current) clearTimeout(retryTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    debounceTimer.current = null;
    retryTimer.current = null;
    countdownTimer.current = null;
    savedTimer.current = null;
  }, []);

  const executeSave = useCallback(
    async (payload: UpdateAutomationInput) => {
      if (inFlight.current) {
        queuedPayload.current = payload;
        return;
      }

      inFlight.current = true;
      lastPayload.current = payload;
      setStatus('saving');

      try {
        await mutateFn(payload);
        inFlight.current = false;
        retryAttempt.current = 0;

        if (queuedPayload.current) {
          const next = queuedPayload.current;
          queuedPayload.current = null;
          executeSave(next);
        } else {
          setStatus('saved');
          savedTimer.current = setTimeout(() => setStatus('idle'), SAVED_DISPLAY_MS);
        }
      } catch {
        inFlight.current = false;

        if (queuedPayload.current) {
          const next = queuedPayload.current;
          queuedPayload.current = null;
          retryAttempt.current = 0;
          executeSave(next);
          return;
        }

        if (retryAttempt.current < RETRY_DELAYS.length) {
          const delay = RETRY_DELAYS[retryAttempt.current]!;
          retryAttempt.current++;
          setRetryCountdown(Math.ceil(delay / 1000));
          setStatus('retrying');

          countdownTimer.current = setInterval(() => {
            setRetryCountdown((prev) => {
              if (prev <= 1) {
                if (countdownTimer.current) clearInterval(countdownTimer.current);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          retryTimer.current = setTimeout(() => {
            if (countdownTimer.current) clearInterval(countdownTimer.current);
            executeSave(payload);
          }, delay);
        } else {
          retryAttempt.current = 0;
          setStatus('failed');
        }
      }
    },
    [mutateFn],
  );

  const saveDebounced = useCallback(
    (payload: UpdateAutomationInput) => {
      clearTimers();
      retryAttempt.current = 0;
      queuedPayload.current = null;
      setStatus('debouncing');

      debounceTimer.current = setTimeout(() => {
        executeSave(payload);
      }, DEBOUNCE_MS);
    },
    [clearTimers, executeSave],
  );

  const retry = useCallback(() => {
    if (retryTimer.current) clearTimeout(retryTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    retryTimer.current = null;
    countdownTimer.current = null;
    retryAttempt.current = 0;
    if (lastPayload.current) {
      executeSave(lastPayload.current);
    }
  }, [executeSave]);

  const cancel = useCallback(() => {
    clearTimers();
    inFlight.current = false;
    queuedPayload.current = null;
    lastPayload.current = null;
    retryAttempt.current = 0;
    setStatus('idle');
    setRetryCountdown(0);
  }, [clearTimers]);

  return { saveDebounced, retry, cancel, status, retryCountdown };
}
