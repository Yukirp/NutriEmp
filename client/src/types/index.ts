export interface User {
  id: number;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  activityLevel?: string;
  dailyCalorieGoal?: number;
  createdAt: Date;
}

export interface Food {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export interface Meal {
  id: number;
  userId: number;
  name: string;
  time: string;
  date: string;
  foods: Food[];
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  createdAt: Date;
}

export interface DailySummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeeklyData {
  date: string;
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type ActivityLevel = 
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';
  
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
