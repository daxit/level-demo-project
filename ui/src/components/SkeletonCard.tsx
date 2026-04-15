export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="mt-3 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 flex gap-2">
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
