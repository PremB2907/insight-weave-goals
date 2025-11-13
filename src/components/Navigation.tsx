import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, BookOpen, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/journal", icon: BookOpen, label: "Journal" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/insights", icon: TrendingUp, label: "Insights" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PARADIGM</span>
          </NavLink>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted"
                activeClassName="text-primary bg-primary-light"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <NavLink
            to="/dashboard"
            className="px-6 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:shadow-glow transition-all duration-300"
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
