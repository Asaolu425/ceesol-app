export interface Appliance {
  id: string;
  name: string;
  wattage: number;
  hoursPerDay: number;
  quantity: number;
}

export type BatteryType = "lithium" | "tubular" | "lead-acid";
export type BatteryVoltage = 12 | 24 | 48;

export interface BatteryConfig {
  type: BatteryType;
  voltage: BatteryVoltage;
}

export type PanelType = "monocrystalline" | "polycrystalline" | "thin-film";
export type PanelSize = 545 | 450 | 400 | 350 | 300;

export interface PanelConfig {
  type: PanelType;
  size: PanelSize;
}

export type InverterVoltage = 12 | 24 | 48;
export type InverterBrand = "deye" | "growatt" | "must" | "victron" | "felicity" | "other";

export type InstallationType = "residential" | "commercial";

export interface InverterConfig {
  voltage: InverterVoltage;
  brand: InverterBrand;
}

export const BATTERY_INFO: Record<BatteryType, { label: string; dod: number; costPerUnit: number; lifespan: string; unitAh: number; unitVoltage: number }> = {
  lithium: { label: "Lithium (LiFePO4)", dod: 0.8, costPerUnit: 1050000, lifespan: "10–15 years", unitAh: 100, unitVoltage: 48 },
  tubular: { label: "Tubular Battery", dod: 0.5, costPerUnit: 180000, lifespan: "5–8 years", unitAh: 200, unitVoltage: 12 },
  "lead-acid": { label: "Lead Acid (Flat Plate)", dod: 0.5, costPerUnit: 120000, lifespan: "3–5 years", unitAh: 200, unitVoltage: 12 },
};

export const PANEL_INFO: Record<PanelType, { label: string; efficiency: string; description: string; vmp: number }> = {
  monocrystalline: { label: "Monocrystalline", efficiency: "20–22%", description: "Highest efficiency, best for limited space", vmp: 41 },
  polycrystalline: { label: "Polycrystalline", efficiency: "15–17%", description: "Good balance of cost and performance", vmp: 37 },
  "thin-film": { label: "Thin Film", efficiency: "10–13%", description: "Flexible, lightweight, lower efficiency", vmp: 30 },
};

export const PANEL_SIZES: { value: PanelSize; label: string }[] = [
  { value: 545, label: "545W" },
  { value: 450, label: "450W" },
  { value: 400, label: "400W" },
  { value: 350, label: "350W" },
  { value: 300, label: "300W" },
];

export const INVERTER_BRANDS: Record<InverterBrand, { label: string; origin: string }> = {
  deye: { label: "Deye", origin: "China" },
  growatt: { label: "Growatt", origin: "China" },
  must: { label: "Must", origin: "China" },
  victron: { label: "Victron Energy", origin: "Netherlands" },
  felicity: { label: "Felicity Solar", origin: "China" },
  other: { label: "Other / Generic", origin: "—" },
};

export interface CostBreakdown {
  panelsCost: number;
  batteryCost: number;
  inverterCost: number;
  accessoriesCost: number;
  installationCost: number;
  totalCost: number;
}

export interface SavingsEstimate {
  monthlyFuelCost: number;
  monthlySolarSavings: number;
  roiMonths: number;
}

export interface ChargeControllerInfo {
  type: "MPPT" | "PWM";
  ratedAmps: number;
  ratedVoltage: number;
  stringConfig: string; // e.g. "2S × 3P"
  panelsInSeries: number;
  panelsInParallel: number;
}

export interface BatteryBankInfo {
  totalAh: number;
  totalKwh: number;
  unitsInSeries: number;
  unitsInParallel: number;
  totalUnits: number;
  unitLabel: string; // e.g. "200Ah 12V"
}

export interface SolarResult {
  dailyKwh: number;
  peakWattage: number;
  totalLoad: number;
  panelWattage: number;
  inverterSizeW: number;
  inverterSizeKva: number;
  inverterSize: number;
  batteryCapacity1Day: number;
  batteryCapacity2Day: number;
  batteryCapacity3Day: number;
  batteryCapacityKwh: number;
  batteryBank: BatteryBankInfo;
  estimatedPanels: number;
  chargeController: ChargeControllerInfo;
  costBreakdown: CostBreakdown;
  savings: SavingsEstimate;
  backupTimeHours: number;
  batteryType: BatteryType;
  batteryVoltage: BatteryVoltage;
  panelType: PanelType;
  panelSize: PanelSize;
  inverterVoltage: InverterVoltage;
  inverterBrand: InverterBrand;
  installationType: InstallationType;
  targetBackupHours: number;
}

