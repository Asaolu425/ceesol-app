import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calculator, FileText, History, LogOut, Sun, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ceejayLogo from "@/assets/ceejay-logo.jpeg";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  const cards = [
    {
      title: "New Calculation",
      description: "Design a new solar system from scratch",
      icon: Calculator,
      action: () => navigate("/calculator"),
      accent: "from-cyan-electric/20 to-cyan-electric/5",
    },
    {
      title: "Saved Designs",
      description: "View and manage your saved system designs",
      icon: FileText,
      action: () => navigate("/calculator"),
      accent: "from-gold-solar/20 to-gold-solar/5",
      badge: "Coming Soon",
    },
    {
      title: "Calculation History",
      description: "Review your previous solar calculations",
      icon: History,
      action: () => navigate("/calculator"),
      accent: "from-green-500/20 to-green-500/5",
      badge: "Coming Soon",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ceejayLogo} alt="CeeJay Solar" className="h-10 w-auto rounded-lg" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Solar Design Platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.user_metadata?.full_name || user?.email}
            </span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, {firstName} <Sun className="inline w-7 h-7 text-gold-solar" />
          </h1>
          <p className="text-muted-foreground">
            Design professional solar systems with engineering-grade calculations.
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:border-primary/30 transition-all duration-300 group relative overflow-hidden h-full"
                onClick={card.action}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <card.icon className="w-8 h-8 text-primary mb-2" />
                    {card.badge && (
                      <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button
            size="lg"
            onClick={() => navigate("/calculator")}
            className="bg-gradient-to-r from-cyan-electric to-cyan-electric/80 text-primary-foreground font-semibold shadow-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start New Calculation
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
