import Navigation from "@/components/Navigation";
import StatCard from "@/components/StatCard";
import { Activity, Moon, Heart, Target, TrendingUp, Plus, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { habits, addHabit, toggleHabit, goals, achievements } = useAppContext();

  const [newHabitName, setNewHabitName] = useState("");
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit(newHabitName);
    setNewHabitName("");
    setIsAddHabitOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back! 👋</h1>
            <p className="text-muted-foreground">Here's how you're doing today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Activity}
              label="Active Habits"
              value={habits.length}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              icon={Moon}
              label="Sleep Quality"
              value="7.5hrs"
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              icon={Heart}
              label="Mood Score"
              value="8.2/10"
              trend={{ value: 5, positive: true }}
            />
            <StatCard
              icon={Target}
              label="Goals on Track"
              value="2/3"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Habits */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Today's Habits</h2>
                  <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Habit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Habit</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="habitName" className="mb-2 block">Habit Name</Label>
                        <Input 
                          id="habitName"
                          placeholder="e.g. Drink Water"
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddHabitOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddHabit}>Save Habit</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-4">
                  {habits.map((habit, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-border hover:border-primary/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              habit.completedToday ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{habit.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              🔥 {habit.streak} day streak
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={habit.completedToday ? "default" : "outline"}
                          className={habit.completedToday ? "bg-accent" : ""}
                          onClick={() => toggleHabit(habit.id)}
                        >
                          {habit.completedToday ? "Completed" : "Mark Done"}
                        </Button>
                      </div>
                      <Progress value={habit.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Active Goals */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Active Goals</h2>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-6">
                  {goals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground text-sm">{goal.title}</h3>
                        <span className="text-sm font-semibold text-primary">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress
                        value={(goal.current / goal.target) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6">
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 mt-6 bg-gradient-hero">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/journal")}>
                    <Moon className="w-4 h-4 mr-2" />
                    Log Sleep
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/journal")}>
                    <Heart className="w-4 h-4 mr-2" />
                    Record Mood
                  </Button>
                </div>
              </Card>

              {/* Achievements */}
              <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Recent Badges</h3>
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-4">
                  {achievements.filter(a => a.unlockedAt).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Keep tracking to unlock badges!</p>
                  ) : (
                    achievements.filter(a => a.unlockedAt).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(achievement.unlockedAt!).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
