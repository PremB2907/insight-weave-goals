import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { Trophy, Users } from "lucide-react";

const Leaderboard = () => {
  const { leaderboard } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Public Leaderboard</h1>
            <p className="text-muted-foreground">See the top streaks across the platform and stay motivated.</p>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Top Streaks</h2>
                <p className="text-sm text-muted-foreground">Fresh leaderboard data is available in real time for your demo.</p>
              </div>
              <div className="rounded-2xl bg-primary/5 px-4 py-2 text-primary flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Top 20
              </div>
            </div>

            <div className="grid gap-4">
              {leaderboard.map((entry, index) => (
                <div key={entry.id} className="grid grid-cols-[40px_1fr_120px] items-center gap-4 rounded-3xl border border-border p-4 transition hover:border-primary/70">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">#{index + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-secondary" />
                      <span className="font-semibold text-foreground">{entry.username}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.habitName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{entry.longestStreak}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">days</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
