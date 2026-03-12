import { motion } from "framer-motion";
import { Sun, Battery, Zap, Home, ArrowRight } from "lucide-react";

interface SystemDiagramProps {
  panels: number;
  panelSize: number;
  inverterSize: number;
  batteryCapacity: number;
  batteryVoltage: number;
}

const DiagramNode = ({
  icon: Icon,
  label,
  detail,
  color,
  delay,
}: {
  icon: typeof Sun;
  label: string;
  detail: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring" }}
    className="flex flex-col items-center gap-2"
  >
    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center ${color} glow-green`}>
      <Icon className="w-7 h-7 sm:w-9 sm:h-9" />
    </div>
    <div className="text-center">
      <p className="text-xs sm:text-sm font-semibold text-foreground">{label}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground">{detail}</p>
    </div>
  </motion.div>
);

const AnimatedArrow = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="text-primary hidden sm:block"
  >
    <ArrowRight className="w-6 h-6" />
  </motion.div>
);

const MobileArrow = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="text-primary sm:hidden rotate-90"
  >
    <ArrowRight className="w-5 h-5" />
  </motion.div>
);

const SystemDiagram = ({ panels, panelSize, inverterSize, batteryCapacity, batteryVoltage }: SystemDiagramProps) => {
  if (panels === 0) return null;

  const nodes = [
    { icon: Sun, label: "Solar Panels", detail: `${panels}× ${panelSize}W`, color: "text-energy-amber", delay: 0 },
    { icon: Zap, label: "Charge Controller", detail: "MPPT", color: "text-energy-cyan", delay: 0.15 },
    { icon: Battery, label: "Battery Bank", detail: `${batteryCapacity}Ah / ${batteryVoltage}V`, color: "text-primary", delay: 0.3 },
    { icon: Zap, label: "Inverter", detail: `${(inverterSize / 1000).toFixed(1)} kVA`, color: "text-energy-amber", delay: 0.45 },
    { icon: Home, label: "House Load", detail: "AC Output", color: "text-foreground", delay: 0.6 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 glow-green"
    >
      <h3 className="font-semibold mb-6 text-center">System Architecture</h3>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        {nodes.map((node, i) => (
          <div key={node.label} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <DiagramNode {...node} />
            {i < nodes.length - 1 && (
              <>
                <AnimatedArrow delay={node.delay + 0.1} />
                <MobileArrow delay={node.delay + 0.1} />
              </>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SystemDiagram;
