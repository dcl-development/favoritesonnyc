"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { reservationNotice, restaurant } from "@/content/site";

const KEY = "fs-reservation-notice";
const WINDOW_MS = reservationNotice.days * 24 * 60 * 60 * 1000;

function seenRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(KEY));
    return at > 0 && Date.now() - at < WINDOW_MS;
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    // Private mode or blocked storage: the notice just shows again next visit.
  }
}

/** Reservation policy popup. Opens once per visitor per `days`, on whatever page they land on. */
export function ReservationNotice() {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const studio = pathname.startsWith("/studio");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || studio || dialog.open || seenRecently()) return;
    dialog.showModal();
  }, [studio]);

  if (studio) return null;

  return (
    <dialog
      ref={ref}
      className="notice"
      aria-labelledby="notice-title"
      onClose={markSeen}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
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
      <form method="dialog">
        <button type="submit" className="notice-ok" autoFocus>
          Got it
        </button>
      </form>
    </dialog>
  );
}
