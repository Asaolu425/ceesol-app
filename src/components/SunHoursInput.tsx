import { useState, useEffect } from "react";
import { Sun, MapPin, Loader2, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { NIGERIAN_LOCATIONS, NigerianLocation } from "@/lib/nigeria-insolation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SunHoursInputProps {
  value: number;
  onChange: (val: number) => void;
}

const SunHoursInput = ({ value, onChange }: SunHoursInputProps) => {
  const { loading, error, location, detect } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    if (location) {
      onChange(location.peakSunHours);
      setSelectedCity(location.name);
    }
  }, [location, onChange]);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const city = NIGERIAN_LOCATIONS.find((l) => l.name === cityName);
    if (city) {
      onChange(city.peakSunHours);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-energy-amber" />
          <h3 className="font-semibold">Peak Sun Hours</h3>
        </div>
        <span className="text-2xl font-bold font-mono text-energy-amber">
          {value}h
        </span>
      </div>

      {/* Location detection */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={detect}
          disabled={loading}
          className="w-full gap-2 text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          {loading ? "Detecting..." : "Detect My Location"}
        </Button>

        {location && (
          <p className="text-xs text-primary flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Detected: {location.name}, {location.state} ({location.zone})
          </p>
        )}

        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>

      {/* Manual city selection */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Or select a city</label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Choose a Nigerian city" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {["North West", "North East", "North Central", "South West", "South East", "South South"].map((zone) => {
              const cities = NIGERIAN_LOCATIONS.filter((l) => l.zone === zone);
              return cities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}, {city.state} — {city.peakSunHours}h
                </SelectItem>
              ));
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Manual slider */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Or adjust manually</label>
        <Slider
          value={[value]}
          onValueChange={([v]) => {
            onChange(v);
            setSelectedCity("");
          }}
          min={3}
          max={7}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3h (Coastal)</span>
          <span>5h (Middle Belt)</span>
          <span>7h (Sahel)</span>
        </div>
      </div>
    </div>
  );
};

export default SunHoursInput;
