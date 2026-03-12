import { useState } from "react";
import { motion } from "framer-motion";
import { Cable } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CableSizingProps {
  defaultCurrent?: number;
  defaultVoltage?: number;
}

const CABLE_TABLE = [
  { maxAmps: 10, size: 1.5, label: "1.5mm²" },
  { maxAmps: 16, size: 2.5, label: "2.5mm²" },
  { maxAmps: 25, size: 4, label: "4mm²" },
  { maxAmps: 32, size: 6, label: "6mm²" },
  { maxAmps: 50, size: 10, label: "10mm²" },
  { maxAmps: 70, size: 16, label: "16mm²" },
  { maxAmps: 100, size: 25, label: "25mm²" },
  { maxAmps: 130, size: 35, label: "35mm²" },
  { maxAmps: 170, size: 50, label: "50mm²" },
  { maxAmps: 210, size: 70, label: "70mm²" },
  { maxAmps: 260, size: 95, label: "95mm²" },
];

function recommendCable(current: number, length: number, voltage: number) {
  // Voltage drop target: max 3% for DC, 5% for AC
  const maxDropPercent = voltage <= 48 ? 3 : 5;
  const resistivity = 0.0175; // copper Ω·mm²/m

  // Min cross-section for voltage drop
  const minAreaForDrop = (2 * resistivity * length * current) / (voltage * maxDropPercent / 100);

  // Find cable that handles both current and voltage drop
  const byDrop = CABLE_TABLE.find(c => c.size >= minAreaForDrop) || CABLE_TABLE[CABLE_TABLE.length - 1];
  const byCurrent = CABLE_TABLE.find(c => c.maxAmps >= current) || CABLE_TABLE[CABLE_TABLE.length - 1];

  const recommended = byDrop.size >= byCurrent.size ? byDrop : byCurrent;
  const voltageDrop = (2 * resistivity * length * current) / recommended.size;
  const voltageDropPercent = (voltageDrop / voltage) * 100;

  return { recommended, voltageDrop: voltageDrop.toFixed(2), voltageDropPercent: voltageDropPercent.toFixed(1) };
}

const CableSizing = ({ defaultCurrent = 0, defaultVoltage = 48 }: CableSizingProps) => {
  const [current, setCurrent] = useState(defaultCurrent);
  const [length, setLength] = useState(10);
  const [voltage, setVoltage] = useState(defaultVoltage);

  const hasInput = current > 0 && length > 0 && voltage > 0;
  const result = hasInput ? recommendCable(current, length, voltage) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 glow-green"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cable className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Cable Sizing Calculator</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Current (A)</label>
          <Input
            type="number"
            value={current || ""}
            onChange={(e) => setCurrent(Number(e.target.value))}
            placeholder="Amps"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Length (m)</label>
          <Input
            type="number"
            value={length || ""}
            onChange={(e) => setLength(Number(e.target.value))}
            placeholder="Meters"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Voltage</label>
          <Select value={String(voltage)} onValueChange={(v) => setVoltage(Number(v))}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12V DC</SelectItem>
              <SelectItem value="24">24V DC</SelectItem>
              <SelectItem value="48">48V DC</SelectItem>
              <SelectItem value="220">220V AC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {result && (
        <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Recommended Cable</span>
            <span className="font-mono font-bold text-lg text-primary">{result.recommended.label}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Max Current Rating</span>
            <span className="font-mono text-sm">{result.recommended.maxAmps}A</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Voltage Drop</span>
            <span className="font-mono text-sm">{result.voltageDrop}V ({result.voltageDropPercent}%)</span>
          </div>
        </div>
      )}

      {/* Reference table */}
      <details className="mt-4">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Cable size reference table
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {CABLE_TABLE.map((c) => (
            <div key={c.size} className="flex justify-between">
              <span>Up to {c.maxAmps}A</span>
              <span className="font-mono">{c.label}</span>
            </div>
          ))}
        </div>
      </details>
    </motion.div>
  );
};

export default CableSizing;
