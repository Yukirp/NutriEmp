import { DailySummary } from "@/types";
import { useUser } from "@/hooks/use-user";
import { calculateCalorieDeficit, getDeficitColor, formatMacro } from "@/lib/utils/nutrition";

interface SummaryCardProps {
  summary: DailySummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const { user } = useUser();
  const dailyGoal = user?.dailyCalorieGoal || 2000;
  
  const calorieDeficit = calculateCalorieDeficit(summary.calories, dailyGoal);
  
  // Calculate percentage for progress bars
  const caloriePercentage = Math.min(100, (summary.calories / dailyGoal) * 100);
  const proteinPercentage = 70; // In a real app, this would be based on goals
  const carbsPercentage = 55;
  const fatPercentage = 40;

  return (
    <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl shadow-lg p-6 border border-primary-100/50 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-100/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-md mr-3">
            <i className="ri-pie-chart-2-fill text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-primary-900">Resumo do Dia</h2>
        </div>
        <div className="flex space-x-2 text-sm mt-3 sm:mt-0">
          <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg shadow-md font-medium">
            <span className="flex items-center gap-1">
              <i className="ri-calendar-check-line"></i>
              <span>Hoje</span>
            </span>
          </button>
          <button className="px-4 py-2 bg-white hover:bg-slate-50 rounded-lg shadow-sm border border-slate-200 font-medium text-slate-700">
            <span className="flex items-center gap-1">
              <i className="ri-calendar-line"></i>
              <span>Ontem</span>
            </span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
        {/* Calories Target - Modern Style */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-100 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center shadow-sm">
              <i className="ri-fire-fill text-lg"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-primary-600">Calorias</div>
              <div className="flex items-end">
                <span className="text-2xl font-bold">{summary.calories}</span>
                <span className="text-sm text-slate-500 ml-1">/ {dailyGoal} kcal</span>
              </div>
            </div>
          </div>
          <div className="mt-2 bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-400 to-primary-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${caloriePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Proteins - Modern Style */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-100 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-sm">
              <i className="ri-heart-pulse-fill text-lg"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-blue-600">Proteínas</div>
              <div className="flex items-end">
                <span className="text-2xl font-bold">{formatMacro(summary.protein)}</span>
                <span className="text-sm text-slate-500 ml-1">g</span>
              </div>
            </div>
          </div>
          <div className="mt-2 bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${proteinPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0g</span>
            <span>Meta</span>
          </div>
        </div>
        
        {/* Carbs - Modern Style */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-100 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-sm">
              <i className="ri-bread-fill text-lg"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-amber-600">Carboidratos</div>
              <div className="flex items-end">
                <span className="text-2xl font-bold">{formatMacro(summary.carbs)}</span>
                <span className="text-sm text-slate-500 ml-1">g</span>
              </div>
            </div>
          </div>
          <div className="mt-2 bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${carbsPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0g</span>
            <span>Meta</span>
          </div>
        </div>
        
        {/* Fats - Modern Style */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-100 transform transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center shadow-sm">
              <i className="ri-drop-fill text-lg"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-rose-600">Gorduras</div>
              <div className="flex items-end">
                <span className="text-2xl font-bold">{formatMacro(summary.fat)}</span>
                <span className="text-sm text-slate-500 ml-1">g</span>
              </div>
            </div>
          </div>
          <div className="mt-2 bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-400 to-rose-600 h-full transition-all duration-1000 ease-out"
              style={{ width: `${fatPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0g</span>
            <span>Meta</span>
          </div>
        </div>
      </div>

      {/* Simplified summary - Modern Style */}
      <div className="mt-8 relative">
        <div className="flex items-center mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center shadow-sm mr-2">
            <i className="ri-scales-3-line text-lg"></i>
          </div>
          <h3 className="text-lg font-bold text-primary-900">Balanço Diário</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <i className="ri-flag-2-fill text-xl"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Meta Diária</div>
              <div className="text-2xl font-bold text-blue-700">{dailyGoal} <span className="text-sm font-normal text-slate-500">kcal</span></div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-amber-600 mr-4">
              <i className="ri-restaurant-fill text-xl"></i>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Consumido Hoje</div>
              <div className="text-2xl font-bold text-amber-700">{summary.calories} <span className="text-sm font-normal text-slate-500">kcal</span></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mini Tip Box */}
      <div className="mt-6 bg-gradient-to-r from-primary-50 to-primary-100/30 p-4 rounded-xl border border-primary-100/50 flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
          <i className="ri-lightbulb-line text-xl"></i>
        </div>
        <p className="text-sm text-primary-700">
          <span className="font-medium">Dica:</span> Tente equilibrar sua ingestão de macronutrientes para alcançar objetivos nutricionais de forma mais eficiente.
        </p>
      </div>
    </div>
  );
}
