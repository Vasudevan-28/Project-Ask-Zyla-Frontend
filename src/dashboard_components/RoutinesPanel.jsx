import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { MdCancel } from "react-icons/md";
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

  useEffect(() => {
    setLocal({
      morning: routines.morning || [],
      afternoon: routines.afternoon || [],
      evening: routines.evening || [],
    });
    console.log(routines.morning.length)

   

  }, [routines]);

  

  function Row({ p, routineKey, isMany }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 6px",
      }}
    >
      <div style={{ maxWidth: "72%" }}>

        <div style={{ fontWeight: 800, fontSize: 15 }}>
          {p.slot}. {p.name}
        </div>


        {(p.type || p.reminder_time) && (
          <div title={p.type}  style={{ fontSize: 13, opacity: 0.85, marginTop: 3 }}>
            {p.type}
            {p.type && p.reminder_time ? " • " : ""}
            {p.reminder_time}
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
  >
    {p.desc.length > 15
      ? p.desc.slice(0, 15) + "..."
      : p.desc}
  </div>
)}

      </div>

      <button
      className={`text-red-400 ${isMany ? "mr-0" : "mr-3" } `}
        onClick={() => onRemove(routineKey, p.id)}
        style={{
          background: "transparent",
          border: "none",
          // color: isLight ? "rgba(28,13,37,0.95)" : "#ffffff",
          overflowY: "hidden",
          cursor: "pointer",
          fontWeight: 600,
          whiteSpace: "nowrap",
          // marginRight: isMany ? "-18px" : "18px", 
        }}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: "1 1 0",
          minHeight: 0,
        }}
      >
        <div style={{ padding: "0 6px", fontWeight: 800, fontSize: 15 }}>
          {title}
        </div>

        <div
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            padding: "6px",
            minHeight: 0,
          }}
        >
          {list.length === 0 ? (
            <div style={{ opacity: 0.45, fontSize: 14 }}>
              No routines. Add one using Add Routine.
            </div>
          ) : (
            list.map((p) => <Row key={p.id} p={p} routineKey={keyName} isMany={isMany} />)
          )}
        </div>
      </div>
    );
  }

  return (
    <div
    className={` rounded-[15px] shadow-lg p-6 h-full flex flex-col  ${isLight ? "bg-white text-slate-900" : "bg-white/5 text-slate-50"}`}

      style={{
        minHeight: 0,
        borderRadius: 15,
        boxSizing: "border-box",
      }}
    >
      <h3 
      className="text-lg"
      style={{ fontWeight: 800, marginBottom: 12 }}>
        Routines
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: "1 1 auto",
          minHeight: 0,
        }}
      >
        <Section title="Morning" keyName="morning" />
        <div style={{ height: 1, background: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)", margin: "4px 0" }} />
        <Section title="Afternoon" keyName="afternoon" />
        <div style={{ height: 1, background: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)", margin: "4px 0" }} />
        <Section title="Evening" keyName="evening" />
      </div>
    </div>
  );
}
