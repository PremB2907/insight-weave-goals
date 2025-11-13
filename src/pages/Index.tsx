import Navigation from "@/components/Navigation";
import FeatureCard from "@/components/FeatureCard";
import { Brain, Target, TrendingUp, Sparkles, Moon, Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import heroImage from "@/assets/hero-mindful.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "Mindful Tracking",
      description: "Log your daily habits, sleep patterns, and emotional state in one unified system."
    },
    {
      icon: TrendingUp,
      title: "Pattern Recognition",
      description: "Discover connections between your habits and well-being through intelligent analysis."
    },
    {
      icon: Target,
      title: "Smart Goals",
      description: "Set personalized goals based on insights from your own behavioral patterns."
    },
    {
      icon: Sparkles,
      title: "Automated Insights",
      description: "Receive tailored suggestions to improve your mood, energy, and overall wellness."
    },
    {
      icon: Moon,
      title: "Sleep Analysis",
      description: "Track and understand how your sleep quality impacts your daily performance."
    },
    {
      icon: Heart,
      title: "Emotional Wellness",
      description: "Monitor your emotional state and identify triggers that affect your well-being."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Transform Your
                <span className="text-primary"> Daily Habits</span> Into
                <span className="text-secondary"> Meaningful Growth</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                PARADIGM helps you understand the connection between your habits, sleep, and emotional well-being through intelligent tracking and personalized insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:shadow-glow transition-all duration-300"
                >
                  Start Your Journey
                </NavLink>
                <NavLink
                  to="/insights"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary-light transition-all duration-300"
                >
                  Learn More
                </NavLink>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Mindful workspace with journal and natural light"
                className="relative rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to Thrive
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to help you build better habits and achieve your wellness goals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl bg-gradient-primary p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Start Your Transformation?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join thousands who are already building better habits and achieving their wellness goals with PARADIGM.
              </p>
              <NavLink
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-background text-primary font-semibold hover:shadow-lg transition-all duration-300"
              >
                Get Started for Free
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 PARADIGM. Your journey to mindful living.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
