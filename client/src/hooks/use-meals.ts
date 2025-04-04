import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Meal, DailySummary, Food } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { format, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Default data for users who aren't logged in yet
const DEFAULT_USER_ID = 1;
const DEFAULT_MEALS: Meal[] = [];

// Create a custom query key generator to ensure consistency
const createMealsQueryKey = (userId: number | null, params: Record<string, string>) => {
  // Always return an array, never null to avoid type errors with QueryKey
  if (!userId) return ['/api/placeholder']; // Placeholder that won't be called
  return [`/api/users/${userId}/meals`, params];
};

export function useMeals() {
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();

  // Load user ID only once during initialization
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      // Use default user ID if none exists to prevent empty state
      setUserId(DEFAULT_USER_ID);
      localStorage.setItem('userId', String(DEFAULT_USER_ID));
    }
  }, []);  // O efeito é chamado apenas uma vez, durante a inicialização

  // Get today's date formatted as YYYY-MM-DD (memoized to prevent rerenders)
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Calculate daily summary from meals - only works with Meal[] type
  const calculateDailySummary = useCallback((meals: Meal[]): DailySummary => {
    return meals.reduce((summary, meal) => {
      return {
        calories: summary.calories + meal.calories,
        protein: summary.protein + meal.protein,
        carbs: summary.carbs + meal.carbs,
        fat: summary.fat + meal.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, []);

  // Get meals for today with improved caching strategy
  const { 
    data: todayMeals = DEFAULT_MEALS, 
    isLoading: isLoadingTodayMeals,
    isError: isTodayMealsError,
  } = useQuery({
    queryKey: userId ? [`/api/users/${userId}/meals`] : ['placeholder/todayMeals'],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes - keep data in cache for 10 minutes
    refetchInterval: 0, // Desabilita o refetch automático
    refetchOnWindowFocus: false, // Desabilita o refetch ao dar foco à janela
    retry: 1, // Apenas uma tentativa de refazer a requisição
    onSuccess: (data) => {
      console.log("Requisição bem-sucedida para hoje:", data);
    },
    onError: (error) => {
      console.log("Erro na requisição:", error);
    },
  });

  // Calculate today's summary from the meals - ensure we have proper Meal[] type
  const todaySummary = calculateDailySummary(todayMeals as Meal[]);

  // Get a week of meals for reports with improved caching
  const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd');
  const weekEnd = today;

  const { 
    data: weeklyMeals = DEFAULT_MEALS,
    isLoading: isLoadingWeeklyMeals,
    isError: isWeeklyMealsError,
  } = useQuery({
    queryKey: userId ? [`/api/users/${userId}/meals`] : ['placeholder/weeklyMeals'],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchInterval: 0, // Desabilita o refetch automático
    refetchOnWindowFocus: false, // Desabilita o refetch ao dar foco à janela
    retry: 1, // Apenas uma tentativa de refazer a requisição
  });

  // Group weekly meals by date (memoized to prevent recalculations)
  const weeklyData = useCallback(() => {
    // Ensure we're working with a properly typed Meal array
    const typedWeeklyMeals = weeklyMeals as Meal[];
    
    return [...Array(7)].map((_, index) => {
      const date = format(subDays(new Date(), 6 - index), 'yyyy-MM-dd');
      const day = format(subDays(new Date(), 6 - index), 'EEEE', { locale: ptBR });
      
      const mealsForDay = typedWeeklyMeals.filter((meal: Meal) => meal.date === date);
      const summary = calculateDailySummary(mealsForDay);
      
      return {
        date,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        ...summary
      };
    });
  }, [weeklyMeals, calculateDailySummary]);

  // Get all available foods with longer caching
  const { 
    data: foods = [],
    isLoading: isLoadingFoods,
    isError: isFoodsError,
  } = useQuery<Food[]>({
    queryKey: ['/api/foods'],
    staleTime: 30 * 60 * 1000, // 30 minutes - foods rarely change
    refetchOnWindowFocus: false, // Desabilita o refetch ao dar foco à janela
    retry: 1, // Apenas uma tentativa de refazer a requisição
  });

  // Add a new meal
  const addMealMutation = useMutation({
    mutationFn: async (mealData: Omit<Meal, 'id' | 'createdAt'>) => {
      const res = await apiRequest('POST', '/api/meals', mealData);
      return res.json();
    },
    onSuccess: () => {
      // Only invalidate queries if we have a user ID
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
      }
      toast({
        title: "Refeição adicionada",
        description: "Sua refeição foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar refeição",
        description: "Não foi possível adicionar a refeição. Tente novamente.",
        variant: "destructive",
      });
      console.error("Failed to add meal:", error);
    },
  });

  // Delete a meal
  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: number) => {
      await apiRequest('DELETE', `/api/meals/${mealId}`);
      return mealId;
    },
    onSuccess: (mealId) => {
      // Only invalidate queries if we have a user ID
      if (userId) {
        queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/meals`] });
      }
      toast({
        title: "Refeição removida",
        description: "A refeição foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover refeição",
        description: "Não foi possível remover a refeição. Tente novamente.",
        variant: "destructive",
      });
      console.error("Failed to delete meal:", error);
    },
  });

  // Determine if we're loading or if we encountered errors
  const isLoading = isLoadingTodayMeals || isLoadingWeeklyMeals || isLoadingFoods;
  const isError = isTodayMealsError || isWeeklyMealsError || isFoodsError;

  return {
    todayMeals,
    todaySummary,
    weeklyData: weeklyData(), // Call the memoized function
    foods,
    addMeal: addMealMutation.mutate,
    deleteMeal: deleteMealMutation.mutate,
    isLoading,
    isError,
    isPending: addMealMutation.isPending || deleteMealMutation.isPending,
  };
}
