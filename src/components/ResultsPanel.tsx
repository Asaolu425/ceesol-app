import { motion } from "framer-motion";
import { SolarResult, BATTERY_INFO, PANEL_INFO, INVERTER_BRANDS } from "@/lib/solar-calculations";
import { Battery, CircuitBoard, PanelTop, Zap, Cable, Gauge } from "lucide-react";

interface ResultsPanelProps {
  result: SolarResult;
}

const ResultsPanel = ({ result }: ResultsPanelProps) => {
  if (result.dailyKwh === 0) return null;

  const panelInfo = PANEL_INFO[result.panelType];
  const inverterBrandInfo = INVERTER_BRANDS[result.inverterBrand];
  const battInfo = BATTERY_INFO[result.batteryType];
  const hours = Math.floor(result.backupTimeHours);
  const minutes = Math.round((result.backupTimeHours - hours) * 60);

  const sections = [
    {
      title: `Solar Panels — ${panelInfo.label}`,
      icon: PanelTop,
      items: [
        { label: "Total Load (W)", value: `${result.totalLoad.toLocaleString()} W` },
        { label: "Panel Type", value: panelInfo.label },
        { label: "Panel Size", value: `${result.panelSize}W each` },
        { label: "Efficiency", value: panelInfo.efficiency },
        { label: "Total Array Capacity", value: `${result.panelWattage.toLocaleString()} W` },
        { label: "Number of Panels", value: `${result.estimatedPanels} panels` },
      ],
    },
    {
      title: `Inverter — ${inverterBrandInfo.label}`,
      icon: CircuitBoard,
      items: [
        { label: "Brand", value: inverterBrandInfo.label },
        { label: "System Voltage", value: `${result.inverterVoltage}V` },
        { label: "Peak Load", value: `${result.peakWattage.toLocaleString()} W` },
        { label: "Recommended Size", value: `${result.inverterSizeW.toLocaleString()} W` },
        { label: "Size (kVA)", value: `${result.inverterSizeKva} kVA` },
        { label: "Sizing Note", value: "Incl. 1.5kW headroom" },
      ],
    },
    {
      title: `Battery — ${battInfo.label}`,
      icon: Battery,
      items: [
        { label: "System Voltage", value: `${result.batteryVoltage}V` },
        { label: "Target Backup", value: `${result.targetBackupHours}h (${result.installationType})` },
        { label: "Required Capacity", value: `${result.batteryCapacity1Day} Ah` },
        { label: "Capacity (kWh)", value: `${result.batteryCapacityKwh} kWh` },
        { label: "Actual Backup", value: `${hours}h ${minutes}m` },
        { label: "DoD", value: `${battInfo.dod * 100}%` },
        { label: "Lifespan", value: battInfo.lifespan },
      ],
    },
    {
      title: "Battery Bank Config",
      icon: Cable,
      items: [
        { label: "Battery Unit", value: result.batteryBank.unitLabel },
        { label: "In Series", value: `${result.batteryBank.unitsInSeries} units` },
        { label: "In Parallel", value: `${result.batteryBank.unitsInParallel} strings` },
        { label: "Total Batteries", value: `${result.batteryBank.totalUnits} units` },
        { label: "Bank Capacity", value: `${result.batteryBank.totalKwh} kWh` },
      ],
    },
    {
      title: "Charge Controller (MPPT)",
      icon: Gauge,
      items: [
        { label: "Type", value: result.chargeController.type },
        { label: "Rated Current", value: `${result.chargeController.ratedAmps}A` },
        { label: "System Voltage", value: `${result.chargeController.ratedVoltage}V` },
        { label: "Panel Array", value: result.chargeController.stringConfig },
        { label: "Panels in Series", value: `${result.chargeController.panelsInSeries}` },
        { label: "Panels in Parallel", value: `${result.chargeController.panelsInParallel}` },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">System Recommendations</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 glow-green"
          >
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between items-baseline">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="font-mono font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultsPanel;
