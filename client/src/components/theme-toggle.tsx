import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-2.5 py-1.5 shadow-sm backdrop-blur-xl">
      <Sun className="h-4 w-4 text-accent" />
      <Switch
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Light theme" : "Dark theme"}
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="h-5 w-10 data-[state=checked]:bg-electric data-[state=unchecked]:bg-accent/70 [&>span]:h-4 [&>span]:w-4 [&>span]:data-[state=checked]:translate-x-5"
      />
      <Moon className="h-4 w-4 text-electric" />
    </div>
  );
}
