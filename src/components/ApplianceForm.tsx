import { useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Appliance, COMMON_APPLIANCES } from "@/lib/solar-calculations";

interface ApplianceFormProps {
  appliances: Appliance[];
  onAdd: (appliance: Omit<Appliance, "id">) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Appliance, value: string | number) => void;
}

const ApplianceForm = ({ appliances, onAdd, onRemove, onUpdate }: ApplianceFormProps) => {
  const [showPresets, setShowPresets] = useState(false);

  const addPreset = (preset: (typeof COMMON_APPLIANCES)[0]) => {
    onAdd({
      name: preset.name,
      wattage: preset.wattage,
      hoursPerDay: preset.hours,
      quantity: 1,
    });
    setShowPresets(false);
  };

  const addBlank = () => {
    onAdd({ name: "", wattage: 0, hoursPerDay: 0, quantity: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Appliances
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
          >
            Presets
          </Button>
          <Button size="sm" onClick={addBlank}>
            <Plus className="w-4 h-4 mr-1" /> Custom
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-hidden"
          >
            {COMMON_APPLIANCES.map((p) => (
              <button
                key={p.name}
                onClick={() => addPreset(p)}
                className="text-left p-3 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-colors text-sm"
              >
                <span className="font-medium text-foreground">{p.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {p.wattage}W · {p.hours}h/day
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {appliances.length === 0 && (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
          <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No appliances added yet</p>
          <p className="text-sm">Add from presets or create a custom entry</p>
        </div>
      )}

      {/* Column headers */}
      {appliances.length > 0 && (
        <div className="hidden sm:grid grid-cols-[1fr_80px_80px_60px_90px_40px] gap-2 px-2 text-xs text-muted-foreground font-medium">
          <span>Name</span>
          <span>Watts</span>
          <span>Hrs/Day</span>
          <span>Qty</span>
          <span className="text-right">Wh/day</span>
          <span></span>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {appliances.map((appliance) => {
            const energyWh = appliance.wattage * appliance.hoursPerDay * appliance.quantity;
            return (
              <motion.div
                key={appliance.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="grid grid-cols-[1fr_80px_80px_60px_90px_40px] gap-2 items-center bg-secondary/50 rounded-lg p-2"
              >
                <Input
                  placeholder="Appliance name"
                  value={appliance.name}
                  onChange={(e) => onUpdate(appliance.id, "name", e.target.value)}
                  className="bg-background/50 border-border/50 h-9 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Watts"
                  value={appliance.wattage || ""}
                  onChange={(e) =>
                    onUpdate(appliance.id, "wattage", Number(e.target.value))
                  }
                  className="bg-background/50 border-border/50 h-9 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Hrs/day"
                  step="0.5"
                  value={appliance.hoursPerDay || ""}
                  onChange={(e) =>
                    onUpdate(appliance.id, "hoursPerDay", Number(e.target.value))
                  }
                  className="bg-background/50 border-border/50 h-9 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={appliance.quantity || ""}
                  onChange={(e) =>
                    onUpdate(appliance.id, "quantity", Number(e.target.value))
                  }
                  className="bg-background/50 border-border/50 h-9 text-sm"
                />
                <div className="text-right font-mono text-sm font-semibold text-primary px-1">
                  {energyWh > 0 ? (
                    <span title={`${(energyWh / 1000).toFixed(2)} kWh/day`}>
                      {energyWh.toLocaleString()} <span className="text-xs text-muted-foreground">Wh</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">—</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(appliance.id)}
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mobile: show energy per appliance as label under each row */}
      {appliances.length > 0 && (
        <div className="sm:hidden space-y-1 px-2">
          {appliances.map((a) => {
            const e = a.wattage * a.hoursPerDay * a.quantity;
            if (e <= 0) return null;
            return (
              <div key={a.id} className="flex justify-between text-xs text-muted-foreground">
                <span>{a.name || "Unnamed"}</span>
                <span className="font-mono text-primary">{e.toLocaleString()} Wh/day</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplianceForm;
