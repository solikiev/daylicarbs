// Data model types for DayliCarbs

export type MealKey =
  | "breakfast"
  | "intraPostWorkout"
  | "lunch"
  | "snack1"
  | "snack2"
  | "snack3"
  | "dinner";

export interface Meal {
  key: MealKey;
  name: string;
  plannedMin: number | null;
  plannedMax: number | null;
  actual: number | null;
}

export interface Day {
  date: string; // YYYY-MM-DD
  meals: Meal[];
  dailyTargetMin: number | null;
  dailyTargetMax: number | null;
  totalActual: number; // sum of all actual values, ignoring nulls
}

export type DayMap = Record<string, Day>;
