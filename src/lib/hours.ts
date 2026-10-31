export type ServiceStatus = {
  live: string;
  quiet: string;
};

export function serviceStatus(now = new Date()): ServiceStatus {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const minutes = Number(read("hour")) * 60 + Number(read("minute"));
  const opens = 16 * 60;
  const closes = 21 * 60;

  if (minutes >= opens && minutes < closes) {
    return { live: "open until 9", quiet: "walk-ins welcome" };
  }

  if (minutes < opens) {
    return { live: "opens at 4", quiet: "walk-ins from 4" };
  }

  return { live: "every day, 4–9", quiet: "opens tomorrow at 4" };
}
