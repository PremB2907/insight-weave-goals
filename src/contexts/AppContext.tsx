import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  frequency: 'daily' | 'weekly';
  reminderTime?: string;
  checkIns: string[];
  streak: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
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

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  collaborators: string[];
  shareToken: string;
  shareMode: 'view' | 'edit';
  updatedAt: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  habitName: string;
  longestStreak: number;
  avatar?: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  habits: Habit[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  notes: Note[];
  leaderboard: LeaderboardEntry[];
  addHabit: (name: string, frequency?: 'daily' | 'weekly', reminderTime?: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  updateHabitReminder: (id: string, reminderTime: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'current' | 'color' | 'insights'>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => Promise<void>;
  createNote: (title: string) => Promise<void>;
  updateNoteContent: (id: string, content: string) => Promise<void>;
  renameNote: (id: string, title: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  unlockAchievement: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialAchievements: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Log your first journal entry', icon: 'book', unlockedAt: null },
  { id: 'a2', title: 'Consistent Logger', description: 'Log 3 journal entries', icon: 'pen', unlockedAt: null },
  { id: 'a3', title: 'Habit Builder', description: 'Complete a habit', icon: 'flame', unlockedAt: null },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isLoading, setIsLoading] = useState(true);

  const handleApiError = (error: unknown, message: string) => {
    console.error(error);
    toast.error(message);
  };

  const loadUserData = async () => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const [notesRes, habitsRes, goalsRes, journalRes, leaderboardRes] = await Promise.all([
        api.notes.fetch(),
        api.habits.fetch(),
        api.goals.fetch(),
        api.journal.fetch(),
        api.leaderboard.fetch(),
      ]);

      setNotes(notesRes.notes || []);
      setHabits(habitsRes.habits || []);
      setGoals(goalsRes.goals || []);
      setJournalEntries(journalRes.journalEntries || []);
      setLeaderboard(leaderboardRes.leaderboard || []);
    } catch (error) {
      handleApiError(error, 'Unable to load workspace data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const result = await api.auth.me();
        setCurrentUser(result.user);
        setUsers([result.user]);
      } catch (error) {
        api.auth.signOut();
        setCurrentUser(null);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      setHabits([]);
      setGoals([]);
      setJournalEntries([]);
      setNotes([]);
      setLeaderboard([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const user = await api.auth.signUp(username, email, password);
      setCurrentUser(user);
      setUsers([user]);
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      handleApiError(error, 'Sign up failed.');
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await api.auth.signIn(email, password);
      setCurrentUser(user);
      setUsers([user]);
      toast.success(`Welcome back, ${user.username}`);
      return true;
    } catch (error) {
      handleApiError(error, 'Sign in failed.');
      return false;
    }
  };

  const signOut = () => {
    api.auth.signOut();
    setCurrentUser(null);
    setUsers([]);
    setHabits([]);
    setGoals([]);
    setJournalEntries([]);
    setNotes([]);
    setLeaderboard([]);
    toast.success('Signed out successfully');
  };

  const addHabit = async (name: string, frequency: 'daily' | 'weekly' = 'daily', reminderTime?: string) => {
    try {
      const result = await api.habits.create({ name, frequency, reminderTime });
      setHabits((prev) => [result.habit, ...prev]);
      toast.success('Habit created successfully');
    } catch (error) {
      handleApiError(error, 'Unable to create habit.');
    }
  };

  const updateHabitReminder = async (id: string, reminderTime: string) => {
    try {
      const result = await api.habits.updateReminder(id, reminderTime);
      setHabits((prev) => prev.map((habit) => (habit.id === id ? result.habit : habit)));
      toast.success('Reminder updated');
    } catch (error) {
      handleApiError(error, 'Unable to update reminder.');
    }
  };

  const markHabitForToday = async (id: string) => {
    try {
      const result = await api.habits.checkIn(id);
      setHabits((prev) => prev.map((habit) => (habit.id === id ? result.habit : habit)));
      toast.success('Habit progress saved');
    } catch (error) {
      handleApiError(error, 'Unable to update habit progress.');
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'current' | 'color' | 'insights'>) => {
    try {
      const result = await api.goals.create(goal);
      setGoals((prev) => [result.goal, ...prev]);
      toast.success('Goal saved successfully');
    } catch (error) {
      handleApiError(error, 'Unable to save goal.');
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    try {
      const result = await api.journal.create(entry);
      setJournalEntries((prev) => [result.entry, ...prev]);
      toast.success('Journal entry saved');
    } catch (error) {
      handleApiError(error, 'Unable to save journal entry.');
    }
  };

  const createNote = async (title: string) => {
    try {
      const result = await api.notes.create(title);
      setNotes((prev) => [result.note, ...prev]);
      toast.success('Note created');
    } catch (error) {
      handleApiError(error, 'Unable to create note.');
    }
  };

  const updateNoteContent = async (id: string, content: string) => {
    try {
      const result = await api.notes.update(id, { content });
      setNotes((prev) => prev.map((note) => (note.id === id ? result.note : note)));
    } catch (error) {
      handleApiError(error, 'Unable to save note.');
    }
  };

  const renameNote = async (id: string, title: string) => {
    try {
      const result = await api.notes.update(id, { title });
      setNotes((prev) => prev.map((note) => (note.id === id ? result.note : note)));
    } catch (error) {
      handleApiError(error, 'Unable to rename note.');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.notes.remove(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      toast.success('Note deleted');
    } catch (error) {
      handleApiError(error, 'Unable to delete note.');
    }
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const achievement = prev.find((item) => item.id === id);
      if (achievement && !achievement.unlockedAt) {
        toast.success(`Achievement Unlocked: ${achievement.title}!`, {
          description: achievement.description,
        });
        return prev.map((item) =>
          item.id === id ? { ...item, unlockedAt: new Date().toISOString() } : item,
        );
      }
      return prev;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        habits,
        goals,
        journalEntries,
        notes,
        leaderboard,
        addHabit,
        toggleHabit: markHabitForToday,
        updateHabitReminder,
        addGoal,
        addJournalEntry,
        createNote,
        updateNoteContent,
        renameNote,
        deleteNote,
        signUp,
        signIn,
        signOut,
        unlockAchievement,
      }}
    >
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
