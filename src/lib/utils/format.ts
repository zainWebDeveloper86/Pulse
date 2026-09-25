/**
 * Format a date string into human-readable format
 * Example: "14:30 - Sep 19, 2026"
 */
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

/**
 * Format pulse count
 * Example: "No Pulses" or "01 Pulse" or "05 Pulses"
 */
export function formatPulseCount(count: number): string {
  if (count === 0) return "No Pulses";
  
  const pulseCount = count.toString().padStart(2, "0");
  const pulseWord = count === 1 ? "Pulse" : "Pulses";
  return `${pulseCount} ${pulseWord}`;
}
