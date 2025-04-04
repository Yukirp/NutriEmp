import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function useUser() {
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  const { 
    data: user, 
    isLoading, 
    error 
  } = useQuery<User>({ 
    queryKey: [userId ? `/api/users/${userId}` : null],
    enabled: !!userId,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      if (!userId) throw new Error("No user ID found");
      const res = await apiRequest('PATCH', `/api/users/${userId}`, userData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
      console.error("Failed to update user:", error);
    },
  });

  const calculateRecommendedCalories = (
    weight: number, 
    height: number, 
    age: number, 
    gender: string, 
    activityLevel: string
  ): number => {
    if (!weight || !height || !age) return 0;
    
    // Harris-Benedict formula
    let bmr = 0;
    
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else if (gender === 'female') {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Activity factor
    let activityFactor = 1.2; // Sedentary
    switch(activityLevel) {
      case 'light': activityFactor = 1.375; break;
      case 'moderate': activityFactor = 1.55; break;
      case 'active': activityFactor = 1.725; break;
      case 'very_active': activityFactor = 1.9; break;
    }
    
    return Math.round(bmr * activityFactor);
  };

  return {
    user,
    userId,
    isLoading,
    error,
    updateUser: updateUserMutation.mutate,
    isPending: updateUserMutation.isPending,
    calculateRecommendedCalories,
  };
}
