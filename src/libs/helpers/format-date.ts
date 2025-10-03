import * as chrono from "chrono-node";
import { format, isValid, parseISO } from "date-fns";

export const formatDate = (dateStr: string): { iso: string; readable: string } => {
  let date: Date | null = null;

  // Try ISO parse
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateStr)) {
    date = parseISO(dateStr);
  } else {
    // Natural language parse
    const result = chrono.parse(dateStr)[0];
    if (result) date = result.start.date();
  }

  if (!date || !isValid(date)) {
    return { iso: dateStr, readable: dateStr };
  }

  const iso = date.getHours() || date.getMinutes()
    ? format(date, "yyyy-MM-dd'T'HH:mm")
    : format(date, "yyyy-MM-dd");

  const readable = date.getHours() || date.getMinutes()
    ? format(date, "PPpp")
    : format(date, "PPP");

  return { iso, readable };
};