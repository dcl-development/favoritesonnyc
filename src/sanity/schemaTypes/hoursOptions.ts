// Every half hour from 6am to midnight. Stored as 24-hour "HH:MM" (the site reads that);
// titles are short so they fit on a phone: "4pm", "9:30pm", "12am".
export const TIME_OPTIONS = Array.from({ length: 37 }, (_, i) => {
  const minutes = 6 * 60 + i * 30;
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const value = `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 || h24 === 24 ? "am" : "pm";
  return { title: `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""}${suffix}`, value };
});
