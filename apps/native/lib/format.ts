export const DEFAULT_CURRENCY_CODE = "INR";
export const DEFAULT_CURRENCY_LOCALE = "en-IN";

function toNumber(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrency(
  value: string | number,
  options?: {
    decimals?: boolean;
    currency?: string;
    locale?: string;
  },
): string {
  const amount = toNumber(value);

  if (amount === null) {
    return String(value);
  }

  const {
    decimals = true,
    currency = DEFAULT_CURRENCY_CODE,
    locale = DEFAULT_CURRENCY_LOCALE,
  } = options ?? {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatSignedCurrency(
  value: number,
  type: "income" | "expense",
  options?: {
    currency?: string;
    locale?: string;
  },
): string {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${formatCurrency(Math.abs(value), options)}`;
}

/** Format a Date to the app's display format: "14 Aug, 4:30 pm" */
export function formatDateTime(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${day} ${month}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}
