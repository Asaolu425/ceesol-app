import { Home, Building2 } from "lucide-react";
import { InstallationType, BACKUP_HOURS } from "@/lib/solar-calculations";

interface InstallationTypeSelectorProps {
  value: InstallationType;
  onChange: (type: InstallationType) => void;
}

const options: { type: InstallationType; label: string; icon: typeof Home; description: string }[] = [
  {
    type: "residential",
    label: "Residential",
    icon: Home,
    description: `Home / Apartment — ${BACKUP_HOURS.residential}hr backup`,
  },
  {
    type: "commercial",
    label: "Commercial",
    icon: Building2,
    description: `Office / Business — ${BACKUP_HOURS.commercial}hr backup`,
  },
];

const InstallationTypeSelector = ({ value, onChange }: InstallationTypeSelectorProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 glow-green">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Installation Type</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const active = value === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => onChange(opt.type)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-center ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
              }`}
            >
              <opt.icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className="text-[10px] leading-tight opacity-80">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InstallationTypeSelector;
