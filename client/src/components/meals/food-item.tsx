import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Food } from "@/types";
import { calculateCalories, formatMacro } from "@/lib/utils/nutrition";

// Define a FoodInput type for handling partial food data with appropriate types
// Redefine FoodInput type to avoid TypeScript conflicts 
// when assigning numeric values to optional properties
type FoodInput = {
  id?: number;
  name?: string;
  quantity?: number;
  unit?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  calories?: number;
};

interface FoodItemProps {
  index: number;
  food: FoodInput;
  onFoodChange: (index: number, food: FoodInput) => void;
  onRemove: (index: number) => void;
  foodOptions?: Food[];
}

export function FoodItem({ 
  index, 
  food, 
  onFoodChange, 
  onRemove,
  foodOptions = []
}: FoodItemProps) {
  const [selectedFood, setSelectedFood] = useState<string>("");
  
  // Handle food selection change
  useEffect(() => {
    if (selectedFood && foodOptions.length > 0) {
      const foundFood = foodOptions.find(f => f.name === selectedFood);
      if (foundFood) {
        // Preserve the current quantity if it exists, otherwise use the default
        const currentQuantity = food.quantity !== undefined ? food.quantity : foundFood.quantity;
        
        // Calculate macros based on the current quantity proportion
        const quantityRatio = currentQuantity / foundFood.quantity;
        
        onFoodChange(index, {
          name: foundFood.name,
          quantity: currentQuantity,
          unit: foundFood.unit,
          // Scale the nutritional values according to the quantity
          protein: foundFood.protein * quantityRatio,
          carbs: foundFood.carbs * quantityRatio,
          fat: foundFood.fat * quantityRatio,
          calories: foundFood.calories * quantityRatio
        });
      }
    }
  }, [selectedFood, foodOptions, index, onFoodChange, food.quantity]);

  const handleInputChange = (field: keyof Food, value: string | number) => {
    const updatedFood: FoodInput = { ...food };
    
    if (field === 'name') {
      updatedFood.name = value as string;
    } else {
      // Convert to number for numeric fields, accepting decimal places
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      
      // Use type assertion to assign the number value
      if (!isNaN(numericValue)) {
        (updatedFood as any)[field] = numericValue;
      } else {
        (updatedFood as any)[field] = 0;
      }
      
      // For quantity changes, recalculate all macros if we have a selected food
      if (field === 'quantity' && selectedFood) {
        const foundFood = foodOptions.find(f => f.name === selectedFood);
        if (foundFood && numericValue > 0) {
          // Calculate ratio of new quantity to original food quantity
          const quantityRatio = numericValue / foundFood.quantity;
          
          // Update all nutritional values based on the ratio
          updatedFood.protein = foundFood.protein * quantityRatio;
          updatedFood.carbs = foundFood.carbs * quantityRatio;
          updatedFood.fat = foundFood.fat * quantityRatio;
          updatedFood.calories = foundFood.calories * quantityRatio;
        }
      } else if (field === 'protein' || field === 'carbs' || field === 'fat') {
        // For direct edits to macros, just recalculate calories
        updatedFood.calories = calculateCalories(
          updatedFood.protein || 0, 
          updatedFood.carbs || 0, 
          updatedFood.fat || 0
        );
      }
    }
    
    onFoodChange(index, updatedFood);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">Alimento #{index + 1}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(index)}
            className="text-slate-400 hover:text-red-600 h-8 w-8 p-0"
          >
            <i className="ri-delete-bin-line"></i>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Nome do Alimento</Label>
            {foodOptions.length > 0 ? (
              <Select 
                value={selectedFood} 
                onValueChange={(value) => setSelectedFood(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um alimento" />
                </SelectTrigger>
                <SelectContent>
                  {foodOptions.map((option) => (
                    <SelectItem key={option.id} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={food.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Arroz Branco"
                className="text-sm"
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Quantidade</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={food.quantity || ""}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Unidade</Label>
              <Select 
                value={food.unit || "g"} 
                onValueChange={(value) => handleInputChange("unit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">gramas</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="porção">porção</SelectItem>
                  <SelectItem value="unidade">unidade</SelectItem>
                  <SelectItem value="colher">colher</SelectItem>
                  <SelectItem value="fatia">fatia</SelectItem>
                  <SelectItem value="xícara">xícara</SelectItem>
                  <SelectItem value="copo">copo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Proteínas (g)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={food.protein ? formatMacro(food.protein) : ""}
              onChange={(e) => handleInputChange("protein", e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Carboidratos (g)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={food.carbs ? formatMacro(food.carbs) : ""}
              onChange={(e) => handleInputChange("carbs", e.target.value)}
              className="text-sm"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Gorduras (g)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={food.fat ? formatMacro(food.fat) : ""}
              onChange={(e) => handleInputChange("fat", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50 rounded-b-lg">
        <div className="w-full text-right">
          <p className="text-xs text-slate-500">Calorias calculadas</p>
          <p className="font-medium">
            {formatMacro(food.calories || calculateCalories(food.protein || 0, food.carbs || 0, food.fat || 0))} kcal
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
