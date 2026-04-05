import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Moon, Heart, Brain } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { useMemo } from "react";

const Insights = () => {
  const { journalEntries } = useAppContext();

  const keyInsights = useMemo(() => {
    const avgSleep = journalEntries.reduce((a, b) => a + b.sleepHours, 0) / (journalEntries.length || 1);
    const avgMood = journalEntries.reduce((a, b) => a + b.mood, 0) / (journalEntries.length || 1);
    const avgStress = journalEntries.reduce((a, b) => a + b.stress, 0) / (journalEntries.length || 1);
    
    return [
      {
        icon: Activity,
        title: "Mood Trend",
        trend: avgMood > 6 ? "positive" : "attention",
        description: `Your average mood score is ${avgMood.toFixed(1)}/10`,
        recommendation: avgMood > 6 ? "Your mood is trending positively!" : "Try to engage in more relaxing activities."
      },
      {
        icon: Moon,
        title: "Sleep Patterns",
        trend: avgSleep >= 7 ? "positive" : "attention",
        description: `You are averaging ${avgSleep.toFixed(1)} hours of sleep.`,
        recommendation: avgSleep >= 7 ? "You are getting healthy sleep amounts." : "Consider setting a digital sunset at 8 PM for better rest."
      },
      {
        icon: Heart,
        title: "Emotional Wellness",
        trend: avgStress < 6 ? "positive" : "attention",
        description: `Your average stress is ${avgStress.toFixed(1)}/10`,
        recommendation: avgStress < 6 ? "You are managing stress well." : "Try incorporating daily meditation."
      }
    ];
  }, [journalEntries]);
  const correlations = useMemo(() => {
    const avgSleep = journalEntries.reduce((a, b) => a + b.sleepHours, 0) / (journalEntries.length || 1);
    const sleepStrength = Math.min(100, Math.floor((avgSleep / 8) * 100));
    
    return [
      {
        factor: "Sleep → Energy",
        strength: sleepStrength,
        description: sleepStrength > 70 ? "Strong positive correlation" : "Moderate correlation",
        color: "primary"
      },
      {
        factor: "Stress → Mood",
        strength: 82, // Hardcoded correlation mock for prototype
        description: "Strong negative correlation",
        color: "accent"
      },
      {
        factor: "Logging Habits",
        strength: Math.min(100, journalEntries.length * 15),
        description: "Consistency metric",
        color: "secondary"
      }
    ];
  }, [journalEntries]);

  const weeklyTrends = useMemo(() => {
    return [...journalEntries].slice(0, 7).reverse().map(entry => {
      const d = new Date(entry.date);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayStr,
        mood: entry.mood,
        energy: entry.energy,
        sleep: entry.sleepHours
      };
    });
  }, [journalEntries]);

  const maxValue = 10;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Insights</h1>
            <p className="text-muted-foreground">Discover patterns and connections in your well-being data</p>
          </div>

          {/* Key Insights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Key Discoveries</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {keyInsights.map((insight, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                      <insight.icon className="w-6 h-6 text-primary" />
                    </div>
                    {insight.trend === "positive" ? (
                      <TrendingUp className="w-5 h-5 text-accent" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-foreground">💡 Recommendation</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.recommendation}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weekly Trends Chart */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Weekly Trends</h2>
                <div className="space-y-6">
                  {/* Simple bar chart visualization */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Heart className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-semibold text-foreground">Mood</span>
                    </div>
                    <div className="flex items-end space-x-2 h-32">
                      {weeklyTrends.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-secondary rounded-t-lg transition-all duration-300 hover:bg-secondary/80"
                            style={{ height: `${(day.mood / maxValue) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Activity className="w-4 h-4 text-accent" />
                      <span className="text-sm font-semibold text-foreground">Energy</span>
                    </div>
                    <div className="flex items-end space-x-2 h-32">
                      {weeklyTrends.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-accent rounded-t-lg transition-all duration-300 hover:bg-accent/80"
                            style={{ height: `${(day.energy / maxValue) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Moon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Sleep (hours)</span>
                    </div>
                    <div className="flex items-end space-x-2 h-32">
                      {weeklyTrends.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-primary/80"
                            style={{ height: `${(day.sleep / maxValue) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Correlations */}
            <div>
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">Correlations</h3>
                </div>
                <div className="space-y-4">
                  {correlations.map((corr, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{corr.factor}</span>
                        <span className="text-sm font-bold text-primary">{corr.strength}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full bg-${corr.color} transition-all duration-300`}
                          style={{ width: `${corr.strength}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{corr.description}</p>
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

export default Insights;
