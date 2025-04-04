import { useState } from "react";
import { format } from "date-fns";
import { useLocation } from "wouter";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodItem } from "@/components/meals/food-item";
import { useMeals } from "@/hooks/use-meals";
import { useUser } from "@/hooks/use-user";
import { calculateMealTotals, formatMacro } from "@/lib/utils/nutrition";
import { Food } from "@/types";

export default function AddMeal() {
  const [, navigate] = useLocation();
  const { userId } = useUser();
  const { addMeal, foods, isPending } = useMeals();
  
  const [mealForm, setMealForm] = useState({
    name: "Café da Manhã",
    time: format(new Date(), "HH:mm"),
    foods: [] as Partial<Food>[],
  });

  const handleMealNameChange = (preset: string) => {
    setMealForm(prev => ({ ...prev, name: preset }));
  };

  const handleAddFoodItem = () => {
    setMealForm(prev => ({
      ...prev,
      foods: [
        ...prev.foods,
        {
          name: "",
          quantity: 100,
          unit: "g",
          protein: 0,
          carbs: 0,
          fat: 0,
          calories: 0,
        },
      ],
    }));
  };

  const handleFoodChange = (index: number, updatedFood: Partial<Food>) => {
    const newFoods = [...mealForm.foods];
    newFoods[index] = updatedFood;
    setMealForm(prev => ({ ...prev, foods: newFoods }));
  };

  const handleRemoveFoodItem = (index: number) => {
    setMealForm(prev => ({
      ...prev,
      foods: prev.foods.filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveMeal = () => {
    if (!userId) return;
    
    const today = format(new Date(), "yyyy-MM-dd");
    const mealTotals = calculateMealTotals(mealForm.foods as Food[]);
    
    addMeal({
      userId,
      name: mealForm.name,
      time: mealForm.time,
      date: today,
      foods: mealForm.foods as Food[],
      ...mealTotals
    });
    
    navigate("/");
  };

  const mealTotals = calculateMealTotals(mealForm.foods as Food[]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24 md:pb-0">
      <PageHeader 
        title="Adicionar Refeição" 
        showBackButton 
      />
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Nome da Refeição</Label>
            <div className="flex flex-wrap gap-2">
              <Button 
                type="button"
                variant={mealForm.name === "Café da Manhã" ? "default" : "outline"}
                onClick={() => handleMealNameChange("Café da Manhã")}
              >
                Café da Manhã
              </Button>
              <Button
                type="button"
                variant={mealForm.name === "Almoço" ? "default" : "outline"}
                onClick={() => handleMealNameChange("Almoço")}
              >
                Almoço
              </Button>
              <Button
                type="button"
                variant={mealForm.name === "Jantar" ? "default" : "outline"}
                onClick={() => handleMealNameChange("Jantar")}
              >
                Jantar
              </Button>
              <Button
                type="button"
                variant={mealForm.name === "Lanche" ? "default" : "outline"}
                onClick={() => handleMealNameChange("Lanche")}
              >
                Lanche
              </Button>
            </div>
            <Input
              value={mealForm.name}
              onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ou digite um nome customizado"
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Horário</Label>
            <Input
              type="time"
              value={mealForm.time}
              onChange={(e) => setMealForm(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
          
          {/* Food Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Alimentos</Label>
              <Button 
                variant="link" 
                className="text-primary-600" 
                onClick={handleAddFoodItem}
              >
                <i className="ri-add-line mr-1"></i> Adicionar Alimento
              </Button>
            </div>
            
            <div className="space-y-3">
              {mealForm.foods.map((food, index) => (
                <FoodItem
                  key={index}
                  index={index}
                  food={food}
                  onFoodChange={handleFoodChange}
                  onRemove={handleRemoveFoodItem}
                  foodOptions={foods}
                />
              ))}
              
              {mealForm.foods.length === 0 && (
                <div className="text-center py-8 border border-dashed border-slate-300 rounded-lg">
                  <div className="text-slate-400 mb-1">
                    <i className="ri-restaurant-line text-3xl"></i>
                  </div>
                  <p className="text-slate-500 text-sm">Nenhum alimento adicionado</p>
                  <Button
                    onClick={handleAddFoodItem}
                    className="mt-2"
                  >
                    <i className="ri-add-line mr-1"></i> Adicionar Alimento
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Meal Summary */}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <h3 className="font-medium mb-2">Resumo da Refeição</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Calorias</div>
                <div className="text-lg font-semibold">
                  {mealTotals.calories} kcal
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Proteínas</div>
                <div className="text-lg font-semibold">
                  {formatMacro(mealTotals.protein)}g
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Carboidratos</div>
                <div className="text-lg font-semibold">
                  {formatMacro(mealTotals.carbs)}g
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-xs text-slate-500">Gorduras</div>
                <div className="text-lg font-semibold">
                  {formatMacro(mealTotals.fat)}g
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveMeal}
              disabled={isPending || mealForm.foods.length === 0}
            >
              Salvar Refeição
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
