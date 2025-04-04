import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import AddMeal from "@/pages/add-meal";
import Reports from "@/pages/reports";
import Profile from "@/pages/profile";
import Contact from "@/pages/contact";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/add-meal" component={AddMeal} />
      <Route path="/reports" component={Reports} />
      <Route path="/profile" component={Profile} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<number | null>(null);

  // Check if there's a user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    
    if (storedUser) {
      setUser(parseInt(storedUser));
    } else {
      // Create a default user if none exists
      createDefaultUser();
    }
  }, []);

  // Create a default user 
  const createDefaultUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Usuário',
          age: 30,
          weight: 70,
          height: 170,
          gender: 'male',
          activityLevel: 'moderate',
          dailyCalorieGoal: 2000
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userId', userData.id.toString());
        setUser(userData.id);
      }
    } catch (error) {
      console.error('Failed to create default user:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-primary-700">NutriTrack</h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (Desktop) */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50">
            <Router />
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
