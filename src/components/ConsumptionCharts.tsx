import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Appliance } from "@/lib/solar-calculations";

interface ConsumptionChartsProps {
  appliances: Appliance[];
}

const CHART_COLORS = [
  "hsl(145, 72%, 46%)",
  "hsl(185, 70%, 50%)",
  "hsl(40, 90%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(60, 80%, 50%)",
  "hsl(320, 60%, 50%)",
  "hsl(100, 60%, 45%)",
  "hsl(20, 80%, 55%)",
  "hsl(240, 50%, 60%)",
  "hsl(160, 60%, 45%)",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{data.name || data.payload?.name}</p>
      <p className="text-muted-foreground">
        {typeof data.value === "number" ? `${data.value.toFixed(2)} kWh` : data.value}
      </p>
    </div>
  );
};

const ConsumptionCharts = ({ appliances }: ConsumptionChartsProps) => {
  const pieData = useMemo(
    () =>
      appliances
        .filter((a) => a.wattage > 0 && a.hoursPerDay > 0)
        .map((a) => ({
          name: a.name || "Unnamed",
          value: Math.round((a.wattage * a.hoursPerDay * a.quantity) / 1000 * 100) / 100,
        })),
    [appliances]
  );

  const barData = useMemo(
    () =>
      appliances
        .filter((a) => a.wattage > 0)
        .map((a) => ({
          name: a.name || "Unnamed",
          wattage: a.wattage * a.quantity,
          dailyKwh: Math.round((a.wattage * a.hoursPerDay * a.quantity) / 1000 * 100) / 100,
        })),
    [appliances]
  );

  if (pieData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Consumption Breakdown</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-xl p-5 glow-green">
          <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
            Energy Share (kWh/day)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-5 glow-green">
          <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
            Wattage Comparison
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 12%, 16%)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "hsl(150, 10%, 50%)" }}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(150, 10%, 50%)" }}
                label={{
                  value: "Watts",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "hsl(150, 10%, 50%)" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="wattage" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsumptionCharts;
