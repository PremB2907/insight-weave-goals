import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Moon, Heart, Brain } from "lucide-react";

const Insights = () => {
  const keyInsights = [
    {
      icon: Activity,
      title: "Exercise Impact",
      trend: "positive",
      description: "Your mood score is 23% higher on days you exercise",
      recommendation: "Try morning workouts - they correlate with better energy throughout the day"
    },
    {
      icon: Moon,
      title: "Sleep Patterns",
      trend: "attention",
      description: "Sleep quality drops by 30% on days with 4+ hours of evening screen time",
      recommendation: "Consider setting a digital sunset at 8 PM for better rest"
    },
    {
      icon: Heart,
      title: "Emotional Wellness",
      trend: "positive",
      description: "Meditation days show 18% lower stress levels",
      recommendation: "Your optimal time appears to be 7-8 AM based on consistency data"
    }
  ];

  const correlations = [
    {
      factor: "Exercise → Mood",
      strength: 85,
      description: "Strong positive correlation",
      color: "accent"
    },
    {
      factor: "Sleep → Energy",
      strength: 78,
      description: "Strong positive correlation",
      color: "primary"
    },
    {
      factor: "Screen Time → Sleep",
      strength: 62,
      description: "Moderate negative correlation",
      color: "destructive"
    },
    {
      factor: "Social Time → Happiness",
      strength: 71,
      description: "Strong positive correlation",
      color: "accent"
    }
  ];

  const weeklyTrends = [
    { day: "Mon", mood: 7, energy: 6, sleep: 7.2 },
    { day: "Tue", mood: 8, energy: 8, sleep: 7.8 },
    { day: "Wed", mood: 7, energy: 7, sleep: 7.5 },
    { day: "Thu", mood: 9, energy: 8, sleep: 8.2 },
    { day: "Fri", mood: 8, energy: 7, sleep: 7.0 },
    { day: "Sat", mood: 9, energy: 9, sleep: 8.5 },
    { day: "Sun", mood: 8, energy: 7, sleep: 8.0 }
  ];

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
