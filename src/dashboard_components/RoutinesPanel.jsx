import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { MdCancel } from "react-icons/md";

import { getTimeFormatCookie } from "../utils/timeformatCookie";

export default function RoutinesPanel({
  routines = { morning: [], afternoon: [], evening: [] },
  onRemove = () => {},
}) {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [local, setLocal] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });

  const [ is24Hr, setIs24Hr ] = useState(true)

  useEffect(() => {
    try {
      const timeFormat = getTimeFormatCookie()
      setIs24Hr(timeFormat === "true")
    } catch{
      setIs24Hr(false)
    }
  }, [])

  useEffect(() => {
    setLocal({
      morning: routines.morning || [],
      afternoon: routines.afternoon || [],
      evening: routines.evening || [],
    });
  }, [routines]);

  function utcToLocalTime(timeStr) {
  if (!timeStr) return "";

  const [h, m] = timeStr.split(":").map(Number);

  const d = new Date();

  // Set time as UTC
  d.setUTCHours(h, m, 0, 0);

  // Get local time
  const localH = d.getHours();
  const localM = d.getMinutes();

  // Pad with leading zeros
  return `${String(localH).padStart(2, "0")}:${String(localM).padStart(2, "0")}`;
}

function utcToLocal12Hr(timeStr) {
  if (!timeStr) return "";

  const [h, m] = timeStr.split(":").map(Number);

  // Create a fixed UTC date (avoids DST/date surprises)
  const utcDate = new Date(Date.UTC(1970, 0, 1, h, m));

  return utcDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}



  function Row({ p, routineKey, isMany }) {

    // const utcToIso = utcToLocalTime(p.reminder_time)
    const utcToIso = is24Hr ? utcToLocalTime(p.reminder_time) : utcToLocal12Hr(p.reminder_time)
    console.log(utcToIso)

    return (
      <div
        className="flex items-center justify-between py-2"
        style={{
          paddingLeft: 6,
          paddingRight: 6,
        }}
      >
        <div style={{ maxWidth: "72%" }}>
          <div style={{ fontWeight: 800, fontSize: 15 }} className="text-sm md:text-base">
            {p.slot}. {p.name}
          </div>

          {(p.type || p.reminder_time) && (
            <div title={p.type} style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }} className="text-xs md:text-sm">
              {p.type}
              {/* {p.type && p.reminder_time ? " • " : ""} */}
              {p.type && utcToIso ? " • " : ""}
              {/* {p.reminder_time} */}
              {utcToIso}
            </div>
          )}

          {p.desc && (
            <div
              title={p.desc}
              style={{
                fontSize: 13,
                opacity: 0.75,
                marginTop: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              className="text-xs md:text-sm"
            >
              {p.desc.length > 15 ? p.desc.slice(0, 15) + "..." : p.desc}
            </div>
          )}
        </div>

        <button
          onClick={() => onRemove(routineKey, p.id)}
          style={{
            background: "transparent",
            border: "none",
            overflowY: "hidden",
            cursor: "pointer",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
          className={`text-red-400 p-2 md:p-0`}
          aria-label="Remove routine"
          type="button"
        >
          <MdCancel />
        </button>
      </div>
    );
  }

  function Section({ title, keyName }) {
    const list = [...(local[keyName] || [])].sort((a, b) => a.slot - b.slot);
    const isMany = list.length >= 2;

    return (
      <div className="flex flex-col gap-2   flex-1 min-h-0">
        <div className="px-1 font-extrabold text-sm md:text-base">{title}</div>

        <div className="flex-1 overflow-y-auto custom-scrollbar  p-1 min-h-0" style={{ maxHeight: "30vh" }}>
          {list.length === 0 ? (
            <div className="opacity-45 text-sm md:text-base">No routines. Add one using Add Routine.</div>
          ) : (
            list.map((p) => <Row key={p.id} p={p} routineKey={keyName} isMany={isMany} />)
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[15px] shadow-lg p-4  md:p-6 md:max-h-133 h-full flex flex-col ${isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"}`}
      style={{
        minHeight: 0,
        borderRadius: 15,
        boxSizing: "border-box",
      }}
    >
      <h3 className="text-base md:text-lg font-extrabold mb-2">Routines</h3>

      <div className="flex flex-col gap-3 flex-1 min-h-0">
        <Section title="Morning" keyName="morning" />
        <div style={{ height: 1, background: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)", margin: "4px 0" }} />
        <Section title="Afternoon" keyName="afternoon" />
        <div style={{ height: 1, background: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)", margin: "4px 0" }} />
        <Section title="Evening" keyName="evening" />
      </div>
    </div>
  );
}