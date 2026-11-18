"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { reservationNotice, restaurant } from "@/content/site";

const KEY = "fs-reservation-notice";

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

/** Reservation policy popup. Opens once per browser session (tab or window), on whatever page they land on. */
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
