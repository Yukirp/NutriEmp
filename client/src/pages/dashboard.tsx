import { SummaryCard } from "@/components/dashboard/summary-card";
import { MealList } from "@/components/dashboard/meal-list";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { useMeals } from "@/hooks/use-meals";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Meal } from "@/types";

export default function Dashboard() {
  const { todayMeals, todaySummary, weeklyData, isLoading, isError, isPending } = useMeals();
  
  // Convert to specific types as needed
  const typedTodayMeals = todayMeals as Meal[];

  // Show loading skeleton during initial load
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar alguns dados. Verifique sua conexão e tente novamente.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Daily Summary */}
      <SummaryCard summary={todaySummary} />
      
      {/* Meals Today */}
      <MealList meals={typedTodayMeals} />
      
      {/* Weekly Stats */}
      <ProgressChart weeklyData={weeklyData} />
    </div>
  );
}