export const COMMON_APPLIANCES = [
  { name: "LED Light Bulb", wattage: 10, hours: 8 },
  { name: "Energy Saving Bulb", wattage: 25, hours: 6 },
  { name: "Standing Fan", wattage: 65, hours: 10 },
  { name: "Ceiling Fan", wattage: 75, hours: 10 },
  { name: "Television (LED 43\")", wattage: 100, hours: 6 },
  { name: "Television (LED 55\")", wattage: 150, hours: 6 },
  { name: "Laptop", wattage: 65, hours: 8 },
  { name: "Desktop Computer", wattage: 250, hours: 6 },
  { name: "Refrigerator", wattage: 150, hours: 24 },
  { name: "Deep Freezer", wattage: 200, hours: 24 },
  { name: "Air Conditioner (1HP)", wattage: 1000, hours: 8 },
  { name: "Air Conditioner (1.5HP)", wattage: 1200, hours: 8 },
  { name: "Air Conditioner (2HP)", wattage: 1800, hours: 8 },
  { name: "Washing Machine", wattage: 500, hours: 1 },
  { name: "Microwave", wattage: 1000, hours: 0.5 },
  { name: "Electric Iron", wattage: 1000, hours: 0.5 },
  { name: "Water Heater", wattage: 2000, hours: 1 },
  { name: "Water Pump", wattage: 750, hours: 2 },
  { name: "Phone Charger", wattage: 20, hours: 3 },
  { name: "Router/Modem", wattage: 15, hours: 24 },
  { name: "CCTV System", wattage: 50, hours: 24 },
  { name: "Blender", wattage: 350, hours: 0.25 },
  { name: "Electric Kettle", wattage: 1500, hours: 0.25 },
];

// Inverter efficiency factor
const INVERTER_EFF = 0.8;
// Headroom added to inverter sizing (1–2 kW)
const INVERTER_HEADROOM_W = 1500;

// Backup hours by installation type
export const BACKUP_HOURS: Record<InstallationType, number> = {
  residential: 10,
  commercial: 5,
};

// ── 2026 Nigerian Market Prices (researched) ──
// Solar panels: avg ₦420/W (JA Solar 545W ≈ ₦230k, Longi similar)
const PANEL_COST_PER_WATT = 420;

// Inverter cost per kVA by brand (2026 Nigerian market)
const INVERTER_COST_PER_KVA: Record<InverterBrand, number> = {
  deye: 350000,      // Deye 5kVA ≈ ₦1.7M → ₦340k/kVA
  growatt: 280000,   // Growatt 5kVA ≈ ₦1.4M → ₦280k/kVA
  must: 180000,      // Must 5kVA ≈ ₦900k → ₦180k/kVA
  victron: 470000,   // Victron Quattro 10kVA ≈ ₦4.7M → ₦470k/kVA
  felicity: 200000,  // Felicity 5kVA ≈ ₦1M → ₦200k/kVA
  other: 220000,
};

// MPPT charge controller cost per amp (60A ≈ ₦180k → ₦3,000/A)
const CC_COST_PER_AMP = 3000;

const ACCESSORIES_PERCENTAGE = 0.08;
const INSTALLATION_PERCENTAGE = 0.10;

// Generator fuel estimate
const AVG_GENERATOR_FUEL_COST_PER_LITER = 1100;
const AVG_GENERATOR_CONSUMPTION_LITERS_PER_KWH = 0.4;

