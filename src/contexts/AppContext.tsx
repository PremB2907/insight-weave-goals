import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completed: boolean;
  progress: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  insights: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleepHours: number;
  sleepQuality: number;
  preview: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

interface AppContextType {
  habits: Habit[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  addHabit: (name: string) => void;
  toggleHabit: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id" | "current" | "color" | "insights">) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "date">) => void;
  achievements: Achievement[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy seed data for phase 2 advanced analysis logic
const initialHabits: Habit[] = [
  { id: '1', name: "Morning Exercise", streak: 12, completed: true, progress: 100 },
  { id: '2', name: "Reading", streak: 8, completed: true, progress: 100 },
  { id: '3', name: "Meditation", streak: 15, completed: false, progress: 0 },
  { id: '4', name: "Hydration", streak: 20, completed: true, progress: 100 },
];

const initialGoals: Goal[] = [
  { id: '1', title: "Exercise 4 times per week", description: "Based on your mood patterns, regular exercise improves your emotional well-being by 23%", current: 3, target: 4, unit: "workouts", color: "primary", insights: ["Best days: Tuesday, Thursday", "Morning sessions most effective"] },
  { id: '2', title: "Sleep 8 hours nightly", description: "Your energy levels are 15% higher on days with 7.5+ hours of sleep", current: 7.2, target: 8, unit: "hours", color: "accent", insights: ["Consistent bedtime helps", "Avoid screens after 9 PM"] },
  { id: '3', title: "Meditate 10 minutes daily", description: "Meditation days correlate with 18% lower stress scores", current: 6, target: 10, unit: "minutes", color: "secondary", insights: ["Morning practice recommended", "Use breathing exercises"] }
];

const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const initialEntries: JournalEntry[] = [
  { id: 'e1', date: getPastDate(1), mood: 8, energy: 7, stress: 4, sleepHours: 7.5, sleepQuality: 8, preview: "Had a productive day! Completed my workout and..." },
  { id: 'e2', date: getPastDate(2), mood: 6, energy: 5, stress: 7, sleepHours: 6.0, sleepQuality: 5, preview: "Felt a bit tired but managed to stay focused on..." },
  { id: 'e3', date: getPastDate(3), mood: 9, energy: 9, stress: 3, sleepHours: 8.5, sleepQuality: 9, preview: "Amazing day! Everything went smoothly and I felt..." },
  { id: 'e4', date: getPastDate(4), mood: 7, energy: 6, stress: 5, sleepHours: 7.0, sleepQuality: 7, preview: "Normal day, got things done." },
  { id: 'e5', date: getPastDate(5), mood: 8, energy: 8, stress: 4, sleepHours: 8.0, sleepQuality: 8, preview: "Good sleep made a huge difference today." },
  { id: 'e6', date: getPastDate(6), mood: 5, energy: 4, stress: 8, sleepHours: 5.5, sleepQuality: 4, preview: "Rough night, feeling very sluggish." },
];

const initialAchievements: Achievement[] = [
  { id: 'a1', title: "First Steps", description: "Log your first journal entry", icon: "book", unlockedAt: null },
  { id: 'a2', title: "Consistent Logger", description: "Log 3 journal entries", icon: "pen", unlockedAt: null },
  { id: 'a3', title: "Habit Builder", description: "Complete a habit", icon: "flame", unlockedAt: null },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('paradigm_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('paradigm_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('paradigm_entries');
    return saved ? JSON.parse(saved) : initialEntries;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('paradigm_achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  useEffect(() => {
    localStorage.setItem('paradigm_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('paradigm_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('paradigm_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('paradigm_achievements', JSON.stringify(achievements));
  }, [achievements]);

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const achievement = prev.find(a => a.id === id);
      if (achievement && !achievement.unlockedAt) {
        toast.success(`Achievement Unlocked: ${achievement.title}!`, {
          description: achievement.description,
        });
        return prev.map(a => a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a);
      }
      return prev;
    });
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      streak: 0,
      completed: false,
      progress: 0,
    };
    setHabits([newHabit, ...habits]);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const completed = !h.completed;
        if (completed) {
          unlockAchievement('a3');
        }
        return { ...h, completed, progress: completed ? 100 : 0 };
      }
      return h;
    }));
  };

  const addGoal = (goal: Omit<Goal, "id" | "current" | "color" | "insights">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      current: 0,
      color: "primary",
      insights: ["Keep tracking to gather insights"],
    };
    setGoals([newGoal, ...goals]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, "id" | "date">) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const newEntries = [newEntry, ...journalEntries];
    setJournalEntries(newEntries);
    
    // Check achievements
    if (newEntries.length === 1 || newEntries.length === 7) {
      unlockAchievement('a1'); 
    }
    if (newEntries.length >= 3) {
      unlockAchievement('a2');
    }
  };

  return (
    <AppContext.Provider value={{ habits, goals, journalEntries, achievements, addHabit, toggleHabit, addGoal, addJournalEntry }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
