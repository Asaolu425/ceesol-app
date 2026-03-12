import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SolarResult } from "@/lib/solar-calculations";

interface SystemWarningsProps {
  result: SolarResult;
  sunHours: number;
}

interface Warning {
  id: string;
  message: string;
  severity: "warning" | "critical";
}

const SystemWarnings = ({ result, sunHours }: SystemWarningsProps) => {
  if (result.dailyKwh === 0) return null;

  const warnings: Warning[] = [];

  // Inverter undersized
  if (result.peakWattage > result.inverterSizeW) {
    warnings.push({
      id: "inverter-undersized",
      message: `Peak load (${result.peakWattage.toLocaleString()}W) exceeds inverter capacity (${result.inverterSizeW.toLocaleString()}W)`,
      severity: "critical",
    });
  }

  // Battery too small for target backup
  if (result.backupTimeHours < result.targetBackupHours * 0.8) {
    warnings.push({
      id: "battery-small",
      message: `Battery backup (${result.backupTimeHours.toFixed(1)}h) is below target (${result.targetBackupHours}h)`,
      severity: "warning",
    });
  }

  // Solar can't recharge battery in a day
  const dailySolarWh = result.panelWattage * sunHours;
  const batteryWh = result.batteryCapacityKwh * 1000;
  if (dailySolarWh > 0 && batteryWh > dailySolarWh * 1.2) {
    warnings.push({
      id: "solar-recharge",
      message: `Solar panels may not fully recharge batteries daily. Solar output: ${(dailySolarWh / 1000).toFixed(1)}kWh vs Battery: ${result.batteryCapacityKwh}kWh`,
      severity: "warning",
    });
  }

  // Inverter/battery voltage mismatch
  if (result.inverterVoltage !== result.batteryVoltage) {
    warnings.push({
      id: "voltage-mismatch",
      message: `Inverter voltage (${result.inverterVoltage}V) doesn't match battery voltage (${result.batteryVoltage}V)`,
      severity: "critical",
    });
  }

  // Very high daily consumption
  if (result.dailyKwh > 50) {
    warnings.push({
      id: "high-consumption",
      message: `Very high daily consumption (${result.dailyKwh}kWh). Verify appliance entries are correct.`,
      severity: "warning",
    });
  }

  // Solar panels insufficient for daily load
  if (dailySolarWh > 0 && dailySolarWh < result.dailyKwh * 1000 * 0.8) {
    warnings.push({
      id: "solar-insufficient",
      message: `Solar production (${(dailySolarWh / 1000).toFixed(1)}kWh) may not cover daily consumption (${result.dailyKwh}kWh)`,
      severity: "warning",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-energy-amber" />
        System Checks
      </h3>

      <AnimatePresence>
        {warnings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm text-primary">All system parameters look good!</span>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {warnings.map((w) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${
                  w.severity === "critical"
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : "bg-energy-amber/10 border-energy-amber/30 text-energy-amber"
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{w.message}</span>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SystemWarnings;
