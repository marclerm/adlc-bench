import type {
  CheckInStatus,
  Circle,
  InteractionType,
  ImportantDateType,
} from "./types";
import { format, parseISO, isValid, differenceInCalendarDays } from "date-fns";
import { currentLocale, localeCode } from "../shared/locale";

export const STATUS_LABEL: Record<CheckInStatus, string> = {
  in_touch: "In touch",
  due_soon: "Due soon",
  overdue: "Overdue",
  snoozed: "Snoozed",
  off: "Check-ins off",
};

export const CIRCLE_LABEL: Record<Circle, string> = {
  inner: "Inner",
  close: "Close",
  wider: "Wider",
  distant: "Distant",
};

export const INTERACTION_META: Record<
  InteractionType,
  { label: string; verb: string }
> = {
  call: { label: "Call", verb: "Called" },
  message: { label: "Message", verb: "Messaged" },
  email: { label: "Email", verb: "Emailed" },
  met: { label: "Met up", verb: "Met up" },
  other: { label: "Other", verb: "Other contact" },
};

export const DATE_TYPE_LABEL: Record<ImportantDateType, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  work_anniversary: "Work anniversary",
  child_birthday: "Child's birthday",
  other: "Important date",
};

export function fmtDate(
  iso: string | null | undefined,
  fallback = "—",
): string {
  if (!iso) return fallback;
  const d = parseISO(iso);
  if (!isValid(d)) return fallback;
  if (currentLocale() === "en") return format(d, "d MMM yyyy");
  return new Intl.DateTimeFormat(localeCode(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function fmtDateShort(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseISO(iso);
  if (!isValid(d)) return "—";
  if (currentLocale() === "en") return format(d, "d MMM");
  return new Intl.DateTimeFormat(localeCode(), {
    day: "numeric",
    month: "short",
  }).format(d);
}

export function relativeDays(
  iso: string | null | undefined,
  fromToday?: string,
): string {
  if (!iso)
    return currentLocale() === "es" ? "sin contacto" : "never contacted";
  const ref = fromToday ? parseISO(fromToday) : new Date();
  // Positive is the future: the date is that many days after the day we are counting from.
  const diff = differenceInCalendarDays(parseISO(iso), ref);
  if (currentLocale() === "es") {
    return relativeDaysEs(diff);
  }
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff < 0) return `${-diff} days ago`;
  return `in ${diff} days`;
}

function relativeDaysEs(diff: number): string {
  if (diff === 0) return "hoy";
  if (diff === 1) return "mañana";
  if (diff === -1) return "ayer";
  if (diff < 0) return `hace ${-diff} días`;
  return `en ${diff} días`;
}

const AVATAR_COLORS = [
  "#209dd7",
  "#753991",
  "#d98a00",
  "#217a4b",
  "#cf4436",
  "#0f766e",
  "#5b6ee1",
  "#b1359b",
  "#8a6d1f",
  "#64748b",
];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function localTimeIn(
  timezone: string | null | undefined,
): string | null {
  if (!timezone) return null;
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return null;
  }
}

export function monthShort(month: number): string {
  if (currentLocale() === "en") {
    return format(new Date(2001, month - 1, 1), "MMM");
  }
  return new Intl.DateTimeFormat(localeCode(), { month: "short" }).format(
    new Date(2001, month - 1, 1),
  );
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** The message from a failed request, for showing in place of the thing that failed to load. */
export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
