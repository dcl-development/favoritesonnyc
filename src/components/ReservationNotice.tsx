"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { reservationNotice, restaurant } from "@/content/site";

const KEY = "fs-reservation-notice";
const CLOSE_FALLBACK_MS = 250;

function seenRecently(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Blocked storage: the notice just shows again on the next page load.
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reservations and walk-ins popup. Opens once per browser session (tab or window), on whatever page they land on. */
export function ReservationNotice() {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const closeTimer = useRef(0);
  const studio = pathname.startsWith("/studio");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || studio || dialog.open || seenRecently()) return;
    closing.current = false;
    delete dialog.dataset.closing;
    dialog.showModal();
    return () => window.clearTimeout(closeTimer.current);
  }, [studio]);

  function dismiss() {
    const dialog = ref.current;
    if (!dialog?.open || closing.current) return;
    if (prefersReducedMotion()) {
      dialog.close();
      return;
    }

    closing.current = true;
    dialog.dataset.closing = "1";

    const finish = () => {
      window.clearTimeout(closeTimer.current);
      dialog.removeEventListener("animationend", onEnd);
      closing.current = false;
      delete dialog.dataset.closing;
      if (dialog.open) dialog.close();
    };

    const onEnd = (event: AnimationEvent) => {
      if (event.target !== dialog || event.animationName !== "notice-out") return;
      finish();
    };

    dialog.addEventListener("animationend", onEnd);
    closeTimer.current = window.setTimeout(finish, CLOSE_FALLBACK_MS);
  }

  if (studio) return null;

  return (
    <dialog
      ref={ref}
      className="notice"
      aria-labelledby="notice-title"
      onClose={markSeen}
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <h2 id="notice-title" className="notice-title">
        {reservationNotice.title}
      </h2>
      {reservationNotice.paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
      <p>
        Questions?
        <br />
        <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
        <br />
        <a href={`tel:${restaurant.phoneTel}`}>{restaurant.phone}</a>
      </p>
      <form
        method="dialog"
        onSubmit={(event) => {
          event.preventDefault();
          dismiss();
        }}
      >
        <button type="submit" className="notice-ok" autoFocus>
          Got it
        </button>
      </form>
    </dialog>
  );
}
