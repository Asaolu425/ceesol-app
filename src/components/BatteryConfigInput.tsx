import { Battery } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BatteryType, BatteryVoltage, BATTERY_INFO } from "@/lib/solar-calculations";

interface BatteryConfigInputProps {
  batteryType: BatteryType;
  batteryVoltage: BatteryVoltage;
  onTypeChange: (type: BatteryType) => void;
  onVoltageChange: (voltage: BatteryVoltage) => void;
}

const BatteryConfigInput = ({
  batteryType,
  batteryVoltage,
  onTypeChange,
  onVoltageChange,
}: BatteryConfigInputProps) => {
  const info = BATTERY_INFO[batteryType];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Battery className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Battery Configuration</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Battery Type</label>
          <Select value={batteryType} onValueChange={(v) => onTypeChange(v as BatteryType)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(BATTERY_INFO) as [BatteryType, typeof info][]).map(
                ([key, val]) => (
                  <SelectItem key={key} value={key}>
                    {val.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Battery Voltage</label>
          <Select
            value={String(batteryVoltage)}
            onValueChange={(v) => onVoltageChange(Number(v) as BatteryVoltage)}
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

        <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Depth of Discharge:</span>{" "}
            {info.dod * 100}%
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Expected Lifespan:</span>{" "}
            {info.lifespan}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatteryConfigInput;
