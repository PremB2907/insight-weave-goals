import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";

const Goals = () => {
  const { goals: activeGoals, addGoal, journalEntries } = useAppContext();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", target: 0, unit: "" });

  const handleAddGoal = () => {
    if (!newGoal.title.trim() || newGoal.target <= 0 || !newGoal.unit.trim()) return;
    addGoal({
      title: newGoal.title,
      description: "Manually added goal",
      target: newGoal.target,
      unit: newGoal.unit
    });
    setNewGoal({ title: "", target: 0, unit: "" });
    setIsAddGoalOpen(false);
  };

  const dynamicSuggestedGoals = useMemo(() => {
    if (!journalEntries || journalEntries.length === 0) return [];
    
    // Calculate averages
    const avgSleep = journalEntries.reduce((acc, curr) => acc + curr.sleepHours, 0) / journalEntries.length;
    const avgStress = journalEntries.reduce((acc, curr) => acc + curr.stress, 0) / journalEntries.length;
    
    const suggestions = [];
    
    if (avgSleep < 7) {
      suggestions.push({
        title: "Sleep 8 hours nightly",
        reason: `Your average sleep is currently only ${avgSleep.toFixed(1)} hours.`,
        impact: "Could improve daily energy by 20%"
      });
    }
    
    if (avgStress > 5) {
      suggestions.push({
        title: "Meditate 10 minutes daily",
        reason: `Your average stress level is elevated (${avgStress.toFixed(1)}/10).`,
        impact: "Meditation correlates with lower stress"
      });
    }
    
    if (suggestions.length === 0) {
      suggestions.push({
        title: "Morning journaling routine",
        reason: "Days with morning reflection show better mood scores",
        impact: "Potential 15% mood boost"
      });
    }
    
    return suggestions;
  }, [journalEntries]);

  const completedGoals = [
    { title: "Walk 10,000 steps daily", completedDate: "2 weeks ago", duration: "30 days" },
    { title: "Drink 8 glasses of water", completedDate: "1 month ago", duration: "21 days" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Goals</h1>
            <p className="text-muted-foreground">Personalized goals based on your patterns and insights</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Active Goals */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Active Goals</h2>
                <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Custom Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Custom Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="title" className="mb-2 block">Goal Title</Label>
                        <Input 
                          id="title"
                          placeholder="e.g. Read 3 books"
                          value={newGoal.title}
                          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="target" className="mb-2 block">Target Value</Label>
                          <Input 
                            id="target"
                            type="number"
                            min="1"
                            value={newGoal.target || ""}
                            onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit" className="mb-2 block">Unit</Label>
                          <Input 
                            id="unit"
                            placeholder="e.g. books"
                            value={newGoal.unit}
                            onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddGoal}>Save Goal</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {activeGoals.map((goal, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-accent flex-shrink-0" />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Progress</span>
                      <span className="text-lg font-bold text-primary">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">💡 Insights</p>
                    <ul className="space-y-1">
                      {goal.insights.map((insight, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start">
                          <span className="mr-2">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Suggested Goals */}
              <Card className="p-6 bg-gradient-hero">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Suggested Goals
                </h3>
                <div className="space-y-4">
                  {dynamicSuggestedGoals.map((goal, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{goal.reason}</p>
                      <p className="text-xs font-medium text-accent mb-3">{goal.impact}</p>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => {
                        setNewGoal({ title: goal.title, target: 1, unit: "times" });
                        setIsAddGoalOpen(true);
                      }}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add Goal
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Completed Goals */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-accent" />
                  Completed
                </h3>
                <div className="space-y-3">
                  {completedGoals.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.completedDate} • {goal.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
