import { Food } from "@/types";

// Calculate calories from macronutrients
export function calculateCalories(protein: number, carbs: number, fat: number): number {
  return Math.round(protein * 4 + carbs * 4 + fat * 9);
}

// Calculate meal totals from food items
export function calculateMealTotals(foods: Food[]) {
  return foods.reduce((totals, food) => {
    return {
      calories: Math.round(totals.calories + food.calories),
      protein: Math.round((totals.protein + food.protein) * 10) / 10,
      carbs: Math.round((totals.carbs + food.carbs) * 10) / 10,
      fat: Math.round((totals.fat + food.fat) * 10) / 10
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

// Calculate calorie deficit
export function calculateCalorieDeficit(consumed: number, goal: number): number {
  return consumed - goal;
}

// Get color for calorie deficit (green for deficit, red for excess)
export function getDeficitColor(deficit: number): string {
  return deficit < 0 ? 'text-green-600' : 'text-red-600';
}

// Format macros to show the fixed number of decimal places
export function formatMacro(value: number): string {
  return value.toFixed(1);
}

// Check if a value is a valid number
export function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

// Calculate BMI
export function calculateBMI(weight: number, heightCm: number): number {
  if (!weight || !heightCm) return 0;
  
  // Convert height from cm to meters
  const heightM = heightCm / 100;
  
  // BMI formula: weight (kg) / height^2 (m)
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

// Get BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  if (bmi < 35) return 'Obesidade Grau I';
  if (bmi < 40) return 'Obesidade Grau II';
  return 'Obesidade Grau III';
}
