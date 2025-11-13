import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, CheckCircle2, Circle } from "lucide-react";

const Goals = () => {
  const activeGoals = [
    {
      title: "Exercise 4 times per week",
      description: "Based on your mood patterns, regular exercise improves your emotional well-being by 23%",
      current: 3,
      target: 4,
      unit: "workouts",
      color: "primary",
      insights: ["Best days: Tuesday, Thursday", "Morning sessions most effective"]
    },
    {
      title: "Sleep 8 hours nightly",
      description: "Your energy levels are 15% higher on days with 7.5+ hours of sleep",
      current: 7.2,
      target: 8,
      unit: "hours",
      color: "accent",
      insights: ["Consistent bedtime helps", "Avoid screens after 9 PM"]
    },
    {
      title: "Meditate 10 minutes daily",
      description: "Meditation days correlate with 18% lower stress scores",
      current: 6,
      target: 10,
      unit: "minutes",
      color: "secondary",
      insights: ["Morning practice recommended", "Use breathing exercises"]
    }
  ];

  const suggestedGoals = [
    {
      title: "Reduce evening screen time",
      reason: "High screen time after 8 PM affects your sleep quality",
      impact: "Could improve sleep by 20%"
    },
    {
      title: "Morning journaling routine",
      reason: "Days with morning reflection show better mood scores",
      impact: "Potential 15% mood boost"
    }
  ];

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
                <Button className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Custom Goal
                </Button>
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
                  {suggestedGoals.map((goal, index) => (
                    <div key={index} className="bg-background rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{goal.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{goal.reason}</p>
                      <p className="text-xs font-medium text-accent mb-3">{goal.impact}</p>
                      <Button variant="outline" size="sm" className="w-full">
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