export function calculateSolarNeeds(
  appliances: Appliance[],
  sunHours: number,
  batteryConfig: BatteryConfig = { type: "lithium", voltage: 48 },
  panelConfig: PanelConfig = { type: "monocrystalline", size: 545 },
  inverterConfig: InverterConfig = { voltage: 48, brand: "deye" },
  installationType: InstallationType = "residential"
): SolarResult {
  const { type: battType, voltage: battVoltage } = batteryConfig;
  const { dod, costPerUnit, unitAh, unitVoltage } = BATTERY_INFO[battType];
  const { size: panelSizeW, type: pType } = panelConfig;
  const targetBackupHours = BACKUP_HOURS[installationType];
  const { vmp } = PANEL_INFO[pType];

  const dailyWh = appliances.reduce(
    (sum, a) => sum + a.wattage * a.hoursPerDay * a.quantity,
    0
  );
  const dailyKwh = dailyWh / 1000;

  const peakWattage = appliances.reduce(
    (sum, a) => sum + a.wattage * a.quantity,
    0
  );

  // ── Total Load (daily consumption / sun hours) ──
  const totalLoad = sunHours > 0 ? dailyWh / sunHours : 0;

  // Panel wattage (with small system-loss margin)
  const panelWattage = Math.ceil(totalLoad * 1.1); // 10% system losses on top
  const estimatedPanels = panelSizeW > 0 ? Math.ceil(panelWattage / panelSizeW) : 0;

  // ── Inverter sizing: peak load / 0.8 + 1.5 kW headroom ──
  const inverterSizeW = Math.ceil((peakWattage / INVERTER_EFF) + INVERTER_HEADROOM_W);
  // Round up to nearest 500 W
  const inverterSizeRounded = Math.ceil(inverterSizeW / 500) * 500;
  // kVA (assume power factor 0.8)
  const inverterSizeKva = Math.round((inverterSizeRounded / 800) * 10) / 10; // W / 0.8 PF → VA then /1000

  // ── Battery sizing based on target backup hours ──
  // Required Wh for backup = peakWattage × targetBackupHours
  const backupWh = peakWattage * targetBackupHours;
  const batteryCapacityAh = backupWh > 0 ? Math.ceil(backupWh / (battVoltage * dod)) : 0;
  
  // Also calculate autonomy-based for reference
  const batteryCapacity1Day = Math.max(batteryCapacityAh, Math.ceil(dailyWh / (battVoltage * dod)));
  const batteryCapacity2Day = Math.ceil((dailyWh * 2) / (battVoltage * dod));
  const batteryCapacity3Day = Math.ceil((dailyWh * 3) / (battVoltage * dod));

  // kWh
  const batteryCapacityKwh = Math.round((batteryCapacity1Day * battVoltage) / 1000 * 100) / 100;

  // Battery bank configuration
  const batteriesInSeries = battVoltage / unitVoltage;
  const batteriesInParallel = Math.ceil(batteryCapacity1Day / unitAh);
  const totalBatteries = batteriesInSeries * batteriesInParallel;
  const batteryBank: BatteryBankInfo = {
    totalAh: batteryCapacity1Day,
    totalKwh: batteryCapacityKwh,
    unitsInSeries: batteriesInSeries,
    unitsInParallel: batteriesInParallel,
    totalUnits: totalBatteries,
    unitLabel: `${unitAh}Ah ${unitVoltage}V`,
  };

  // Actual backup time with sized battery
  const backupTimeHours = peakWattage > 0
    ? (batteryCapacity1Day * battVoltage * dod) / peakWattage
    : 0;

  // ── Charge Controller ──
  const maxPanelsInSeries = battVoltage <= 24 ? Math.max(1, Math.floor(150 / vmp)) : Math.max(1, Math.floor(450 / vmp));
  const panelsInParallel = estimatedPanels > 0 ? Math.ceil(estimatedPanels / maxPanelsInSeries) : 0;
  const panelsInSeries = panelsInParallel > 0 ? Math.ceil(estimatedPanels / panelsInParallel) : 0;
  const ccAmps = battVoltage > 0 ? Math.ceil(panelWattage / battVoltage) : 0;
  // Round up to standard MPPT sizes (30, 40, 60, 80, 100)
  const standardSizes = [30, 40, 60, 80, 100, 150];
  const ratedAmps = standardSizes.find(s => s >= ccAmps) || Math.ceil(ccAmps / 10) * 10;

  const chargeController: ChargeControllerInfo = {
    type: "MPPT",
    ratedAmps,
    ratedVoltage: battVoltage,
    stringConfig: `${panelsInSeries}S × ${panelsInParallel}P`,
    panelsInSeries,
    panelsInParallel,
  };

  // ── Cost breakdown in Nigerian Naira (2026 market prices) ──
  const panelsCost = panelWattage * PANEL_COST_PER_WATT;
  const batteryCost = totalBatteries * costPerUnit;
  const inverterKva = Math.ceil(inverterSizeKva);
  const inverterCost = inverterKva * INVERTER_COST_PER_KVA[inverterConfig.brand];
  const ccCost = ratedAmps * CC_COST_PER_AMP;
  const equipmentCost = panelsCost + batteryCost + inverterCost + ccCost;
  const accessoriesCost = Math.round(equipmentCost * ACCESSORIES_PERCENTAGE);
  const installationCost = Math.round(equipmentCost * INSTALLATION_PERCENTAGE);
  const totalCost = equipmentCost + accessoriesCost + installationCost;

  // Savings calculations
  const monthlyKwh = dailyKwh * 30;
  const monthlyFuelCost = Math.round(monthlyKwh * AVG_GENERATOR_CONSUMPTION_LITERS_PER_KWH * AVG_GENERATOR_FUEL_COST_PER_LITER);
  const monthlySolarSavings = monthlyFuelCost;
  const roiMonths = monthlySolarSavings > 0 ? Math.ceil(totalCost / monthlySolarSavings) : 0;

  return {
    dailyKwh: Math.round(dailyKwh * 100) / 100,
    peakWattage: Math.round(peakWattage),
    totalLoad: Math.round(totalLoad),
    panelWattage,
    inverterSizeW: inverterSizeRounded,
    inverterSizeKva,
    inverterSize: inverterSizeRounded,
    batteryCapacity1Day,
    batteryCapacity2Day,
    batteryCapacity3Day,
    batteryCapacityKwh,
    batteryBank,
    estimatedPanels,
    chargeController,
    costBreakdown: {
      panelsCost,
      batteryCost: Math.round(batteryCost),
      inverterCost,
      accessoriesCost,
      installationCost,
      totalCost,
    },
    savings: {
      monthlyFuelCost,
      monthlySolarSavings,
      roiMonths,
    },
    backupTimeHours: Math.round(backupTimeHours * 100) / 100,
    batteryType: battType,
    batteryVoltage: battVoltage,
    panelType: panelConfig.type,
    panelSize: panelSizeW,
    inverterVoltage: inverterConfig.voltage,
    inverterBrand: inverterConfig.brand,
    installationType,
    targetBackupHours: targetBackupHours,
  };
}
