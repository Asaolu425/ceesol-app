import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, Send } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SolarResult, BATTERY_INFO, PANEL_INFO, INVERTER_BRANDS } from "@/lib/solar-calculations";
import { toast } from "sonner";

interface QuoteFormProps {
  result: SolarResult;
}

const formatNaira = (amount: number) => `₦${amount.toLocaleString()}`;

const generateReportText = (
  result: SolarResult,
  customer: { name: string; email: string; phone: string; location: string }
) => {
  const battInfo = BATTERY_INFO[result.batteryType];
  const panelInfo = PANEL_INFO[result.panelType];
  const inverterInfo = INVERTER_BRANDS[result.inverterBrand];
  const hours = Math.floor(result.backupTimeHours);
  const minutes = Math.round((result.backupTimeHours - hours) * 60);

  return `
═══════════════════════════════════════════════════
    CEEJAY SOLAR – SOLAR SYSTEM RECOMMENDATION REPORT
═══════════════════════════════════════════════════

CUSTOMER INFORMATION
────────────────────
Name:       ${customer.name}
Email:      ${customer.email}
Phone:      ${customer.phone}
Location:   ${customer.location}

SOLAR SYSTEM CALCULATION RESULTS
─────────────────────────────────
Daily Energy Consumption:    ${result.dailyKwh} kWh
Peak Load:                   ${result.peakWattage.toLocaleString()} W
Monthly Consumption:         ${(result.dailyKwh * 30).toFixed(1)} kWh

SOLAR PANELS
────────────
Panel Type:      ${panelInfo.label} (${panelInfo.efficiency} efficiency)
Panel Size:      ${result.panelSize}W each
Panels Required: ${result.estimatedPanels} panels
Total Capacity:  ${result.panelWattage.toLocaleString()} W

INVERTER
────────
Brand:           ${inverterInfo.label}
Voltage:         ${result.inverterVoltage}V
Size:            ${result.inverterSize.toLocaleString()} W

BATTERY BANK
────────────
Battery Type:    ${battInfo.label}
System Voltage:  ${result.batteryVoltage}V
1-Day Autonomy:  ${result.batteryCapacity1Day} Ah
2-Day Autonomy:  ${result.batteryCapacity2Day} Ah
3-Day Autonomy:  ${result.batteryCapacity3Day} Ah
Backup Time:     ${hours}h ${minutes}m at full load
Lifespan:        ${battInfo.lifespan}

COST ESTIMATE (Nigerian Naira)
──────────────────────────────
Solar Panels:          ${formatNaira(result.costBreakdown.panelsCost)}
Battery Bank:          ${formatNaira(result.costBreakdown.batteryCost)}
Inverter:              ${formatNaira(result.costBreakdown.inverterCost)}
Accessories & Wiring:  ${formatNaira(result.costBreakdown.accessoriesCost)}
Installation:          ${formatNaira(result.costBreakdown.installationCost)}
─────────────────────────────────
TOTAL SYSTEM COST:     ${formatNaira(result.costBreakdown.totalCost)}

SAVINGS ANALYSIS
────────────────
Monthly Generator Cost:   ${formatNaira(result.savings.monthlyFuelCost)}
Monthly Solar Savings:    ${formatNaira(result.savings.monthlySolarSavings)}
Return on Investment:     ${result.savings.roiMonths} months (${(result.savings.roiMonths / 12).toFixed(1)} years)

═══════════════════════════════════════════════════
Engineer: Engr Asaolu Emmanuel
Company:  Ceejay Solar
Generated from: CeeSol Solar Calculator
═══════════════════════════════════════════════════
  `.trim();
};

