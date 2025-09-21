"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem("blog:theme");
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
        root.classList.add("theme-inverted");
      } else {
        root.classList.remove("dark");
        root.classList.remove("theme-inverted");
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return null;
}
