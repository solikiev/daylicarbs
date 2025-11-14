// localStorage helpers for DayliCarbs

import type { Day, DayMap, Meal } from "./types";

const STORAGE_KEY = "daylicarbs.days";

/**
 * Load DayMap from localStorage
 */
export function loadDays(): DayMap {
  if (typeof window === "undefined") {
    return {};
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as DayMap;
  } catch (error) {
    console.error("Error loading days from localStorage:", error);
    return {};
  }
}

/**
 * Save DayMap to localStorage
 */
export function saveDays(days: DayMap): void {
  if (typeof window === "undefined") {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  } catch (error) {
    console.error("Error saving days to localStorage:", error);
  }
}

/**
 * Get empty meal slots with default values
 */
export function getEmptyMeals(): Meal[] {
  return [
    {
      key: "breakfast",
      name: "Breakfast",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
    {
      key: "intraPostWorkout",
      name: "Intra/Post Workout",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
    {
      key: "lunch",
      name: "Lunch",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
    {
      key: "snack1",
      name: "Snack 1",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
    {
      key: "snack2",
      name: "Snack 2",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
    {
      key: "snack3",
      name: "Snack 3",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
    {
      key: "dinner",
      name: "Dinner",
      plannedMin: null,
      plannedMax: null,
      actual: null,
    },
  ];
}

/**
 * Get or create a Day for a given date
 */
export function ensureDay(days: DayMap, date: string): Day {
  if (days[date]) {
    return days[date];
  }
  
  return {
    date,
    meals: getEmptyMeals(),
    dailyTargetMin: null,
    dailyTargetMax: null,
    totalActual: 0,
  };
}

/**
 * Recalculate totalActual from meals
 */
export function recomputeTotals(day: Day): void {
  day.totalActual = day.meals.reduce((sum, meal) => {
    return sum + (meal.actual ?? 0);
  }, 0);
}
