export const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffMs = parsed.getTime() - now.getTime();

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;
  const monthMs = 30 * dayMs;
  const yearMs = 365 * dayMs;

  const absDiff = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absDiff < hourMs) {
    return rtf.format(Math.round(diffMs / minuteMs), "minute");
  }

  if (absDiff < dayMs) {
    return rtf.format(Math.round(diffMs / hourMs), "hour");
  }

  if (absDiff < weekMs) {
    return rtf.format(Math.round(diffMs / dayMs), "day");
  }

  if (absDiff < monthMs) {
    return rtf.format(Math.round(diffMs / weekMs), "week");
  }

  if (absDiff < yearMs) {
    return rtf.format(Math.round(diffMs / monthMs), "month");
  }

  return rtf.format(Math.round(diffMs / yearMs), "year");
};

export const sortFun = (a: BoardProps, b: BoardProps) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export const compareByUpdatedAt = (a: BoardProps, b: BoardProps) =>
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

export const isSameDay = (dateA: string, dateB: string) => {
  const a = new Date(dateA);
  const b = new Date(dateB);

  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
    return false;
  }

  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
};
