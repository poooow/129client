/**
 * Converts a datetime string to a local time string.
 */
export default function datetimeToLocalTime(datetime: string | undefined) {
  if (!datetime) return null

  return new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
    hourCycle: "h23",
  }).format(new Date(datetime));
}
