import React, { useState, useContext } from "react";
import { IoMdSearch } from "react-icons/io";
import { ThemeContext } from "../contexts/ThemeContext";

export default function SearchBar({ onSearch }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // Strict pattern for DD/MM/YYYY (day 1-31, month 1-12, year 1000-2999)
  function parseDateFromString(s) {
    if (!s || typeof s !== "string") return null;
    const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const day = Number(m[1]),
      month = Number(m[2]),
      year = Number(m[3]);
    if (year < 1000 || year > 2999) return null;
    if (month < 1 || month > 12) return null;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return null;
    // return JS Date (local timezone) normalized to midnight
    return new Date(year, month - 1, day);
  }

  function submit() {
    setError("");
    const parsed = parseDateFromString(value);
    if (!parsed) {
      setError("Enter a valid date in DD/MM/YYYY format.");
      return;
    }
    if (typeof onSearch === "function") onSearch(parsed);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") submit();
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-full">
      <div className="relative w-full flex items-center">
        <input
          aria-label="Search date (DD/MM/YYYY)"
          placeholder="Search tasks by date (dd/mm/yyyy)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className={`font-bold pr-12 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-purple-400 w-full
            ${isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"}
            text-sm md:text-base
            py-2 md:py-3 px-3
            min-w-[160px] md:min-w-[240px]`}
        />
        {/* icon inside input — positioned absolutely to the right */}
        <button
          type="button"
          aria-label="Search date"
          title="Search date"
          onClick={submit}
          className="absolute right-2 rounded-lg flex items-center justify-center bg-transparent border-none cursor-pointer text-purple-700 dark:text-purple-200
            h-10 w-10 md:h-9 md:w-9"
        >
          <IoMdSearch size={20} />
        </button>
      </div>
      {error && (
        <div role="alert" className="text-red-600 text-[12px] md:text-[13px]">
          {error}
        </div>
      )}
    </div>
  );
}