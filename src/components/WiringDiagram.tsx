import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SolarResult, BATTERY_INFO, PANEL_INFO, INVERTER_BRANDS } from "@/lib/solar-calculations";

interface WiringDiagramProps {
  result: SolarResult;
}

interface ComponentInfo {
  title: string;
  description: string;
  specs: { label: string; value: string }[];
  color: string;
}

const WiringDiagram = ({ result }: WiringDiagramProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (result.estimatedPanels === 0) return null;

  const battInfo = BATTERY_INFO[result.batteryType];
  const panelInfo = PANEL_INFO[result.panelType];
  const inverterInfo = INVERTER_BRANDS[result.inverterBrand];
  const cc = result.chargeController;
  const bb = result.batteryBank;

  const componentDetails: Record<string, ComponentInfo> = {
    panels: {
      title: "Solar Panel Array",
      description: `${panelInfo.label} panels arranged in ${cc.stringConfig} configuration`,
      specs: [
        { label: "Panel Wattage", value: `${result.panelSize}W` },
        { label: "Total Panels", value: `${result.estimatedPanels}` },
        { label: "Array Size", value: `${result.panelWattage.toLocaleString()}W` },
        { label: "Configuration", value: cc.stringConfig },
        { label: "Vmp per Panel", value: `${panelInfo.vmp}V` },
        { label: "Efficiency", value: panelInfo.efficiency },
      ],
      color: "hsl(40, 90%, 55%)",
    },
    combiner: {
      title: "PV Combiner Box",
      description: "Combines parallel strings with individual string fuses and surge protection",
      specs: [
        { label: "Strings", value: `${cc.panelsInParallel} parallel` },
        { label: "String Fuse", value: `15A per string` },
        { label: "Surge Protection", value: "SPD Type II" },
        { label: "Enclosure", value: "IP65 Outdoor Rated" },
      ],
      color: "hsl(185, 70%, 50%)",
    },
    dcIsolator: {
      title: "PV DC Isolator",
      description: "DC disconnect switch between solar array and hybrid inverter for maintenance",
      specs: [
        { label: "Type", value: "4-Pole DC Isolator" },
        { label: "Rating", value: `${Math.max(40, Math.ceil(cc.ratedAmps * 1.25))}A` },
        { label: "Max Voltage", value: `${result.batteryVoltage === 48 ? 500 : result.batteryVoltage === 24 ? 250 : 150}V DC` },
        { label: "Purpose", value: "PV Array Isolation" },
        { label: "Location", value: "Near Inverter" },
      ],
      color: "hsl(0, 72%, 55%)",
    },
    inverter: {
      title: `Hybrid Inverter (${inverterInfo.label})`,
      description: "All-in-one inverter with built-in MPPT charge controller and battery management",
      specs: [
        { label: "Brand", value: inverterInfo.label },
        { label: "Capacity", value: `${result.inverterSize.toLocaleString()}W / ${result.inverterSizeKva.toFixed(1)}kVA` },
        { label: "Type", value: "Hybrid (Grid-Tie + Off-Grid)" },
        { label: "Built-in MPPT", value: `${cc.ratedAmps}A ${cc.type}` },
        { label: "PV Input Voltage", value: `${result.batteryVoltage === 48 ? "200-500V" : result.batteryVoltage === 24 ? "100-250V" : "50-150V"} DC` },
        { label: "Battery Voltage", value: `${result.inverterVoltage}V DC` },
        { label: "Output", value: "230V AC, 50Hz Pure Sine Wave" },
        { label: "Efficiency", value: ">95%" },
      ],
      color: "hsl(40, 90%, 55%)",
    },
    batteryBreaker: {
      title: "Battery Disconnect",
      description: "DC breaker between battery bank and hybrid inverter for protection and isolation",
      specs: [
        { label: "Type", value: "2-Pole DC MCB + Fuse" },
        { label: "Current Rating", value: `${Math.ceil(result.inverterSize / result.batteryVoltage * 1.25)}A` },
        { label: "Voltage", value: `${result.batteryVoltage}V DC` },
        { label: "Purpose", value: "Battery Protection" },
        { label: "Trip Curve", value: "C-Curve" },
      ],
      color: "hsl(0, 72%, 55%)",
    },
    battery: {
      title: "Battery Bank",
      description: `${battInfo.label} batteries configured for ${result.batteryVoltage}V system voltage`,
      specs: [
        { label: "Type", value: battInfo.label },
        { label: "Configuration", value: `${bb.unitsInSeries}S × ${bb.unitsInParallel}P` },
        { label: "Total Units", value: `${bb.totalUnits}` },
        { label: "Total Capacity", value: `${bb.totalAh}Ah / ${bb.totalKwh.toFixed(1)}kWh` },
        { label: "System Voltage", value: `${result.batteryVoltage}V` },
        { label: "Depth of Discharge", value: `${(battInfo.dod * 100).toFixed(0)}%` },
        { label: "Lifespan", value: battInfo.lifespan },
        { label: "Unit Spec", value: `${battInfo.unitAh}Ah ${battInfo.unitVoltage}V` },
      ],
      color: "hsl(145, 72%, 46%)",
    },
    acBreaker: {
      title: "AC Distribution Board",
      description: "Main AC breaker panel with MCBs and RCD protection for household circuits",
      specs: [
        { label: "Main Breaker", value: `${Math.ceil(result.inverterSize / 230 * 1.25)}A` },
        { label: "Voltage", value: "230V AC 50Hz" },
        { label: "RCD Protection", value: "30mA / 100mA" },
        { label: "Surge Protection", value: "SPD Type II" },
        { label: "Earth Bar", value: "Included" },
      ],
      color: "hsl(0, 72%, 55%)",
    },
    bypassSwitch: {
      title: "Grid Bypass Switch",
      description: "Manual changeover switch for grid power bypass (essential for hybrid systems)",
      specs: [
        { label: "Type", value: "3-Position Changeover" },
        { label: "Current", value: `${Math.ceil(result.inverterSize / 230 * 1.5)}A` },
        { label: "Positions", value: "Solar / Grid / Off" },
        { label: "Purpose", value: "Emergency Grid Power" },
      ],
      color: "hsl(280, 65%, 50%)",
    },
    load: {
      title: "House Load Distribution",
      description: "Connected AC circuits powering household appliances",
      specs: [
        { label: "Peak Load", value: `${result.peakWattage.toLocaleString()}W` },
        { label: "Daily Consumption", value: `${result.dailyKwh}kWh` },
        { label: "Backup Duration", value: `${Math.floor(result.backupTimeHours)}h ${Math.round((result.backupTimeHours % 1) * 60)}m` },
        { label: "Load Type", value: result.installationType === "residential" ? "Residential" : "Commercial" },
      ],
      color: "hsl(150, 20%, 92%)",
    },
  };

  const info = selected ? componentDetails[selected] : null;

  // SVG layout constants
  const W = 900;
  const H = 520;

  // Node positions [x, y] - simplified hybrid layout
  const pos: Record<string, [number, number]> = {
    panels:           [80,   100],
    combiner:         [240,  100],
    dcIsolator:       [400,  100],
    inverter:         [560,  100],
    batteryBreaker:   [560,  240],
    battery:          [560,  380],
    acBreaker:        [320,  380],
    bypassSwitch:     [200,  380],
    load:             [80,   380],
  };

  // Wire paths for hybrid inverter setup
  const wires: { from: string; to: string; type: "dc" | "ac" }[] = [
    // PV DC Path
    { from: "panels", to: "combiner", type: "dc" },
    { from: "combiner", to: "dcIsolator", type: "dc" },
    { from: "dcIsolator", to: "inverter", type: "dc" },
    // Battery DC Path
    { from: "inverter", to: "batteryBreaker", type: "dc" },
    { from: "batteryBreaker", to: "battery", type: "dc" },
    // AC Output Path
    { from: "inverter", to: "acBreaker", type: "ac" },
    { from: "acBreaker", to: "bypassSwitch", type: "ac" },
    { from: "bypassSwitch", to: "load", type: "ac" },
  ];

  const nodeW = 120;
  const nodeH = 64;

  const getWirePath = (from: string, to: string) => {
    const [x1, y1] = pos[from];
    const [x2, y2] = pos[to];
    const cx1 = x1 + nodeW / 2;
    const cy1 = y1 + nodeH / 2;
    const cx2 = x2 + nodeW / 2;
    const cy2 = y2 + nodeH / 2;

    // Straight horizontal
    if (Math.abs(cy1 - cy2) < 10) {
      return `M${cx1 + nodeW / 2},${cy1} L${cx2 - nodeW / 2},${cy2}`;
    }
    // Straight vertical
    if (Math.abs(cx1 - cx2) < 10) {
      return `M${cx1},${cy1 + nodeH / 2} L${cx2},${cy2 - nodeH / 2}`;
    }
    // L-shaped: vertical then horizontal
    if (cx2 > cx1 && cy2 > cy1) {
      return `M${cx1},${cy1 + nodeH / 2} L${cx1},${cy2} L${cx2 - nodeW / 2},${cy2}`;
    }
    if (cx2 < cx1 && cy2 > cy1) {
      return `M${cx1},${cy1 + nodeH / 2} L${cx1},${cy2} L${cx2 + nodeW / 2},${cy2}`;
    }
    // L-shaped: horizontal then vertical
    if (cy2 < cy1 && cx2 < cx1) {
      return `M${cx1 - nodeW / 2},${cy1} L${cx2},${cy1} L${cx2},${cy2 + nodeH / 2}`;
    }
    return `M${cx1 + nodeW / 2},${cy1} L${cx2},${cy1} L${cx2},${cy2 + nodeH / 2}`;
  };

  const icons: Record<string, string> = {
    panels: "☀️",
    combiner: "⊞",
    dcIsolator: "⚡",
    inverter: "🔋",
    batteryBreaker: "⚡",
    battery: "🔋",
    acBreaker: "🔌",
    bypassSwitch: "🔄",
    load: "🏠",
  };

  const shortLabels: Record<string, string> = {
    panels: "Solar Panels",
    combiner: "Combiner Box",
    dcIsolator: "PV Isolator",
    inverter: "Hybrid Inverter",
    batteryBreaker: "Battery Breaker",
    battery: "Battery Bank",
    acBreaker: "AC Panel",
    bypassSwitch: "Bypass Switch",
    load: "House Load",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 sm:p-6"
    >
      <h3 className="font-semibold mb-2 text-center text-foreground">
        🔋 Hybrid Inverter System Diagram
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-4">
        Built-in MPPT charge controller — no separate controller needed. Click any component for details.
      </p>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[600px]"
          style={{ maxHeight: 480 }}
        >
          {/* Background */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(160,12%,14%)" strokeWidth="0.5" />
            </pattern>
            <style>{`
              @keyframes dashFlow {
                to { stroke-dashoffset: -20; }
              }
              .wire-dc {
                stroke-dasharray: 8 4;
                animation: dashFlow 1.2s linear infinite;
              }
              .wire-ac {
                stroke-dasharray: none;
              }
            `}</style>
          </defs>
          <rect width={W} height={H} fill="hsl(160,10%,6%)" rx="12" />
          <rect width={W} height={H} fill="url(#grid)" rx="12" />

          {/* Section labels */}
          <text x={320} y={40} textAnchor="middle" fill="hsl(185,70%,50%)" fontSize="12" fontWeight="600" opacity="0.7">
            ☀️ PV DC SIDE (400-500V)
          </text>
          <text x={720} y={240} textAnchor="middle" fill="hsl(145,72%,46%)" fontSize="12" fontWeight="600" opacity="0.7" transform="rotate(90, 720, 240)">
            🔋 BATTERY DC SIDE (48V)
          </text>
          <text x={240} y={480} textAnchor="middle" fill="hsl(40,90%,55%)" fontSize="12" fontWeight="600" opacity="0.7">
            ⚡ AC OUTPUT SIDE (230V)
          </text>

          {/* Hybrid inverter label */}
          <text x={620} y={132} textAnchor="middle" fill="hsl(40,90%,55%)" fontSize="10" fontWeight="500" opacity="0.6">
            (Built-in MPPT)
          </text>

          {/* Wires */}
          {wires.map(({ from, to, type }) => (
            <path
              key={`${from}-${to}`}
              d={getWirePath(from, to)}
              fill="none"
              stroke={type === "dc" ? "hsl(185,70%,50%)" : "hsl(40,90%,55%)"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={type === "dc" ? "wire-dc" : "wire-ac"}
              opacity={0.8}
            />
          ))}

          {/* Nodes */}
          {Object.entries(pos).map(([key, [x, y]]) => {
            const isSelected = selected === key;
            const detail = componentDetails[key];
            const isProtective = key.includes("Breaker") || key.includes("Isolator") || key === "acBreaker";
            const isInverter = key === "inverter";

            return (
              <g
                key={key}
                onClick={() => setSelected(isSelected ? null : key)}
                cursor="pointer"
                role="button"
                tabIndex={0}
                aria-label={`View ${shortLabels[key]} details`}
              >
                {/* Glow effect on select */}
                {isSelected && (
                  <rect
                    x={x - 6}
                    y={y - 6}
                    width={nodeW + 12}
                    height={nodeH + 12}
                    rx="16"
                    fill="none"
                    stroke={detail.color}
                    strokeWidth="2.5"
                    opacity="0.5"
                  />
                )}

                {/* Node background */}
                <rect
                  x={x}
                  y={y}
                  width={nodeW}
                  height={nodeH}
                  rx="12"
                  fill={isProtective ? "hsl(0,30%,15%)" : isInverter ? "hsl(40,30%,12%)" : "hsl(160,12%,12%)"}
                  stroke={isSelected ? detail.color : isInverter ? "hsl(40,60%,35%)" : "hsl(160,12%,22%)"}
                  strokeWidth={isSelected ? 2.5 : isInverter ? 2 : 1}
                />

                {/* Icon */}
                <text
                  x={x + 18}
                  y={y + nodeH / 2 + 1}
                  fontSize="20"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {icons[key]}
                </text>

                {/* Label */}
                <text
                  x={x + 38}
                  y={y + nodeH / 2 - 8}
                  fontSize="10"
                  fontWeight="600"
                  fill={detail.color}
                  dominantBaseline="central"
                >
                  {shortLabels[key]}
                </text>

                {/* Sub-label */}
                <text
                  x={x + 38}
                  y={y + nodeH / 2 + 10}
                  fontSize="8.5"
                  fill="hsl(150,10%,50%)"
                  dominantBaseline="central"
                >
                  {key === "panels" && `${result.estimatedPanels}× ${result.panelSize}W`}
                  {key === "combiner" && `${cc.panelsInParallel} strings`}
                  {key === "dcIsolator" && `${Math.max(40, Math.ceil(cc.ratedAmps * 1.25))}A DC`}
                  {key === "inverter" && `${(result.inverterSize / 1000).toFixed(1)}kW Hybrid`}
                  {key === "batteryBreaker" && `${Math.ceil(result.inverterSize / result.batteryVoltage * 1.25)}A DC`}
                  {key === "battery" && `${bb.totalAh}Ah ${result.batteryVoltage}V`}
                  {key === "acBreaker" && `${Math.ceil(result.inverterSize / 230 * 1.25)}A AC`}
                  {key === "bypassSwitch" && "Grid/Essential"}
                  {key === "load" && `${result.peakWattage}W peak`}
                </text>

                {/* Inverter MPPT badge */}
                {key === "inverter" && (
                  <rect
                    x={x + nodeW - 35}
                    y={y + 4}
                    width="30"
                    height="14"
                    rx="4"
                    fill="hsl(185,50%,20%)"
                    stroke="hsl(185,70%,50%)"
                    strokeWidth="1"
                  />
                )}
                {key === "inverter" && (
                  <text
                    x={x + nodeW - 20}
                    y={y + 14}
                    fontSize="7"
                    fill="hsl(185,70%,70%)"
                    textAnchor="middle"
                  >
                    MPPT
                  </text>
                )}
              </g>
            );
          })}

          {/* Wire current flow arrows */}
          <polygon points="160,100 170,95 170,105" fill="hsl(185,70%,50%)" opacity="0.6" />
          <polygon points="320,100 330,95 330,105" fill="hsl(185,70%,50%)" opacity="0.6" />
          <polygon points="480,100 490,95 490,105" fill="hsl(185,70%,50%)" opacity="0.6" />
          <polygon points="620,170 615,180 625,180" fill="hsl(185,70%,50%)" opacity="0.6" />
          <polygon points="620,310 615,320 625,320" fill="hsl(185,70%,50%)" opacity="0.6" />
          <polygon points="440,380 430,375 430,385" fill="hsl(40,90%,55%)" opacity="0.6" />
          <polygon points="260,380 250,375 250,385" fill="hsl(40,90%,55%)" opacity="0.6" />

          {/* Legend */}
          <g transform={`translate(20, ${H - 70})`}>
            <rect x="0" y="0" width="220" height="55" rx="8" fill="hsl(160,12%,10%)" stroke="hsl(160,12%,20%)" />
            <line x1="15" y1="18" x2="40" y2="18" stroke="hsl(185,70%,50%)" strokeWidth="2.5" strokeDasharray="8 4" />
            <text x="45" y="22" fontSize="9" fill="hsl(150,10%,60%)">DC Power (PV → Inverter)</text>
            <line x1="15" y1="38" x2="40" y2="38" stroke="hsl(40,90%,55%)" strokeWidth="2.5" />
            <text x="45" y="42" fontSize="9" fill="hsl(150,10%,60%)">AC Power (Inverter → Load)</text>
            <circle cx="120" cy="20" r="6" fill="hsl(0,30%,20%)" stroke="hsl(0,72%,55%)" strokeWidth="1.5" />
            <text x="130" y="23" fontSize="9" fill="hsl(150,10%,60%)">Protection Device</text>
            <rect x="114" y="34" width="12" height="12" rx="2" fill="hsl(40,30%,15%)" stroke="hsl(40,60%,40%)" strokeWidth="1.5" />
            <text x="130" y="43" fontSize="9" fill="hsl(150,10%,60%)">Hybrid Inverter</text>
          </g>

          {/* Info tip */}
          <text x={W - 20} y={H - 15} textAnchor="end" fontSize="9" fill="hsl(150,10%,40%)">
            💡 Hybrid inverters combine solar charging, battery management & inversion in one unit
          </text>
        </svg>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {info && selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4 bg-secondary border border-border rounded-lg p-4 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4
                  className="font-semibold text-sm"
                  style={{ color: info.color }}
                >
                  {info.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {info.description}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {info.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="bg-card rounded-md px-3 py-2 border border-border"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WiringDiagram;
