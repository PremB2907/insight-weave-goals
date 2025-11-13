import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ icon: Icon, label, value, trend, className }: StatCardProps) => {
  return (
    <div className={cn("p-6 rounded-2xl bg-gradient-card border border-border", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium px-2 py-1 rounded-md",
              trend.positive ? "text-accent bg-accent/10" : "text-destructive bg-destructive/10"
            )}
          >
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};

export default StatCard;
