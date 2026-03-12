import { LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ceejayLogo from "@/assets/ceejay-logo.jpeg";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <img src={ceejayLogo} alt="CeeJay Solar" className="h-10 w-auto rounded-lg" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Solar Design & Quotation Platform
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:block uppercase tracking-wider">
            by Ceejay Solar
          </span>
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block ml-3">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
              <User className="w-4 h-4 mr-1" /> Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
