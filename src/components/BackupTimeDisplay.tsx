import { motion } from "framer-motion";
import { Clock, Battery } from "lucide-react";

interface BackupTimeDisplayProps {
  backupTimeHours: number;
  batteryCapacityKwh: number;
  peakWattage: number;
  targetBackupHours: number;
  installationType: string;
}

const BackupTimeDisplay = ({ backupTimeHours, batteryCapacityKwh, peakWattage, targetBackupHours, installationType }: BackupTimeDisplayProps) => {
  if (peakWattage === 0) return null;

  const hours = Math.floor(backupTimeHours);
  const minutes = Math.round((backupTimeHours - hours) * 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 glow-green"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-energy-cyan" />
        <h3 className="font-semibold">Battery Backup Time</h3>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Battery className="w-16 h-16 text-primary" />
          <div className="absolute inset-0 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-foreground">
            {hours}h {minutes}m
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Estimated backup at full load ({peakWattage.toLocaleString()}W)
          </p>
          <p className="text-xs text-muted-foreground">
            Battery: {batteryCapacityKwh} kWh usable capacity
          </p>
          <p className="text-xs text-primary mt-1">
            Target: {targetBackupHours}h ({installationType})
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BackupTimeDisplay;
