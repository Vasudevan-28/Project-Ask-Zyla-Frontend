import { useEffect, useRef, useState } from "react";
import { FiClock } from "react-icons/fi";

export default function TimePickerr({
  value,
  onChange,
  ampm = true,
  className = "",
  placeholder = "--:--"
}) {
  const [open, setOpen] = useState(false);

  const ref = useRef();
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const periodRef = useRef(null);

  const hours12 = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const hours24 = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const emitChange = (val) => {
    onChange?.({
      target: {
        value: val
      }
    });
  };

  const parseTime = (val) => {
    if (!val) return { h: "", m: "", p: "AM" };

    val = val.trim().toUpperCase();

    let m12 = val.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/);
    if (m12) {
      let hh = String(m12[1]).padStart(2, "0");
      return { h: hh, m: m12[2], p: m12[3] };
    }

    let m24 = val.match(/^([01]\d|2[0-3]):([0-5]\d)$/);
    if (m24) {
      let H = parseInt(m24[1], 10);
      let p = H >= 12 ? "PM" : "AM";
      let h = H % 12 || 12;
      return {
        h: String(h).padStart(2, "0"),
        m: m24[2],
        p
      };
    }

    return { h: "", m: "", p: "AM" };
  };

  const { h, m, p } = parseTime(value || "");

  useEffect(() => {
    if (!open) return;

    const scrollToValue = (container, value) => {
      if (!container || !value) return;
      const el = container.querySelector(`[data-value="${value}"]`);
      if (el) el.scrollIntoView({ block: "center" });
    };

    scrollToValue(hourRef.current, ampm ? h : (value || "").slice(0, 2));
    scrollToValue(minuteRef.current, m);
    scrollToValue(periodRef.current, p);
  }, [open, h, m, p, value, ampm]);

  const formatTime = (h, m, p) => {
    if (!h || !m) return "";

    if (!ampm) {
      let H = parseInt(h, 10);
      if (p === "PM" && H !== 12) H += 12;
      if (p === "AM" && H === 12) H = 0;
      return `${String(H).padStart(2, "0")}:${m}`;
    } else {
      return `${h}:${m} ${p}`;
    }
  };

  const handleInputChange = (e) => {
    let val = e.target.value.toUpperCase();
    emitChange(val);

    const regex12 = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/;
    const regex24 = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (regex12.test(val) || regex24.test(val) || val === "") {
      emitChange(val);
    }
  };

  const setTime = (hh, mm, pp) => {
    const val = formatTime(hh, mm, pp);
    emitChange(val);
  };

  return (
    <div className="relative" ref={ref}>

      {open && (
        <div className="absolute z-50 bottom-full mb-1 flex gap-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2">

          <div ref={hourRef} className="h-38 w-14 overflow-y-auto">
            {(ampm ? hours12 : hours24).map((hh) => {
              const selected = ampm
                ? hh === h
                : (value || "").startsWith(hh + ":");

              return (
                <div
                  key={hh}
                  data-value={hh}
                  onClick={() =>
                    ampm
                      ? setTime(hh, m || "00", p)
                      : emitChange(`${hh}:${m || "00"}`)
                  }
                  className={`cursor-pointer text-center py-1 rounded ${
                    selected
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {hh}
                </div>
              );
            })}
          </div>

          <div ref={minuteRef} className="h-38 w-14 overflow-y-auto">
            {minutes.map((mm) => {
              const selected = mm === m;
              return (
                <div
                  key={mm}
                  data-value={mm}
                  onClick={() => setTime(h || "12", mm, p)}
                  className={`cursor-pointer text-center py-1 rounded ${
                    selected
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {mm}
                </div>
              );
            })}
          </div>

          {ampm && (
            <div ref={periodRef} className="w-14">
              {periods.map((pp) => {
                const selected = pp === p;
                return (
                  <div
                    key={pp}
                    data-value={pp}
                    onClick={() => setTime(h || "12", m || "00", pp)}
                    className={`cursor-pointer text-center py-1 rounded ${
                      selected
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pp}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <input
          value={value || ""}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={className}
        />

        <div className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          onClick={() => setOpen(!open)}
        >
          <FiClock   />
        </div>
      </div>

     
    </div>
  );
}
