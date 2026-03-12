import ceejayLogo from "@/assets/ceejay-logo.jpeg";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-12">
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <img src={ceejayLogo} alt="CeeJay Solar" className="h-8 w-auto rounded" />
        </div>
        <div className="text-center text-xs">
          <p>Engineer: Engr Asaolu Emmanuel</p>
          <p className="mt-0.5">Powered by CeeSol Solar Calculator</p>
        </div>
        <div className="text-xs text-right">
          <p>Professional Solar Installations</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
