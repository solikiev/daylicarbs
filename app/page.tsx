"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadDays } from "@/lib/storage";
import { toDateKey, getMonthGrid, getMonthName } from "@/lib/date";
import type { DayMap } from "@/lib/types";

export default function CalendarPage() {
  const [days, setDays] = useState<DayMap>({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDays(loadDays());
  }, []);

  if (!mounted) {
    return (
      <div className="text-center text-neutral-400 py-8">Loading...</div>
    );
  }

  const grid = getMonthGrid(year, monthIndex);
  const today = toDateKey(new Date());

  const handlePrevMonth = () => {
    if (monthIndex === 0) {
      setYear(year - 1);
      setMonthIndex(11);
    } else {
      setMonthIndex(monthIndex - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthIndex === 11) {
      setYear(year + 1);
      setMonthIndex(0);
    } else {
      setMonthIndex(monthIndex + 1);
    }
  };

  const getBorderColor = (dateKey: string): string => {
    const day = days[dateKey];
    
    if (!day || day.totalActual === 0 || !day.dailyTargetMax) {
      return "border-neutral-800";
    }
    
    if (day.totalActual <= day.dailyTargetMax) {
      return "border-emerald-500";
    }
    
    return "border-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">
          {getMonthName(monthIndex)} {year}
        </h1>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-400 mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((date) => {
            const dateKey = toDateKey(date);
            const day = days[dateKey];
            const isToday = dateKey === today;
            const isCurrentMonth = date.getMonth() === monthIndex;
            const borderColor = getBorderColor(dateKey);

            return (
              <Link
                key={dateKey}
                href={`/day/${dateKey}`}
                className={`
                  min-h-[54px] p-1 border-2 rounded
                  flex flex-col items-center justify-center
                  hover:bg-neutral-900 transition-colors
                  ${borderColor}
                  ${isToday ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-neutral-950" : ""}
                  ${!isCurrentMonth ? "opacity-40" : ""}
                `}
              >
                <div className="text-xs font-medium">{date.getDate()}</div>
                {day && day.totalActual > 0 && (
                  <div className="text-[10px] text-neutral-400">
                    {day.totalActual}g
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="text-xs text-neutral-400 space-y-1">
        <p>
          <span className="text-emerald-500">●</span> Green border: within
          daily target
        </p>
        <p>
          <span className="text-red-500">●</span> Red border: over daily target
        </p>
      </div>

      {/* Go to today button */}
      <div className="pt-4">
        <Link
          href={`/day/${today}`}
          className="block w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium"
        >
          Go to Today
        </Link>
      </div>
    </div>
  );
}
