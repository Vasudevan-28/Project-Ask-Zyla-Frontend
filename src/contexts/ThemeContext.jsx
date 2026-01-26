import React, { createContext, useEffect, useState } from "react";
import { getThemeCookie, setThemeCookie } from "../utils/themeCookie";

export const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = getThemeCookie()
      return stored === "light" ? "light" : "dark";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");

    try {
      setThemeCookie(theme)
    } catch (e) {
      
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
