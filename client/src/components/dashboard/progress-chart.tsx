import { useEffect, useRef } from "react";
import { WeeklyData } from "@/types";
import { useUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "chart.js/auto";

interface ProgressChartProps {
  weeklyData: WeeklyData[];
}

export function ProgressChart({ weeklyData }: ProgressChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"line", any, string> | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!chartRef.current || !weeklyData.length) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: weeklyData.map(d => d.day),
        datasets: [
          {
            label: "Calorias",
            data: weeklyData.map(d => d.calories),
            borderColor: "#FF9800",
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Meta",
            data: weeklyData.map(() => user?.dailyCalorieGoal || 2000),
            borderColor: "#4CAF50",
            borderDash: [5, 5],
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [weeklyData, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso da Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
