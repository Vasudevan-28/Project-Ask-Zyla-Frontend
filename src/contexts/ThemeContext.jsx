import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("askzyla_theme");
      return stored === "light" ? "light" : "dark";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    // keep body classes in sync for CSS (important)
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");

    try {
      localStorage.setItem("askzyla_theme", theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
