
import React, { useEffect, useState, useContext, useCallback } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { ApiService } from "../services/dashboardApi";

export default function StreakBar({ userToken, selectedIso }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [todos, setTodos] = useState([]);
  const [streak, setStreak] = useState(0);

  const fetchStreak = useCallback(async () => {
    if (!userToken) return;
    try {
      const s = await ApiService.getStreak(userToken);
      setStreak(s);
    } catch (e) {
      console.error("Failed to fetch streak", e);
    }
  }, [userToken]);

  useEffect(() => {
    fetchStreak();

    function onTodosUpdated() {
      fetchStreak();
    }

    window.addEventListener("zyla:todos-updated", onTodosUpdated);
    const id = setInterval(fetchStreak, 60 * 1000);

    return () => {
      window.removeEventListener("zyla:todos-updated", onTodosUpdated);
      clearInterval(id);
    };
  }, [fetchStreak]);

  async function fetchTodos() {
    if (!userToken || !selectedIso) return;

    try {
      const data = await ApiService.getTodos(selectedIso, userToken);
      setTodos(data ?? []);
    } catch (e) {
      console.error("Failed to fetch todos", e);
    }
  }

  useEffect(() => {
    fetchTodos();

    function onTodosUpdated() {
      fetchTodos();
    }

    window.addEventListener("zyla:todos-updated", onTodosUpdated);

    return () => {
      window.removeEventListener("zyla:todos-updated", onTodosUpdated);
    };
  }, [userToken, selectedIso]);

  // calculate daily progress
  const total = todos.length;
  const completed = todos.filter((t) => t.checked).length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const stroke = "1.5px solid rgba(255,255,255,0.95)";

  return (
    <div
      className={`${
        isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"
      } p-4 rounded-lg`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 22 }}>🔥</div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.65 }}>Streak</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            {streak} {streak === 1 ? "Day" : "Days"}
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
            {completed}/{total} tasks completed today
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            background: "rgba(0,0,0,0.06)",
            border: stroke,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${percent}%`,
              transition: "width 300ms ease",
              background: "linear-gradient(90deg, #a78bfa, #8b5cf6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
