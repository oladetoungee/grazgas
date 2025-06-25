"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className=" p-2 rounded-full bg-gray-100 dark:bg-gray-800 transition-all"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4 text-yellow-500" />
      ) : (
        <Sun className="h-4 w-4 text-gray-900" />
      )}
    </button>
  );
}
