import React, { useEffect, useRef, useState, useContext } from "react";
import { toISODate, todayISO } from "../utils/DateUtils";
import { ApiService } from "../services/dashboardApi";
import { MdCancel } from "react-icons/md";
import { ThemeContext } from "../contexts/ThemeContext";

function makeTask(text, checked = false, date) {
  return { text, checked, date };
}

export default function ToDoCard({ selectedDate }) {
  const listRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [newText, setNewText] = useState("");
  const [msg, setMsg] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const selected = selectedDate ? new Date(selectedDate) : new Date();
  const selectedIso = toISODate(selected);
  const todayIso = todayISO();
  const CUTOFF = "2025-11-25";
  const isBeforeCutoff = selectedIso < CUTOFF;
  const isPast = selectedIso < todayIso;
  const isToday = selectedIso === todayIso;

  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  useEffect(() => {
    if (isBeforeCutoff) {
      setTasks([]);
      return;
    }
    async function fetchTodos() {
      try {
        const data = await ApiService.getTodos(selectedIso);
        setTasks(data && data.length > 0 ? data : []);
      } catch (e) {
        console.error("Failed to fetch todos", e);
      }
    }
    fetchTodos();
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }, [selectedIso]);

  async function handleAdd(e) {
    e.preventDefault();
    if (isPast || isBeforeCutoff || isAdding) return;
    if (!newText.trim()) return;

    setIsAdding(true);
    try {
      const nt = { text: newText.trim(), checked: false, date: selectedIso };
      const created = await ApiService.addTodo(nt);
      setTasks([...tasks, created]);
      setNewText("");
      setMsg("Task successfully added");
      setTimeout(() => setMsg(""), 1600);
      window.dispatchEvent(new Event("zyla:todos-updated"));
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      });
    } catch (e) {
      console.error("Failed to add todo", e);
    } finally {
      setIsAdding(false);
    }
  }

  async function toggle(id) {
    if (!isToday ) return;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const updated = await ApiService.updateTodo(id, !task.checked);
      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
      window.dispatchEvent(new Event("zyla:todos-updated"));
    } catch (e) {
      console.error("Failed to toggle todo", e);
    }
  }

  async function remove(id) {
    if (isPast || isBeforeCutoff) return;
    try {
      await ApiService.deleteTodo(id);
      setTasks(tasks.filter((t) => t.id !== id));
      window.dispatchEvent(new Event("zyla:todos-updated"));
    } catch (e) {
      console.error("Failed to delete todo", e);
    }
  }

  if (isBeforeCutoff) {
    return (
      <div
        className={`p-4 md:p-6 h-full flex flex-col rounded-[15px] ${
          isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"
        }`}
      >
        <h3 className="text-base md:text-lg font-extrabold">
          To-Do — {selected.toLocaleDateString()}
        </h3>
        <div className="mt-4 text-muted text-sm">No data available before 25/11/2025.</div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[15px] px-4 md:px-6 py-3 md:py-2 md:max-h-121  h-full flex flex-col min-h-0 shadow-lg ${
        isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"
      }`}
    >
      <div className="mb-2 mt-4">
        <h3 className="text-base md:text-lg font-extrabold">To-Do — {selected.toLocaleDateString()}</h3>
      </div>
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto custom-scrollbar min-h-0 md:max-h-110 my-3 pr-1"
      >
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between py-2 pl-2">
            
            <div className="flex items-center gap-3 min-w-0">
              <button
                disabled={!isToday}
                onClick={() => toggle(task.id)}
                className={`rounded-full border-2 flex items-center justify-center transition-colors
                  ${task.checked ? "text-white bg-linear-to-b from-[#a78bfa] to-[#8b5cf6] border-purple-900" : "bg-transparent border-gray-400"}
                  ${!isToday ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{
                  minWidth: 20,
                  minHeight: 20,
                  width: 20,
                  height: 20,
                }}
                aria-pressed={!!task.checked}
                aria-label={task.checked ? "Mark as not done" : "Mark as done"}
                type="button"
              >
                {task.checked && (
                  <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M4 12l5 5L20 6" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 wrap-break-word text-sm md:text-base ${
                  task.checked ? "line-through opacity-70" : ""
                }`}
                title={task.text}
              >
                {/* {task.text} */}
                {task.text.length > 26 ? task.text.slice(0,26) + "..." : task.text}
              </span>
            </div>
            <button
              disabled={isPast}
              onClick={() => remove(task.id)}
              className={`text-lg whitespace-nowrap pl-2 py-1 ${
                isPast ? "opacity-50 cursor-not-allowed text-red-400" : "cursor-pointer text-red-400"
              } p-2 md:p-0`}
              aria-label="Remove task"
              type="button"
            >
              <MdCancel />
            </button>
          </div>
        ))}
      </div>

      <div>
        <form onSubmit={handleAdd} className="flex items-center gap-3 mt-2">
          <input
            value={newText}
            disabled={isPast || isAdding}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add task..."
            className={`flex-1 rounded-md border px-3 py-2 md:px-4 md:py-3 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              isLight ? "bg-white text-gray-900 border-gray-300" : "bg-white/10 text-white border-white/20"
            }`}
          />
          <button
            type="submit"
            disabled={isPast || isAdding}
            className="rounded-md cursor-pointer px-4 py-2 md:px-4 md:py-3 font-semibold bg-linear-to-b from-[#a78bfa] to-[#8b5cf6] text-white disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isAdding ? (  
                <div className="w-6 h-6 animate-spin border-3 border-white border-b-transparent rounded-full" ></div>
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>

      <div className="flex items-center h-5 mt-2">
        <span className="text-green-700 dark:text-green-400 text-xs">{msg}</span>
      </div>
    </div>
  );
}