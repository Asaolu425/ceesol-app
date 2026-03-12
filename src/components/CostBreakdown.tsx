import { motion } from "framer-motion";
import { Wallet, TrendingDown, ArrowDownRight } from "lucide-react";
import { CostBreakdown as CostBreakdownType, SavingsEstimate } from "@/lib/solar-calculations";

interface CostBreakdownProps {
  cost: CostBreakdownType;
  savings: SavingsEstimate;
}

const formatNaira = (amount: number) =>
  `₦${amount.toLocaleString()}`;

const CostBreakdownComponent = ({ cost, savings }: CostBreakdownProps) => {
  if (cost.totalCost === 0) return null;

  const costItems = [
    { label: "Solar Panels", value: cost.panelsCost },
    { label: "Battery Bank", value: cost.batteryCost },
    { label: "Inverter", value: cost.inverterCost },
    { label: "Accessories & Wiring", value: cost.accessoriesCost },
    { label: "Installation", value: cost.installationCost },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-4"
    >
      {/* Cost Breakdown */}
      <div className="bg-card border border-border rounded-xl p-5 glow-green">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Cost Estimate (₦)</h3>
        </div>
        <div className="space-y-3">
          {costItems.map((item) => (
            <div key={item.label} className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="font-mono font-semibold text-sm">{formatNaira(item.value)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 mt-3">
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-foreground">Total System Cost</span>
              <span className="font-mono font-bold text-lg text-primary">{formatNaira(cost.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings */}
      <div className="bg-card border border-border rounded-xl p-5 glow-green">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-energy-amber" />
          <h3 className="font-semibold">Solar Savings</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
              Monthly Generator Fuel Cost
            </span>
            <span className="text-xl font-bold font-mono text-destructive">{formatNaira(savings.monthlyFuelCost)}</span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
              Monthly Solar Savings
            </span>
            <span className="text-xl font-bold font-mono text-primary">{formatNaira(savings.monthlySolarSavings)}</span>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-1">
              <ArrowDownRight className="w-3 h-3 text-energy-cyan" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Return on Investment
              </span>
            </div>
            <span className="text-xl font-bold font-mono text-energy-cyan">
              {savings.roiMonths > 0 ? `${savings.roiMonths} months` : "—"}
            </span>
            {savings.roiMonths > 0 && (
              <span className="text-xs text-muted-foreground block mt-1">
                ≈ {(savings.roiMonths / 12).toFixed(1)} years
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CostBreakdownComponent;
