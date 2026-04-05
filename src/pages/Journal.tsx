import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, Calendar, Moon, Heart, Activity, Save } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

const Journal = () => {
  const { journalEntries, addJournalEntry } = useAppContext();
  const [moodScore, setMoodScore] = useState([7]);
  const [energyLevel, setEnergyLevel] = useState([6]);
  const [stressLevel, setStressLevel] = useState([4]);

  const [sleepQuality, setSleepQuality] = useState([7]);
  const [sleepHours, setSleepHours] = useState(7.5);
  
  const [journalEntry, setJournalEntry] = useState("");

  const handleSaveEntry = () => {
    if (!journalEntry.trim()) return;
    addJournalEntry({
      mood: moodScore[0],
      energy: energyLevel[0],
      stress: stressLevel[0],
      sleepHours: sleepHours,
      sleepQuality: sleepQuality[0],
      preview: journalEntry
    });
    setJournalEntry("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Wellness Journal</h1>
            <p className="text-muted-foreground">Reflect on your day and track your well-being</p>
          </div>

          <div className="grid gap-6">
            {/* Today's Entry */}
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Today's Entry</h2>
                <span className="text-muted-foreground ml-auto">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>

              {/* Journal Text */}
              <div className="mb-6">
                <Label htmlFor="journal-entry" className="text-base font-semibold mb-2 block">
                  How was your day?
                </Label>
                <Textarea
                  id="journal-entry"
                  placeholder="Write about your thoughts, feelings, experiences, or anything on your mind..."
                  className="min-h-[200px] resize-none"
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                />
              </div>

              {/* Mood Tracking */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-secondary" />
                      Mood Score
                    </Label>
                    <span className="text-2xl font-bold text-primary">{moodScore[0]}/10</span>
                  </div>
                  <Slider
                    value={moodScore}
                    onValueChange={setMoodScore}
                    max={10}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-accent" />
                      Energy Level
                    </Label>
                    <span className="text-2xl font-bold text-accent">{energyLevel[0]}/10</span>
                  </div>
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    max={10}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Exhausted</span>
                    <span>Energized</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-primary" />
                      Stress Level
                    </Label>
                    <span className="text-2xl font-bold text-foreground">{stressLevel[0]}/10</span>
                  </div>
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    max={10}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Calm</span>
                    <span>Stressed</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-primary" />
                    Sleep Patterns
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold">
                          Hours Slept
                        </Label>
                        <span className="text-2xl font-bold text-foreground">{sleepHours} hrs</span>
                      </div>
                      <Slider
                        value={[sleepHours]}
                        onValueChange={(val) => setSleepHours(val[0])}
                        max={24}
                        step={0.5}
                        className="mb-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold">
                          Sleep Quality
                        </Label>
                        <span className="text-2xl font-bold text-foreground">{sleepQuality[0]}/10</span>
                      </div>
                      <Slider
                        value={sleepQuality}
                        onValueChange={setSleepQuality}
                        max={10}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-gradient-primary" onClick={handleSaveEntry}>
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </Card>

            {/* Recent Entries */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Entries</h2>
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        Mood: {entry.mood}/10
                      </span>
                    </div>
                    <p className="text-foreground">{entry.preview}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
