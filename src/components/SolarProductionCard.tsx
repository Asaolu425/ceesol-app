import { motion } from "framer-motion";
import { Sun, Battery, Clock, Zap } from "lucide-react";
import { SolarResult } from "@/lib/solar-calculations";

interface SolarProductionCardProps {
  result: SolarResult;
  sunHours: number;
}

const SolarProductionCard = ({ result, sunHours }: SolarProductionCardProps) => {
  if (result.estimatedPanels === 0) return null;

  const dailySolarWh = result.panelWattage * sunHours;
  const dailySolarKwh = dailySolarWh / 1000;
  const batteryWh = result.batteryCapacityKwh * 1000;
  const rechargeHours = result.panelWattage > 0 ? batteryWh / result.panelWattage : 0;
  const surplusWh = dailySolarWh - result.dailyKwh * 1000;
  const selfSufficiency = dailySolarWh > 0 ? Math.min(100, (dailySolarWh / (result.dailyKwh * 1000)) * 100) : 0;

  const items = [
    {
      icon: Sun,
      label: "Daily Solar Production",
      value: `${dailySolarKwh.toFixed(1)} kWh`,
      detail: `${result.panelWattage.toLocaleString()}W × ${sunHours}h`,
      color: "text-energy-amber",
    },
    {
      icon: Zap,
      label: "Daily Consumption",
      value: `${result.dailyKwh} kWh`,
      detail: `${(result.dailyKwh * 1000).toLocaleString()} Wh`,
      color: "text-primary",
    },
    {
      icon: Battery,
      label: "Battery Recharge Time",
      value: `${rechargeHours.toFixed(1)} hours`,
      detail: `${result.batteryCapacityKwh}kWh ÷ ${(result.panelWattage / 1000).toFixed(1)}kW`,
      color: "text-energy-cyan",
    },
    {
      icon: Clock,
      label: "Solar Self-Sufficiency",
      value: `${selfSufficiency.toFixed(0)}%`,
      detail: surplusWh >= 0
        ? `Surplus: ${(surplusWh / 1000).toFixed(1)} kWh/day`
        : `Deficit: ${(Math.abs(surplusWh) / 1000).toFixed(1)} kWh/day`,
      color: selfSufficiency >= 100 ? "text-primary" : "text-energy-amber",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sun className="w-5 h-5 text-energy-amber" />
        <h3 className="font-semibold">Solar Production & Recharge</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-xl p-4 glow-green"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className="font-mono font-bold text-lg">{item.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.detail}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SolarProductionCard;
