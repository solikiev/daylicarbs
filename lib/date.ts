// Date utility functions

/**
 * Convert Date to YYYY-MM-DD string
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Convert YYYY-MM-DD string to Date
 */
export function fromDateKey(key: string): Date {
  return new Date(key + "T00:00:00");
}

/**
 * Get a 6-week (42 days) grid for a month calendar
 * Starting from the Sunday before or at the first of the month
 */
export function getMonthGrid(year: number, monthIndex: number): Date[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const dayOfWeek = firstOfMonth.getDay(); // 0 = Sunday
  
  // Start from the Sunday before or at the first of month
  const startDate = new Date(firstOfMonth);
  startDate.setDate(1 - dayOfWeek);
  
  // Generate 42 days (6 weeks)
  const grid: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    grid.push(date);
  }
  
  return grid;
}

/**
 * Format a date key (YYYY-MM-DD) to human-readable format
 */
export function formatDisplayDate(dateKey: string): string {
  const date = fromDateKey(dateKey);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get month name from month index
 */
export function getMonthName(monthIndex: number): string {
  const date = new Date(2000, monthIndex, 1);
  return date.toLocaleDateString("en-US", { month: "long" });
}
