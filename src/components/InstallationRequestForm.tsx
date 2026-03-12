import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface InstallationRequestFormProps {
  systemSize: string;
}

const InstallationRequestForm = ({ systemSize }: InstallationRequestFormProps) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    systemSize: systemSize,
    preferredDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Installation request submitted! We'll contact you soon.");
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({ name: "", phone: "", location: "", systemSize, preferredDate: "" });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="outline"
          onClick={() => { setOpen(true); handleReset(); }}
          className="gap-2"
        >
          <Wrench className="w-4 h-4" /> Request Solar Installation
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Solar Installation</DialogTitle>
            <DialogDescription>
              Book an installation with our team. We'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Full Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Phone Number *</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+234..."
                  required
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Location *</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Lagos, Nigeria"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">System Size</label>
                <Input
                  value={form.systemSize}
                  onChange={(e) => setForm((p) => ({ ...p, systemSize: e.target.value }))}
                  placeholder="e.g. 5kVA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Preferred Installation Date</label>
                <Input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => setForm((p) => ({ ...p, preferredDate: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" /> Submit Request
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center py-6">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <p className="text-foreground font-semibold">
                ✅ Installation request submitted!
              </p>
              <p className="text-sm text-muted-foreground">
                Our engineer, Engr Asaolu Emmanuel, will contact you within 24 hours.
              </p>
              <p className="text-xs text-muted-foreground">
                Ceejay Solar • Professional Solar Installations
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallationRequestForm;
