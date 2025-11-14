"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  loadDays,
  saveDays,
  ensureDay,
  recomputeTotals,
} from "@/lib/storage";
import { formatDisplayDate } from "@/lib/date";
import type { Day, DayMap, Meal } from "@/lib/types";

export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dateKey = params.date as string;

  const [days, setDays] = useState<DayMap>({});
  const [day, setDay] = useState<Day | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadedDays = loadDays();
    setDays(loadedDays);
    setDay(ensureDay(loadedDays, dateKey));
  }, [dateKey]);

  if (!mounted || !day) {
    return (
      <div className="text-center text-neutral-400 py-8">Loading...</div>
    );
  }

  const updateDay = (updatedDay: Day) => {
    recomputeTotals(updatedDay);
    setDay({ ...updatedDay });
  };

  const handleDailyTargetChange = (
    field: "dailyTargetMin" | "dailyTargetMax",
    value: string
  ) => {
    const numValue = value === "" ? null : parseFloat(value);
    const updatedDay = { ...day, [field]: numValue };
    updateDay(updatedDay);
  };

  const handleMealChange = (
    index: number,
    field: "plannedMin" | "plannedMax" | "actual",
    value: string
  ) => {
    const numValue = value === "" ? null : parseFloat(value);
    const updatedMeals = [...day.meals];
    updatedMeals[index] = { ...updatedMeals[index], [field]: numValue };
    const updatedDay = { ...day, meals: updatedMeals };
    updateDay(updatedDay);
  };

  const handleClearMeal = (index: number) => {
    const updatedMeals = [...day.meals];
    updatedMeals[index] = {
      ...updatedMeals[index],
      plannedMin: null,
      plannedMax: null,
      actual: null,
    };
    const updatedDay = { ...day, meals: updatedMeals };
    updateDay(updatedDay);
  };

  const handleSave = () => {
    const updatedDays = { ...days, [dateKey]: day };
    setDays(updatedDays);
    saveDays(updatedDays);
    alert("Day saved!");
  };

  const handleCopyDay = () => {
    const targetDate = prompt("Enter target date (YYYY-MM-DD):");
    if (!targetDate) return;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      alert("Invalid date format. Use YYYY-MM-DD");
      return;
    }

    const copiedDay: Day = {
      ...day,
      date: targetDate,
    };

    const updatedDays = { ...days, [targetDate]: copiedDay };
    setDays(updatedDays);
    saveDays(updatedDays);
    router.push(`/day/${targetDate}`);
  };

  const handleDeleteDay = () => {
    if (!confirm("Delete this day's data?")) return;

    const updatedDays = { ...days };
    delete updatedDays[dateKey];
    saveDays(updatedDays);
    router.push("/");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {formatDisplayDate(dateKey)}
        </h1>
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-200"
        >
          ← Calendar
        </Link>
      </div>

      {/* Daily Target Section */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-3 border border-neutral-800">
        <h2 className="font-semibold text-sm">Daily Target</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Min (g)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={day.dailyTargetMin ?? ""}
              onChange={(e) =>
                handleDailyTargetChange("dailyTargetMin", e.target.value)
              }
              className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              Max (g)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={day.dailyTargetMax ?? ""}
              onChange={(e) =>
                handleDailyTargetChange("dailyTargetMax", e.target.value)
              }
              className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-neutral-400">
          Calendar turns green if total ≤ Max, red if over.
        </p>
      </div>

      {/* Meals Section */}
      <div className="space-y-3">
        <h2 className="font-semibold">Meals</h2>
        {day.meals.map((meal, index) => (
          <div
            key={meal.key}
            className="bg-neutral-900 rounded-lg p-3 space-y-2 border border-neutral-800"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{meal.name}</h3>
              <button
                onClick={() => handleClearMeal(index)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Planned Min
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={meal.plannedMin ?? ""}
                  onChange={(e) =>
                    handleMealChange(index, "plannedMin", e.target.value)
                  }
                  className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Planned Max
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={meal.plannedMax ?? ""}
                  onChange={(e) =>
                    handleMealChange(index, "plannedMax", e.target.value)
                  }
                  className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Actual
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={meal.actual ?? ""}
                  onChange={(e) =>
                    handleMealChange(index, "actual", e.target.value)
                  }
                  className="w-full px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
        <div className="text-lg font-semibold">
          Total Actual: <span className="text-emerald-500">{day.totalActual}g</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleSave}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-medium"
        >
          Save
        </button>
        <button
          onClick={handleCopyDay}
          className="w-full py-2 bg-neutral-700 hover:bg-neutral-600 rounded font-medium"
        >
          Copy Day
        </button>
        <button
          onClick={handleDeleteDay}
          className="w-full py-2 bg-red-900 hover:bg-red-800 rounded font-medium"
        >
          Delete Day
        </button>
      </div>
    </div>
  );
}
