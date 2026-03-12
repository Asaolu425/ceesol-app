import { CircuitBoard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InverterVoltage, InverterBrand, INVERTER_BRANDS } from "@/lib/solar-calculations";

interface InverterConfigInputProps {
  inverterVoltage: InverterVoltage;
  inverterBrand: InverterBrand;
  onVoltageChange: (voltage: InverterVoltage) => void;
  onBrandChange: (brand: InverterBrand) => void;
}

const InverterConfigInput = ({
  inverterVoltage,
  inverterBrand,
  onVoltageChange,
  onBrandChange,
}: InverterConfigInputProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CircuitBoard className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Inverter Configuration</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Inverter Voltage</label>
          <Select
            value={String(inverterVoltage)}
            onValueChange={(v) => onVoltageChange(Number(v) as InverterVoltage)}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12V</SelectItem>
              <SelectItem value="24">24V</SelectItem>
              <SelectItem value="48">48V</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Inverter Brand</label>
          <Select value={inverterBrand} onValueChange={(v) => onBrandChange(v as InverterBrand)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(INVERTER_BRANDS) as [InverterBrand, { label: string; origin: string }][]).map(
                ([key, val]) => (
                  <SelectItem key={key} value={key}>
                    {val.label} ({val.origin})
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default InverterConfigInput;
