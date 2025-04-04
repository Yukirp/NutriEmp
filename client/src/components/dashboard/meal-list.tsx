import { Meal } from "@/types";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useMeals } from "@/hooks/use-meals";
import { formatMacro } from "@/lib/utils/nutrition";

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  const [, navigate] = useLocation();
  const { deleteMeal, isPending } = useMeals();

  // Function to get meal icon based on meal name
  const getMealIcon = (mealName: string) => {
    const name = mealName.toLowerCase();
    if (name.includes('café') || name.includes('manha'))
      return 'ri-cup-line';
    if (name.includes('almoço'))
      return 'ri-restaurant-line';
    if (name.includes('lanche'))
      return 'ri-cake-2-line';
    if (name.includes('jantar'))
      return 'ri-moon-clear-line';
    return 'ri-restaurant-2-line';
  };
  
  // Function to get meal time color
  const getMealTimeColor = (mealName: string) => {
    const name = mealName.toLowerCase();
    if (name.includes('café') || name.includes('manha'))
      return 'bg-amber-100 text-amber-700';
    if (name.includes('almoço'))
      return 'bg-orange-100 text-orange-700';
    if (name.includes('lanche'))
      return 'bg-blue-100 text-blue-700';
    if (name.includes('jantar'))
      return 'bg-indigo-100 text-indigo-700';
    return 'bg-primary-100 text-primary-700';
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/60 rounded-2xl shadow-lg p-6 border border-slate-200/50 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-100/20 rounded-full blur-2xl"></div>
      
      <div className="flex justify-between items-center mb-6 relative">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md mr-3">
            <i className="ri-restaurant-2-fill text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Refeições de Hoje</h2>
        </div>
        <Button
          onClick={() => navigate("/add-meal")}
          className="rounded-xl px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white shadow-md flex items-center gap-2 font-medium transition-all duration-200 hover:shadow-lg text-base"
        >
          <i className="ri-add-line text-lg"></i> Adicionar
        </Button>
      </div>
      
      {/* Meal List - Modern Style */}
      <div className="space-y-4 relative">
        {meals.length > 0 ? (
          meals.map((meal) => (
            <div 
              key={meal.id} 
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Meal Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 bg-gradient-to-br 
                  ${meal.name.toLowerCase().includes('café') || meal.name.toLowerCase().includes('manha')
                    ? 'from-amber-400 to-amber-500 text-white'
                    : meal.name.toLowerCase().includes('almoço')
                      ? 'from-orange-400 to-orange-500 text-white'
                      : meal.name.toLowerCase().includes('jantar')
                        ? 'from-indigo-400 to-indigo-500 text-white'
                        : 'from-primary-400 to-primary-500 text-white'
                  }`}
                >
                  <i className={`${getMealIcon(meal.name)} text-2xl`}></i>
                </div>
                
                {/* Meal Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-xl text-slate-800">{meal.name}</h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full inline-flex items-center gap-1 ${getMealTimeColor(meal.name)}`}>
                      <i className="ri-time-line"></i> {meal.time}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {meal.foods.map((food, idx) => (
                      <span key={idx} className="inline-flex items-center text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md mr-1 mb-1">
                        {food.name}
                      </span>
                    ))}
                  </div>
                  
                  {/* Nutrition Stats */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <div className="bg-slate-50 p-2 rounded-lg text-center">
                      <div className="text-sm font-semibold text-slate-800">{meal.calories}</div>
                      <div className="text-xs text-slate-500">kcal</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg text-center">
                      <div className="text-sm font-semibold text-blue-700">{formatMacro(meal.protein)}g</div>
                      <div className="text-xs text-slate-500">Proteína</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-lg text-center">
                      <div className="text-sm font-semibold text-amber-700">{formatMacro(meal.carbs)}g</div>
                      <div className="text-xs text-slate-500">Carbos</div>
                    </div>
                    <div className="bg-rose-50 p-2 rounded-lg text-center">
                      <div className="text-sm font-semibold text-rose-700">{formatMacro(meal.fat)}g</div>
                      <div className="text-xs text-slate-500">Gordura</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => deleteMeal(meal.id)}
                  disabled={isPending}
                >
                  <i className="ri-delete-bin-line mr-1"></i> Remover
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-10 text-center shadow-sm border border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-primary-400 mb-5">
              <i className="ri-restaurant-line text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhuma refeição registrada</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Registre suas refeições para acompanhar sua nutrição diária e alcançar suas metas de saúde.
            </p>
            <Button 
              onClick={() => navigate("/add-meal")}
              className="rounded-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white shadow-md inline-flex items-center gap-2 font-medium transition-all duration-200 hover:shadow-lg text-base"
            >
              <i className="ri-add-circle-line text-xl"></i> Adicionar Primeira Refeição
            </Button>
          </div>
        )}
      </div>
      
      {/* Quick Add Panel */}
      {meals.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-primary-50 to-slate-50 p-4 rounded-xl border border-primary-100/50 flex flex-wrap items-center justify-between">
          <div className="flex items-center mr-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
              <i className="ri-speed-line text-xl"></i>
            </div>
            <p className="text-sm text-primary-800">
              <span className="font-medium">Adição Rápida:</span> Registre suas refeições comuns com apenas um clique
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="bg-white shadow-sm hover:bg-primary-50 text-amber-700 border-amber-200 font-medium" onClick={() => navigate("/add-meal")}>
              <i className="ri-cup-line mr-1 text-amber-500"></i> Café da Manhã
            </Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm hover:bg-primary-50 text-orange-700 border-orange-200 font-medium" onClick={() => navigate("/add-meal")}>
              <i className="ri-restaurant-line mr-1 text-orange-500"></i> Almoço
            </Button>
            <Button variant="outline" size="sm" className="bg-white shadow-sm hover:bg-primary-50 text-indigo-700 border-indigo-200 font-medium" onClick={() => navigate("/add-meal")}>
              <i className="ri-moon-clear-line mr-1 text-indigo-500"></i> Jantar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
