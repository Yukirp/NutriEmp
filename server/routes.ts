import { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertMealSchema, 
  insertFoodSchema,
  insertContactMessageSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { data: null, error: fromZodError(error).message };
      }
      return { data: null, error: "Invalid data format" };
    }
  };

  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertUserSchema, req.body);
    if (error) return res.status(400).json({ message: error });
    
    try {
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    
    try {
      const user = await storage.getUser(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    
    try {
      const user = await storage.getUser(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const updatedUser = await storage.updateUser(id, req.body);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Meal routes
  app.post("/api/meals", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertMealSchema, req.body);
    if (error) return res.status(400).json({ message: error });
    
    try {
      const meal = await storage.createMeal(data);
      res.status(201).json(meal);
    } catch (err) {
      res.status(500).json({ message: "Failed to create meal" });
    }
  });

  app.get("/api/meals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    
    try {
      const meal = await storage.getMeal(id);
      if (!meal) return res.status(404).json({ message: "Meal not found" });
      
      res.status(200).json(meal);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch meal" });
    }
  });

  app.get("/api/users/:userId/meals", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID format" });
    
    // Check if user exists first
    try {
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { date, startDate, endDate } = req.query;
      
      console.log(`GET /api/users/${userId}/meals - Query params:`, { date, startDate, endDate });
      
      // Get all meals from user - simpler approach to debug
      const allUserMeals = Array.from(storage.meals.values())
        .filter(meal => meal.userId === userId);
      
      console.log(`Found ${allUserMeals.length} meals for user ${userId}`);
      
      if (allUserMeals.length > 0) {
        console.log('First meal:', {
          id: allUserMeals[0].id,
          userId: allUserMeals[0].userId,
          date: allUserMeals[0].date,
          name: allUserMeals[0].name
        });
      }
      
      if (date) {
        // Get meals for a specific date
        const meals = await storage.getMealsByUserAndDate(userId, date as string);
        console.log(`Found ${meals.length} meals for user ${userId} on date ${date}`);
        return res.status(200).json(meals);
      } else if (startDate && endDate) {
        // Get meals for a date range
        const meals = await storage.getMealsByUserAndDateRange(
          userId, 
          startDate as string, 
          endDate as string
        );
        console.log(`Found ${meals.length} meals for user ${userId} from ${startDate} to ${endDate}`);
        return res.status(200).json(meals);
      } else {
        // If no parameters provided, return all user meals to help debug
        console.log(`Returning all ${allUserMeals.length} meals for user ${userId}`);
        return res.status(200).json(allUserMeals);
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.patch("/api/meals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    
    try {
      const meal = await storage.getMeal(id);
      if (!meal) return res.status(404).json({ message: "Meal not found" });
      
      const updatedMeal = await storage.updateMeal(id, req.body);
      res.status(200).json(updatedMeal);
    } catch (err) {
      res.status(500).json({ message: "Failed to update meal" });
    }
  });

  app.delete("/api/meals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID format" });
    
    try {
      const meal = await storage.getMeal(id);
      if (!meal) return res.status(404).json({ message: "Meal not found" });
      
      await storage.deleteMeal(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete meal" });
    }
  });

  // Food routes
  app.post("/api/foods", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertFoodSchema, req.body);
    if (error) return res.status(400).json({ message: error });
    
    try {
      const food = await storage.createFood(data);
      res.status(201).json(food);
    } catch (err) {
      res.status(500).json({ message: "Failed to create food" });
    }
  });

  app.get("/api/foods", async (req: Request, res: Response) => {
    const { name } = req.query;
    
    try {
      if (name) {
        const food = await storage.getFoodByName(name as string);
        if (!food) return res.status(404).json({ message: "Food not found" });
        
        res.status(200).json(food);
      } else {
        // Return all foods (ideally would add pagination)
        const foods = Array.from((storage as any).foods.values());
        res.status(200).json(foods);
      }
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch foods" });
    }
  });

  // Contact message routes
  app.post("/api/contact", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertContactMessageSchema, req.body);
    if (error) return res.status(400).json({ message: error });
    
    try {
      const message = await storage.createContactMessage(data);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (err) {
      res.status(500).json({ message: "Failed to send contact message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
