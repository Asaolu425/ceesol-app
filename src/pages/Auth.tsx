import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2, Zap, ArrowLeft, Sun } from "lucide-react";
import ceejayLogo from "@/assets/ceejay-logo.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const floatingOrb = {
  animate: {
    y: [0, -20, 0],
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.1, 1],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const Auth = () => {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-12 h-12 text-gold-solar" />
        </motion.div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent! Check your email.");
      setShowForgotPassword(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="min-h-screen bg-navy relative flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        {...floatingOrb}
        className="absolute top-20 left-[10%] w-72 h-72 bg-cyan-electric/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] w-96 h-96 bg-gold-solar/8 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-electric/5 rounded-full blur-[150px]"
      />

      {/* Floating energy particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-electric rounded-full"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link to="/" className="flex items-center gap-2 text-foreground/50 hover:text-cyan-electric transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={ceejayLogo} alt="CeeJay Solar" className="h-16 w-auto rounded-xl" />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gold-solar/15 rounded-xl blur-xl"
              />
            </motion.div>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-foreground/50"
            >
              {isLogin ? "Welcome back! Sign in to your account" : "Join CeeJay Solar today"}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          {/* Card glow border */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-electric/30 via-cyan-electric/5 to-gold-solar/10 rounded-2xl blur-[1px]" />

          <div className="relative bg-navy-light/80 backdrop-blur-xl border border-cyan-electric/10 rounded-2xl p-8 space-y-6">
            {/* Google Sign In */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                className="w-full h-12 bg-navy/50 border-cyan-electric/20 hover:border-cyan-electric/50 hover:bg-cyan-electric/5 transition-all duration-300 group"
                onClick={handleGoogleSignIn}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyan-electric/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-navy-light/80 px-4 text-foreground/30 tracking-widest">or</span>
              </div>
            </motion.div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden"
                  >
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <Input
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-navy/60 border-cyan-electric/10 focus:border-cyan-electric/40 h-12 transition-all duration-300 placeholder:text-foreground/20"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={inputVariants}
                className="relative"
              >
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-navy/60 border-cyan-electric/10 focus:border-cyan-electric/40 h-12 transition-all duration-300 placeholder:text-foreground/20"
                />
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={inputVariants}
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-navy/60 border-cyan-electric/10 focus:border-cyan-electric/40 h-12 transition-all duration-300 placeholder:text-foreground/20"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-cyan-electric to-cyan-electric/80 hover:from-cyan-electric/90 hover:to-cyan-electric/70 text-navy font-semibold text-base transition-all duration-300 shadow-[0_0_20px_hsl(166_100%_70%/0.2)] hover:shadow-[0_0_30px_hsl(166_100%_70%/0.35)]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
              </motion.div>
            </form>

            {/* Forgot Password */}
            <AnimatePresence mode="wait">
              {showForgotPassword ? (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-3 overflow-hidden"
                >
                  <p className="text-sm text-foreground/50 text-center">Enter your email to receive a reset link</p>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="pl-10 bg-navy/60 border-cyan-electric/10 focus:border-cyan-electric/40 h-12 placeholder:text-foreground/20"
                    />
                  </div>
                  <Button type="submit" className="w-full h-10" disabled={resetSubmitting}>
                    {resetSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Send Reset Link
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="block mx-auto text-sm text-cyan-electric hover:text-gold-solar transition-colors"
                  >
                    Back to Sign In
                  </button>
                </motion.form>
              ) : (
                <motion.div key="toggle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  {isLogin && (
                    <button
                      onClick={() => setShowForgotPassword(true)}
                      className="block mx-auto text-sm text-foreground/40 hover:text-cyan-electric transition-colors"
                    >
                      Forgot your password?
                    </button>
                  )}
                  <p className="text-center text-sm text-foreground/40">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-cyan-electric hover:text-gold-solar transition-colors font-medium"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "60%" }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto h-[1px] mt-8 bg-gradient-to-r from-transparent via-cyan-electric/30 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default Auth;
