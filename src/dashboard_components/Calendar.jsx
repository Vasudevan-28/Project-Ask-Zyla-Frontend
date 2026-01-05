import React, { useEffect, useState, useContext, useRef } from "react";
import { toISODate, todayISO } from "../utils/DateUtils";
// import StorageService from "../utils/StorageService";
import { ThemeContext } from "../contexts/ThemeContext";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

export default function Calendar({ selectedDate, onDateChange, completedDates = [] }) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";
  const [viewDate, setViewDate] = useState(new Date(selectedDate || new Date()));
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const monthListRef = useRef(null);
  const yearListRef = useRef(null);

  useEffect(() => {
    if (selectedDate) setViewDate(new Date(selectedDate));
  }, [selectedDate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setShowMonthDropdown(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target)) {
        setShowYearDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to current month/year when dropdown opens
  useEffect(() => {
    if (showMonthDropdown && monthListRef.current) {
      const currentMonthIndex = viewDate.getMonth();
      const monthButton = monthListRef.current.children[currentMonthIndex];
      if (monthButton) {
        monthButton.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [showMonthDropdown, viewDate]);

  useEffect(() => {
    if (showYearDropdown && yearListRef.current) {
      const currentYear = viewDate.getFullYear();
      // Calculate year index: years array is from (currentYear - 50) to (currentYear + 49)
      const yearIndex = currentYear - (currentYear - 50);
      if (yearIndex >= 0 && yearIndex < 100) {
        const yearButton = yearListRef.current.children[yearIndex];
        if (yearButton) {
          yearButton.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
    }
  }, [showYearDropdown, viewDate]);

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function selectMonth(monthIndex) {
    setViewDate((d) => new Date(d.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  }

  function selectYear(year) {
    setViewDate((d) => new Date(year, d.getMonth(), 1));
    setShowYearDropdown(false);
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = viewDate.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  const first = startOfMonth(viewDate);
  const firstDay = first.getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  const cells = Array.from({ length: 42 }).map((_, index) => {
    const dayNum = index - firstDay + 1;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
    const isValidDay = dayNum >= 1 && dayNum <= daysInMonth;
    return { date, dayNum, isValidDay };
  });

  const todayIso = todayISO();

  function dayHasFullComplete(date) {
    const iso = toISODate(date);
    return completedDates.includes(iso);
  }

  const selectedIso = selectedDate ? toISODate(selectedDate) : null;

  return (
    <div className="w-full box-border">
      <div
        className={`rounded-[15px] p-4 md:p-6 h-full flex flex-col ${isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"}`}
        style={{
          minHeight: 0,
          borderRadius: 15,
        }}
      >
        {/* Header row */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-base md:text-lg font-extrabold">Calendar</div>
          <button
            className="rounded-xl border border-black/5 text-white bg-linear-to-b from-[#a78bfa] to-[#8b5cf6] px-3 py-2 text-sm font-bold shadow-sm
                       hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300
                       dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20"
            onClick={() => {
              const d = new Date();
              const normalized = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              onDateChange && onDateChange(normalized);
            }}
            type="button"
          >
            Today
          </button>
        </div>

        {/* Month controls */}
        <div className="mb-2 flex items-center justify-center gap-3 md:gap-4" role="toolbar" aria-label="Month navigation">
          <button
            className="min-w-9 rounded-lg border border-transparent px-2 py-1 text-center text-sm font-semibold hover:bg-slate-100
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300
                       dark:hover:bg-white/10"
            onClick={prevMonth}
            role="button"
            aria-label="Previous month"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && prevMonth()}
            type="button"
          >
            <IoMdArrowDropleft className="text-2xl" />
          </button>

          <div className="relative flex items-center gap-1">
            {/* Month Selector */}
            <div className="relative" ref={monthDropdownRef}>
              <button
                className="text-[15px] font-extrabold hover:opacity-80 transition-opacity cursor-pointer px-1 rounded text-sm md:text-[15px]"
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                type="button"
                aria-label="Select month"
              >
                {viewDate.toLocaleString("default", { month: "long" })}
              </button>

              {/* Month Dropdown */}
              {showMonthDropdown && (
                <div
                  ref={monthListRef}
                  className={`absolute top-full left-0 mt-2 z-50 rounded-lg shadow-lg border backdrop-blur-sm ${
                    isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white border-white/30 text-slate-900"
                  }`}
                  style={{
                    minWidth: "140px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: isLight ? "0 10px 25px rgba(0,0,0,0.15)" : "0 10px 25px rgba(0,0,0,0.5)",
                    scrollbarWidth: "thin",
                    scrollbarColor: isLight ? "rgba(139, 92, 246, 0.3) rgba(0,0,0,0.1)" : "rgba(139, 92, 246, 0.5) rgba(255,255,255,0.1)",
                  }}
                >
                  {months.map((month, index) => {
                    const isCurrentMonth = index === viewDate.getMonth();
                    return (
                      <button
                        key={index}
                        className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors ${
                          isCurrentMonth
                            ? isLight
                              ? "bg-purple-100 text-purple-700"
                              : "bg-purple-500/30 text-purple-700"
                            : isLight
                            ? "hover:bg-slate-100 text-slate-700"
                            : "hover:bg-purple-100/50 text-slate-800"
                        }`}
                        onClick={() => selectMonth(index)}
                        type="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectMonth(index);
                          }
                        }}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span className="text-[15px] font-extrabold ">,</span>

            {/* Year Selector */}
            <div className="relative" ref={yearDropdownRef}>
              <button
                className="text-[15px] font-extrabold hover:opacity-80 transition-opacity cursor-pointer px-1 rounded text-sm md:text-[15px]"
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                type="button"
                aria-label="Select year"
              >
                {viewDate.getFullYear()}
              </button>

              {/* Year Dropdown */}
              {showYearDropdown && (
                <div
                  ref={yearListRef}
                  className={`absolute top-full right-0 mt-2 z-50 rounded-lg shadow-lg border backdrop-blur-sm ${
                    isLight ? "bg-white border-slate-200 text-slate-900" : "bg-white border-white/30 text-slate-900"
                  }`}
                  style={{
                    minWidth: "100px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    boxShadow: isLight ? "0 10px 25px rgba(0,0,0,0.15)" : "0 10px 25px rgba(0,0,0,0.5)",
                    scrollbarWidth: "thin",
                    scrollbarColor: isLight ? "rgba(139, 92, 246, 0.3) rgba(0,0,0,0.1)" : "rgba(139, 92, 246, 0.5) rgba(255,255,255,0.1)",
                  }}
                >
                  {years.map((year) => {
                    const isCurrentYear = year === viewDate.getFullYear();
                    return (
                      <button
                        key={year}
                        className={`w-full text-center px-4 py-2 text-sm font-semibold transition-colors ${
                          isCurrentYear
                            ? isLight
                              ? "bg-purple-100 text-purple-700"
                              : "bg-purple-500/30 text-purple-700"
                            : isLight
                            ? "hover:bg-slate-100 text-slate-700"
                            : "hover:bg-purple-100/50 text-slate-800"
                        }`}
                        onClick={() => selectYear(year)}
                        type="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectYear(year);
                          }
                        }}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <button
            className="min-w-9 rounded-lg border border-transparent px-2 py-1 text-center text-sm font-semibold hover:bg-slate-100
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300
                        dark:hover:bg-white/10"
            onClick={nextMonth}
            role="button"
            aria-label="Next month"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && nextMonth()}
            type="button"
          >
            <IoMdArrowDropright className="text-2xl" />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-xs md:text-[11px] text-slate-500 font-bold">
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid flex-1 grid-cols-7 gap-1 overflow-auto pt-2 pb-2 px-1 md:px-2">
          {cells.map((cell, idx) => {
            const iso = toISODate(cell.date);
            const isToday = iso === todayIso;
            const isSelected = selectedIso === iso;
            const hasHeart = cell.isValidDay && dayHasFullComplete(cell.date);

            const baseClasses =
              "relative flex items-center justify-center rounded-[10px] border text-[12px] md:text-[13px] font-bold box-border cursor-pointer select-none overflow-visible";

            const emptyClasses = "cursor-default border-transparent bg-transparent text-transparent opacity-0 pointer-events-none";

            const normalClasses = "border-slate-800/10 bg-white/5 border-white/10 shadow-sm";

            const todayClasses = "bg-zyla-light-bg font-black border-none shadow-none bg-white/5 border-white/20 ring-[3px] ring-purple-500/30";

            const selectedClasses = "border-none bg-gradient-to-b from-[#a78bfa] to-[#8b5cf6] text-white shadow-md";

            let dayClassName = baseClasses;

            if (!cell.isValidDay) {
              dayClassName += " " + emptyClasses;
            } else if (isSelected) {
              dayClassName += " " + selectedClasses;
            } else if (isToday) {
              dayClassName += " " + todayClasses;
            } else {
              dayClassName += " " + normalClasses;
            }

            return (
              <div
                key={idx}
                onClick={() => cell.isValidDay && onDateChange && onDateChange(new Date(cell.date))}
                className={`${dayClassName} ${cell.isValidDay ? "h-9 md:h-11" : "h-9 md:h-11"} w-full`}
                role={cell.isValidDay ? "button" : "presentation"}
                aria-label={cell.isValidDay ? `Day ${cell.dayNum}` : ""}
                tabIndex={cell.isValidDay ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && cell.isValidDay) {
                    onDateChange && onDateChange(new Date(cell.date));
                  }
                }}
              >
                {cell.isValidDay ? cell.dayNum : ""}
                {hasHeart && (
                  <span className="pointer-events-none absolute right-1 top-1 z-10 text-[11px] leading-none text-pink-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                    <IoMdHeart />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}