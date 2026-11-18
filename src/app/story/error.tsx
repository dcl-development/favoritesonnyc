"use client";

import { Sheet } from "@/components/Sheet";

export default function StoryError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Sheet title="our story">
      <p className="empty-copy">couldn’t load our story.</p>
      <p>
        <button type="button" className="text-button" onClick={reset}>
          try again
        </button>
      </p>
    </Sheet>
  );
}
