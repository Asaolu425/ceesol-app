import { useState, useMemo, useCallback } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplianceForm from "@/components/ApplianceForm";
import LiveStats from "@/components/LiveStats";
import SunHoursInput from "@/components/SunHoursInput";
import BatteryConfigInput from "@/components/BatteryConfigInput";
import PanelConfigInput from "@/components/PanelConfigInput";
import InverterConfigInput from "@/components/InverterConfigInput";
import InstallationTypeSelector from "@/components/InstallationTypeSelector";
import ResultsPanel from "@/components/ResultsPanel";
import ConsumptionCharts from "@/components/ConsumptionCharts";
import CostBreakdown from "@/components/CostBreakdown";
import BackupTimeDisplay from "@/components/BackupTimeDisplay";
import SystemDiagram from "@/components/SystemDiagram";
import WiringDiagram from "@/components/WiringDiagram";
import Installation3D from "@/components/Installation3D";
import SystemWarnings from "@/components/SystemWarnings";
import CableSizing from "@/components/CableSizing";
import SolarProductionCard from "@/components/SolarProductionCard";
import SystemRecommendation from "@/components/SystemRecommendation";
import QuoteForm from "@/components/QuoteForm";
import InstallationRequestForm from "@/components/InstallationRequestForm";
import {
  Appliance,
  BatteryType,
  BatteryVoltage,
  PanelType,
  PanelSize,
  InverterVoltage,
  InverterBrand,
  InstallationType,
  calculateSolarNeeds,
} from "@/lib/solar-calculations";

let nextId = 1;
const genId = () => `appliance-${nextId++}`;

const Index = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [sunHours, setSunHours] = useState(5);
  const [batteryType, setBatteryType] = useState<BatteryType>("lithium");
  const [batteryVoltage, setBatteryVoltage] = useState<BatteryVoltage>(48);
  const [panelType, setPanelType] = useState<PanelType>("monocrystalline");
  const [panelSize, setPanelSize] = useState<PanelSize>(545);
  const [inverterVoltage, setInverterVoltage] = useState<InverterVoltage>(48);
  const [inverterBrand, setInverterBrand] = useState<InverterBrand>("deye");
  const [installationType, setInstallationType] = useState<InstallationType>("residential");

  const result = useMemo(
    () =>
      calculateSolarNeeds(
        appliances,
        sunHours,
        { type: batteryType, voltage: batteryVoltage },
        { type: panelType, size: panelSize },
        { voltage: inverterVoltage, brand: inverterBrand },
        installationType
      ),
    [appliances, sunHours, batteryType, batteryVoltage, panelType, panelSize, inverterVoltage, inverterBrand, installationType]
  );

  const handleAdd = useCallback((data: Omit<Appliance, "id">) => {
    setAppliances((prev) => [...prev, { ...data, id: genId() }]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleUpdate = useCallback(
    (id: string, field: keyof Appliance, value: string | number) => {
      setAppliances((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
      );
    },
    []
  );

  const systemSizeLabel = result.inverterSize > 0
    ? `${(result.inverterSize / 1000).toFixed(1)} kVA`
    : "";

  return (
    <div className="min-h-screen bg-background bg-grid flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl flex-1">
        <LiveStats
          dailyKwh={result.dailyKwh}
          peakWattage={result.peakWattage}
          applianceCount={appliances.length}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <ApplianceForm
            appliances={appliances}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
          />
          <div className="space-y-4">
            <InstallationTypeSelector value={installationType} onChange={setInstallationType} />
            <SunHoursInput value={sunHours} onChange={setSunHours} />
            <PanelConfigInput
              panelType={panelType}
              panelSize={panelSize}
              onTypeChange={setPanelType}
              onSizeChange={setPanelSize}
            />
            <InverterConfigInput
              inverterVoltage={inverterVoltage}
              inverterBrand={inverterBrand}
              onVoltageChange={setInverterVoltage}
              onBrandChange={setInverterBrand}
            />
            <BatteryConfigInput
              batteryType={batteryType}
              batteryVoltage={batteryVoltage}
              onTypeChange={setBatteryType}
              onVoltageChange={setBatteryVoltage}
            />
          </div>
        </div>

        {/* System Warnings */}
        <SystemWarnings result={result} sunHours={sunHours} />

        {/* Charts */}
        <ConsumptionCharts appliances={appliances} />

        {/* Solar Production & Recharge */}
        <SolarProductionCard result={result} sunHours={sunHours} />

        {/* System Diagram */}
        <SystemDiagram
          panels={result.estimatedPanels}
          panelSize={result.panelSize}
          inverterSize={result.inverterSize}
          batteryCapacity={result.batteryCapacity1Day}
          batteryVoltage={result.batteryVoltage}
        />

        {/* Interactive Wiring Diagram */}
        <WiringDiagram result={result} />

        {/* 3D Installation Preview */}
        <Installation3D result={result} />

        {/* Backup Time */}
        <BackupTimeDisplay
          backupTimeHours={result.backupTimeHours}
          batteryCapacityKwh={result.batteryCapacityKwh}
          peakWattage={result.peakWattage}
          targetBackupHours={result.targetBackupHours}
          installationType={result.installationType}
        />

        {/* System Recommendations */}
        <ResultsPanel result={result} />

        {/* Recommended System Summary */}
        <SystemRecommendation result={result} />

        {/* Cable Sizing */}
        <CableSizing
          defaultCurrent={result.chargeController.ratedAmps}
          defaultVoltage={result.batteryVoltage}
        />

        {/* Cost & Savings */}
        <CostBreakdown cost={result.costBreakdown} savings={result.savings} />

        {/* Action Buttons */}
        {result.dailyKwh > 0 && (
          <div className="flex flex-wrap gap-3">
            <QuoteForm result={result} />
            <InstallationRequestForm systemSize={systemSizeLabel} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
