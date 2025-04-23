"use client";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="m-4 font-bold">
      <pre>{error.message}</pre>
      <button type="button" className="rounded-lg bg-blue-500 px-2 py-1 text-white" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
