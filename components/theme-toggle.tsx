"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Use client-side state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Only show the UI after first render on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Light mode">
          <Sun className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Dark mode">
          <Moon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="System theme">
          <Laptop className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={theme === "light" ? "bg-accent" : ""}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "bg-accent" : ""}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={theme === "system" ? "bg-accent" : ""}
        aria-label="System theme"
      >
        <Laptop className="h-4 w-4" />
      </Button>
    </div>
  );
}
