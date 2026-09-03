"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup";

export default function AdminLoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If already authenticated, redirect to dashboard.
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/admin");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Invalid credentials", {
        description: error.message || "Please check your email and password.",
      });
      setIsLoading(false);
    } else {
      toast.success("Login successful!", {
        description: "Welcome to the admin panel.",
      });
      router.replace("/admin");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      toast.error("Sign up failed", {
        description: error.message,
      });
      setIsLoading(false);
    } else {
      toast.success("Account created!", {
        description: "You can now log in with your credentials.",
      });
      setMode("login");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display tracking-tight uppercase font-medium mb-2">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Sign in to manage your portfolio" : "Create your admin account"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-md border border-border overflow-hidden mb-6">
            <button
              onClick={() => { setMode("login"); setConfirmPassword(""); }}
              className={`flex-1 py-2 text-xs font-medium tracking-wider uppercase transition-colors ${
                mode === "login"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("signup"); setConfirmPassword(""); }}
              className={`flex-1 py-2 text-xs font-medium tracking-wider uppercase transition-colors ${
                mode === "signup"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juwain.me@gmail.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full px-4 py-3 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juwain.me@gmail.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !password || !confirmPassword}
                className="w-full px-4 py-3 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {mode === "login"
                ? "Only authorized users can access the admin panel"
                : "Your account will be verified before getting write access"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
