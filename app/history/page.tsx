"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadDays } from "@/lib/storage";
import { formatDisplayDate } from "@/lib/date";
import type { Day, DayMap } from "@/lib/types";

export default function HistoryPage() {
  const [days, setDays] = useState<Day[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedDays = loadDays();
    
    // Convert to array and sort by date descending
    const daysArray = Object.values(loadedDays).sort(
      (a, b) => b.date.localeCompare(a.date)
    );
    
    setDays(daysArray);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center text-neutral-400 py-8">Loading...</div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">History</h1>
        <p className="text-neutral-400 text-center py-8">
          No history yet. Start tracking your carbs!
        </p>
        <Link
          href="/"
          className="block w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium"
        >
          Go to Calendar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">History</h1>
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Calendar
        </Link>
      </div>

      <div className="space-y-2">
        {days.map((day) => {
          const hasTarget =
            day.dailyTargetMin !== null || day.dailyTargetMax !== null;

          return (
            <Link
              key={day.date}
              href={`/day/${day.date}`}
              className="block bg-neutral-900 rounded-lg p-3 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{formatDisplayDate(day.date)}</div>
                  <div className="text-sm text-neutral-400 mt-1">
                    Total: {day.totalActual}g
                  </div>
                </div>
                {hasTarget && (
                  <div className="text-xs bg-neutral-800 px-2 py-1 rounded">
                    Target: {day.dailyTargetMin ?? "–"}–
                    {day.dailyTargetMax ?? "–"}g
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
