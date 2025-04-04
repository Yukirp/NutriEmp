import { 
  User, InsertUser, 
  Meal, InsertMeal,
  Food, InsertFood,
  ContactMessage, InsertContactMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Meal operations
  getMeal(id: number): Promise<Meal | undefined>;
  getMealsByUserAndDate(userId: number, date: string): Promise<Meal[]>;
  getMealsByUserAndDateRange(userId: number, startDate: string, endDate: string): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: number, meal: Partial<InsertMeal>): Promise<Meal | undefined>;
  deleteMeal(id: number): Promise<boolean>;
  
  // Food operations
  getFood(id: number): Promise<Food | undefined>;
  getFoodByName(name: string): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Storage properties for debugging
  meals: Map<number, Meal>;
  users: Map<number, User>;
  foods: Map<number, Food>;
}

export class MemStorage implements IStorage {
  public users: Map<number, User>;
  public meals: Map<number, Meal>;
  public foods: Map<number, Food>;
  private contactMessages: Map<number, ContactMessage>;
  private currentUserId: number;
  private currentMealId: number;
  private currentFoodId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.meals = new Map();
    this.foods = new Map();
    this.contactMessages = new Map();
    this.currentUserId = 1;
    this.currentMealId = 1;
    this.currentFoodId = 1;
    this.currentContactMessageId = 1;
    
    // Adicionar usuários padrão para teste
    this.users.set(1, {
      id: 1,
      name: 'Usuário Teste',
      age: 30,
      weight: 75,
      height: 175,
      gender: 'male',
      activityLevel: 'moderate',
      dailyCalorieGoal: 2500,
      createdAt: new Date()
    });
    
    this.users.set(2, {
      id: 2,
      name: 'Segundo Usuário',
      age: 25,
      weight: 65,
      height: 168,
      gender: 'female',
      activityLevel: 'active',
      dailyCalorieGoal: 2300,
      createdAt: new Date()
    });
    
    // Manter o contador de ID atualizado
    this.currentUserId = 3;
    
    // Add some common foods to the database
    const commonFoods: InsertFood[] = [
      { name: 'Arroz Branco', quantity: 100, unit: 'g', protein: 2.7, carbs: 28.2, fat: 0.3 },
      { name: 'Feijão', quantity: 100, unit: 'g', protein: 6.7, carbs: 14, fat: 0.9 },
      { name: 'Frango Grelhado', quantity: 100, unit: 'g', protein: 31, carbs: 0, fat: 3.6 },
      { name: 'Carne Bovina', quantity: 100, unit: 'g', protein: 26, carbs: 0, fat: 15 },
      { name: 'Ovo', quantity: 1, unit: 'unidade', protein: 6, carbs: 0.6, fat: 5 },
      { name: 'Pão Francês', quantity: 1, unit: 'unidade', protein: 4, carbs: 15, fat: 1 },
      { name: 'Banana', quantity: 1, unit: 'unidade', protein: 1.1, carbs: 22.8, fat: 0.3 },
      { name: 'Maçã', quantity: 1, unit: 'unidade', protein: 0.3, carbs: 13.8, fat: 0.2 },
      { name: 'Leite', quantity: 250, unit: 'ml', protein: 8.3, carbs: 12.2, fat: 7.9 },
    ];
    
    commonFoods.forEach(food => this.createFood(food));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { 
      ...user, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Meal operations
  async getMeal(id: number): Promise<Meal | undefined> {
    return this.meals.get(id);
  }

  async getMealsByUserAndDate(userId: number, date: string): Promise<Meal[]> {
    return Array.from(this.meals.values())
      .filter(meal => meal.userId === userId && meal.date === date);
  }

  async getMealsByUserAndDateRange(userId: number, startDate: string, endDate: string): Promise<Meal[]> {
    return Array.from(this.meals.values())
      .filter(meal => {
        return meal.userId === userId && 
               meal.date >= startDate && 
               meal.date <= endDate;
      });
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const id = this.currentMealId++;
    
    // Debug
    console.log(`Creating meal with ID: ${id}, userId: ${meal.userId}, date: ${meal.date}, name: ${meal.name}`);
    
    // Calculate total calories based on macros
    const calories = meal.foods.reduce((total, food) => {
      return total + (food.protein * 4 + food.carbs * 4 + food.fat * 9);
    }, 0);
    
    const newMeal: Meal = {
      ...meal,
      id,
      calories: Math.round(calories),
      createdAt: new Date()
    };
    
    this.meals.set(id, newMeal);
    
    // Debug: list all meals after adding
    console.log(`Total meals after adding: ${this.meals.size}`);
    console.log(`Meals for user ${meal.userId}: ${Array.from(this.meals.values()).filter(m => m.userId === meal.userId).length}`);
    console.log(`Today's meals for user ${meal.userId}: ${Array.from(this.meals.values())
      .filter(m => m.userId === meal.userId && m.date === meal.date).length}`);
    
    return newMeal;
  }

  async updateMeal(id: number, mealData: Partial<InsertMeal>): Promise<Meal | undefined> {
    const meal = this.meals.get(id);
    if (!meal) return undefined;
    
    const updatedMeal: Meal = {
      ...meal,
      ...mealData
    };
    
    this.meals.set(id, updatedMeal);
    return updatedMeal;
  }

  async deleteMeal(id: number): Promise<boolean> {
    return this.meals.delete(id);
  }

  // Food operations
  async getFood(id: number): Promise<Food | undefined> {
    return this.foods.get(id);
  }

  async getFoodByName(name: string): Promise<Food | undefined> {
    return Array.from(this.foods.values())
      .find(food => food.name.toLowerCase() === name.toLowerCase());
  }

  async createFood(food: InsertFood): Promise<Food> {
    const id = this.currentFoodId++;
    
    // Calculate calories based on macros
    const calories = (food.protein * 4) + (food.carbs * 4) + (food.fat * 9);
    
    const newFood: Food = {
      ...food,
      id,
      calories
    };
    
    this.foods.set(id, newFood);
    return newFood;
  }

  // Contact operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const newMessage: ContactMessage = {
      ...message,
      id,
      createdAt: new Date()
    };
    
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