const QuoteForm = ({ result }: QuoteFormProps) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });

  if (result.dailyKwh === 0) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.location) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitted(true);
    toast.success("Your solar report has been generated!");
  };

  const handleDownloadPDF = () => {
    const battInfo = BATTERY_INFO[result.batteryType];
    const panelInfo = PANEL_INFO[result.panelType];
    const inverterInfo = INVERTER_BRANDS[result.inverterBrand];
    const hours = Math.floor(result.backupTimeHours);
    const minutes = Math.round((result.backupTimeHours - hours) * 60);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const addTitle = (text: string) => {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 25, 47);
      doc.text(text, pageWidth / 2, y, { align: "center" });
      y += 8;
    };

    const addSectionHeader = (text: string) => {
      y += 4;
      doc.setFillColor(10, 25, 47);
      doc.rect(14, y - 5, pageWidth - 28, 8, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 255, 218);
      doc.text(text, 18, y);
      y += 8;
    };

    const addRow = (label: string, value: string) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(label, 18, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 25, 47);
      doc.text(value, pageWidth - 18, y, { align: "right" });
      y += 7;
    };

    const addDivider = () => {
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, pageWidth - 14, y);
      y += 4;
    };

    // Header
    addTitle("CEEJAY SOLAR");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Solar System Recommendation Report", pageWidth / 2, y, { align: "center" });
    y += 4;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: "center" });
    y += 8;
    addDivider();

    // Customer Info
    addSectionHeader("CUSTOMER INFORMATION");
    addRow("Name", form.name);
    addRow("Email", form.email);
    addRow("Phone", form.phone);
    addRow("Location", form.location);

    // Energy
    addSectionHeader("ENERGY CONSUMPTION");
    addRow("Daily Consumption", `${result.dailyKwh} kWh`);
    addRow("Monthly Consumption", `${(result.dailyKwh * 30).toFixed(1)} kWh`);
    addRow("Peak Load", `${result.peakWattage.toLocaleString()} W`);

    // Panels
    addSectionHeader("SOLAR PANELS");
    addRow("Panel Type", `${panelInfo.label} (${panelInfo.efficiency})`);
    addRow("Panel Size", `${result.panelSize}W each`);
    addRow("Panels Required", `${result.estimatedPanels} panels`);
    addRow("Total Capacity", `${result.panelWattage.toLocaleString()} W`);

    // Inverter
    addSectionHeader("INVERTER");
    addRow("Brand", inverterInfo.label);
    addRow("Voltage", `${result.inverterVoltage}V`);
    addRow("Size", `${result.inverterSize.toLocaleString()} W`);

    // Battery
    addSectionHeader("BATTERY BANK");
    addRow("Battery Type", battInfo.label);
    addRow("System Voltage", `${result.batteryVoltage}V`);
    addRow("1-Day Autonomy", `${result.batteryCapacity1Day} Ah`);
    addRow("2-Day Autonomy", `${result.batteryCapacity2Day} Ah`);
    addRow("3-Day Autonomy", `${result.batteryCapacity3Day} Ah`);
    addRow("Backup Time", `${hours}h ${minutes}m at full load`);
    addRow("Lifespan", battInfo.lifespan);

    // Cost
    addSectionHeader("COST ESTIMATE (₦)");
    addRow("Solar Panels", formatNaira(result.costBreakdown.panelsCost));
    addRow("Battery Bank", formatNaira(result.costBreakdown.batteryCost));
    addRow("Inverter", formatNaira(result.costBreakdown.inverterCost));
    addRow("Accessories & Wiring", formatNaira(result.costBreakdown.accessoriesCost));
    addRow("Installation", formatNaira(result.costBreakdown.installationCost));
    addDivider();
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(10, 25, 47);
    doc.text("TOTAL SYSTEM COST", 18, y);
    doc.setTextColor(100, 255, 218);
    doc.text(formatNaira(result.costBreakdown.totalCost), pageWidth - 18, y, { align: "right" });
    y += 10;

    // Savings
    addSectionHeader("SAVINGS ANALYSIS");
    addRow("Monthly Generator Cost", formatNaira(result.savings.monthlyFuelCost));
    addRow("Monthly Solar Savings", formatNaira(result.savings.monthlySolarSavings));
    addRow("ROI", `${result.savings.roiMonths} months (${(result.savings.roiMonths / 12).toFixed(1)} years)`);

    // Footer
    y += 8;
    addDivider();
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Engineer: Engr Asaolu Emmanuel | Ceejay Solar", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.text("Phone: +234 905 047 1379 | Email: ceejaysolar@gmail.com", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.text("WhatsApp: wa.me/2349166354417", pageWidth / 2, y, { align: "center" });

    doc.save(`CeeSol_Report_${form.name.replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF report downloaded!");
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", location: "" });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 flex-wrap"
      >
        <Button onClick={() => { setOpen(true); handleReset(); }} className="gap-2">
          <FileText className="w-4 h-4" /> Get Solar Quote
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Get Your Solar Quote</DialogTitle>
            <DialogDescription>
              Enter your details to receive a professional solar system report.
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Email Address</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Phone Number</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+234..."
                  required
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">City / State</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Lagos, Nigeria"
                  required
                  maxLength={100}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" /> Generate Report
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center py-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <p className="text-foreground font-semibold">
                ✅ Your solar report has been sent. Our engineer will contact you shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Report prepared for {form.name}
              </p>
              <Button onClick={handleDownloadPDF} variant="outline" className="gap-2 w-full">
                <Download className="w-4 h-4" /> Download Report
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteForm;
