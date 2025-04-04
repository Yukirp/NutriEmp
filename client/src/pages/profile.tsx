import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateBMI, getBMICategory } from "@/lib/utils/nutrition";

export default function Profile() {
  const { user, isLoading, updateUser, isPending, calculateRecommendedCalories } = useUser();
  const [userForm, setUserForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
    dailyCalorieGoal: "",
  });
  const [recommendedCalories, setRecommendedCalories] = useState(0);

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || "",
        age: user.age?.toString() || "",
        weight: user.weight?.toString() || "",
        height: user.height?.toString() || "",
        gender: user.gender || "",
        activityLevel: user.activityLevel || "",
        dailyCalorieGoal: user.dailyCalorieGoal?.toString() || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculateCalories = () => {
    const calories = calculateRecommendedCalories(
      parseFloat(userForm.weight),
      parseFloat(userForm.height),
      parseInt(userForm.age),
      userForm.gender,
      userForm.activityLevel
    );
    
    setRecommendedCalories(calories);
    setUserForm(prev => ({ ...prev, dailyCalorieGoal: calories.toString() }));
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      name: userForm.name,
      age: userForm.age ? parseInt(userForm.age) : undefined,
      weight: userForm.weight ? parseFloat(userForm.weight) : undefined,
      height: userForm.height ? parseInt(userForm.height) : undefined,
      gender: userForm.gender || undefined,
      activityLevel: userForm.activityLevel || undefined,
      dailyCalorieGoal: userForm.dailyCalorieGoal ? parseInt(userForm.dailyCalorieGoal) : undefined,
    };
    
    updateUser(updatedUser);
  };

  const handleReset = () => {
    if (user) {
      setUserForm({
        name: user.name || "",
        age: user.age?.toString() || "",
        weight: user.weight?.toString() || "",
        height: user.height?.toString() || "",
        gender: user.gender || "",
        activityLevel: user.activityLevel || "",
        dailyCalorieGoal: user.dailyCalorieGoal?.toString() || "",
      });
    }
  };

  // Calculate BMI
  const bmi = calculateBMI(
    parseFloat(userForm.weight) || 0,
    parseInt(userForm.height) || 0
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
        <PageHeader title="Perfil" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-16 md:pb-0">
      <PageHeader title="Perfil" />
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input
                value={userForm.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <Label>Idade</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={userForm.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={userForm.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={userForm.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>
          </div>
          
          {bmi > 0 && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">
                Seu IMC: <span className="font-medium">{bmi}</span> - {getBMICategory(bmi)}
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            <Label>Gênero</Label>
            <Select
              value={userForm.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label>Nível de Atividade</Label>
            <Select
              value={userForm.activityLevel}
              onValueChange={(value) => handleInputChange("activityLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu nível de atividade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                <SelectItem value="light">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
                <SelectItem value="moderate">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
                <SelectItem value="active">Muito ativo (exercício intenso 6-7 dias/semana)</SelectItem>
                <SelectItem value="very_active">Extremamente ativo (exercício muito intenso, trabalho físico)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label>Meta de Calorias Diárias</Label>
            <div className="flex items-center">
              <Input
                type="number"
                min="0"
                step="50"
                value={userForm.dailyCalorieGoal}
                onChange={(e) => handleInputChange("dailyCalorieGoal", e.target.value)}
              />
              <Button
                className="ml-2"
                variant="outline"
                onClick={handleCalculateCalories}
                disabled={!userForm.weight || !userForm.height || !userForm.age || !userForm.gender || !userForm.activityLevel}
              >
                Calcular
              </Button>
            </div>
            {recommendedCalories > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Baseado nos seus dados, recomendamos cerca de {recommendedCalories} kcal por dia.
              </p>
            )}
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isPending}
            >
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
