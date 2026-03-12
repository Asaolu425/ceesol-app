import { PanelTop } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelType, PanelSize, PANEL_INFO, PANEL_SIZES } from "@/lib/solar-calculations";

interface PanelConfigInputProps {
  panelType: PanelType;
  panelSize: PanelSize;
  onTypeChange: (type: PanelType) => void;
  onSizeChange: (size: PanelSize) => void;
}

const PanelConfigInput = ({
  panelType,
  panelSize,
  onTypeChange,
  onSizeChange,
}: PanelConfigInputProps) => {
  const info = PANEL_INFO[panelType];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <PanelTop className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Panel Configuration</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Panel Type</label>
          <Select value={panelType} onValueChange={(v) => onTypeChange(v as PanelType)}>
            <SelectTrigger className="w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(PANEL_INFO) as [PanelType, typeof info][]).map(
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
          <label className="text-xs text-muted-foreground">Panel Size</label>
          <Select
            value={String(panelSize)}
            onValueChange={(v) => onSizeChange(Number(v) as PanelSize)}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PANEL_SIZES.map((s) => (
                <SelectItem key={s.value} value={String(s.value)}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Efficiency:</span> {info.efficiency}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Note:</span> {info.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanelConfigInput;
