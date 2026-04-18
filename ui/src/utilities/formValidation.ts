export function isAutomationFormValid(values: Record<string, unknown>): boolean {
  const trigger = values.trigger as
    | { schedule?: { interval?: number | null }; threshold?: { value?: number | null } }
    | undefined;

  if (trigger?.schedule) {
    const interval = trigger.schedule.interval;
    if (interval == null || interval < 1 || interval > 999) return false;
  }

  if (trigger?.threshold) {
    const value = trigger.threshold.value;
    if (value == null || isNaN(value)) return false;
  }

  return true;
}
