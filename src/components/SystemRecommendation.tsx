import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SolarResult, BATTERY_INFO, PANEL_INFO, INVERTER_BRANDS } from "@/lib/solar-calculations";

interface SystemRecommendationProps {
  result: SolarResult;
}

const SystemRecommendation = ({ result }: SystemRecommendationProps) => {
  if (result.dailyKwh === 0) return null;

  const battInfo = BATTERY_INFO[result.batteryType];
  const panelInfo = PANEL_INFO[result.panelType];
  const inverterInfo = INVERTER_BRANDS[result.inverterBrand];
  const hours = Math.floor(result.backupTimeHours);
  const minutes = Math.round((result.backupTimeHours - hours) * 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 via-card to-energy-cyan/5 border border-primary/30 rounded-xl p-6 glow-green"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Recommended System</h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Inverter</span>
          <p className="font-semibold">{inverterInfo.label} {(result.inverterSizeW / 1000).toFixed(1)}kW / {result.inverterSizeKva}kVA</p>
          <p className="text-xs text-muted-foreground">{result.inverterVoltage}V system</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Battery Bank</span>
          <p className="font-semibold">{result.batteryVoltage}V {result.batteryCapacity1Day}Ah {battInfo.label}</p>
          <p className="text-xs text-muted-foreground">
            {result.batteryBank.totalUnits}× {result.batteryBank.unitLabel} ({result.batteryCapacityKwh}kWh)
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Solar Panels</span>
          <p className="font-semibold">{result.estimatedPanels}× {result.panelSize}W {panelInfo.label}</p>
          <p className="text-xs text-muted-foreground">Total: {result.panelWattage.toLocaleString()}W</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Charge Controller</span>
          <p className="font-semibold">{result.chargeController.type} {result.chargeController.ratedAmps}A</p>
          <p className="text-xs text-muted-foreground">String: {result.chargeController.stringConfig}</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Backup Time</span>
          <p className="font-semibold">{hours}h {minutes}m at full load</p>
          <p className="text-xs text-muted-foreground">Target: {result.targetBackupHours}h ({result.installationType})</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Cost</span>
          <p className="font-semibold text-primary">₦{result.costBreakdown.totalCost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">ROI: {result.savings.roiMonths} months</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemRecommendation;
