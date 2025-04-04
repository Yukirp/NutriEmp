import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMeals } from "@/hooks/use-meals";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMacro, getDeficitColor } from "@/lib/utils/nutrition";
import Chart from "chart.js/auto";

export default function Reports() {
  const { weeklyData, isLoading } = useMeals();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("7days");

  const caloriesChartRef = useRef<HTMLCanvasElement>(null);
  const macrosChartRef = useRef<HTMLCanvasElement>(null);
  const caloriesChartInstance = useRef<Chart | null>(null);
  const macrosChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!weeklyData.length || !caloriesChartRef.current || !macrosChartRef.current) return;

    // Destroy previous charts if they exist
    if (caloriesChartInstance.current) {
      caloriesChartInstance.current.destroy();
    }
    
    if (macrosChartInstance.current) {
      macrosChartInstance.current.destroy();
    }

    // Create calories chart
    const caloriesCtx = caloriesChartRef.current.getContext("2d");
    if (caloriesCtx) {
      caloriesChartInstance.current = new Chart(caloriesCtx, {
        type: "bar",
        data: {
          labels: weeklyData.map(d => d.day),
          datasets: [
            {
              label: "Calorias",
              data: weeklyData.map(d => d.calories),
              backgroundColor: "rgba(76, 175, 80, 0.7)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Create macros chart
    const macrosCtx = macrosChartRef.current.getContext("2d");
    if (macrosCtx) {
      // Calculate average macros
      const avgProtein = weeklyData.reduce((sum, day) => sum + day.protein, 0) / weeklyData.length;
      const avgCarbs = weeklyData.reduce((sum, day) => sum + day.carbs, 0) / weeklyData.length;
      const avgFat = weeklyData.reduce((sum, day) => sum + day.fat, 0) / weeklyData.length;

      macrosChartInstance.current = new Chart(macrosCtx, {
        type: "doughnut",
        data: {
          labels: ["Proteínas", "Carboidratos", "Gorduras"],
          datasets: [
            {
              data: [avgProtein, avgCarbs, avgFat],
              backgroundColor: ["#2196F3", "#FF9800", "#F44336"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    // Clean up
    return () => {
      if (caloriesChartInstance.current) {
        caloriesChartInstance.current.destroy();
      }
      if (macrosChartInstance.current) {
        macrosChartInstance.current.destroy();
      }
    };
  }, [weeklyData]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
        <PageHeader title="Relatórios" />
        <Skeleton className="h-[100px] w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
      <PageHeader title="Relatórios" />
      
      {/* Period Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setActiveTab("7days")}
              variant={activeTab === "7days" ? "default" : "outline"}
            >
              Últimos 7 dias
            </Button>
            <Button
              onClick={() => setActiveTab("30days")}
              variant={activeTab === "30days" ? "default" : "outline"}
            >
              Últimos 30 dias
            </Button>
            <Button
              onClick={() => setActiveTab("month")}
              variant={activeTab === "month" ? "default" : "outline"}
            >
              Este mês
            </Button>
            <Button
              onClick={() => setActiveTab("custom")}
              variant={activeTab === "custom" ? "default" : "outline"}
            >
              Personalizado
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Calorias diárias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <canvas ref={caloriesChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Macronutrientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <canvas ref={macrosChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dia</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Calorias</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Proteínas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Carboidratos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gorduras</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Meta</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {weeklyData.map((day, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{day.day}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{day.calories} kcal</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{formatMacro(day.protein)}g</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{formatMacro(day.carbs)}g</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{formatMacro(day.fat)}g</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{user?.dailyCalorieGoal || 2000} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
