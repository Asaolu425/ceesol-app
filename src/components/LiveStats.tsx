import { motion } from "framer-motion";
import { Battery, BoltIcon, Sun, TrendingUp } from "lucide-react";

interface LiveStatsProps {
  dailyKwh: number;
  peakWattage: number;
  applianceCount: number;
}

const LiveStats = ({ dailyKwh, peakWattage, applianceCount }: LiveStatsProps) => {
  const stats = [
    {
      label: "Daily Consumption",
      value: dailyKwh.toFixed(2),
      unit: "kWh",
      icon: BoltIcon,
      color: "text-primary",
    },
    {
      label: "Peak Draw",
      value: peakWattage.toLocaleString(),
      unit: "W",
      icon: TrendingUp,
      color: "text-energy-amber",
    },
    {
      label: "Monthly Est.",
      value: (dailyKwh * 30).toFixed(1),
      unit: "kWh",
      icon: Sun,
      color: "text-energy-cyan",
    },
    {
      label: "Devices",
      value: applianceCount.toString(),
      unit: "",
      icon: Battery,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-xl p-4 glow-green"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.unit}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LiveStats;
