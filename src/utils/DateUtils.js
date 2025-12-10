// DateUtils.js
// Helper functions for parsing/formatting and comparisons
export function toISODate(date){
  if(!date) return null;
  if(typeof date === "string") return date;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

export function fromDDMMYYYY(str){
  if(!str) return null;
  const parts = str.split("/");
  if(parts.length !== 3) return null;
  const d = parseInt(parts[0],10);
  const m = parseInt(parts[1],10);
  const y = parseInt(parts[2],10);
  if(Number.isNaN(d)||Number.isNaN(m)||Number.isNaN(y)) return null;
  const dt = new Date(y, m-1, d);
  if(dt.getFullYear() !== y || dt.getMonth() !== m-1 || dt.getDate() !== d) return null;
  return dt;
}

export function fromISOToDDMMYYYY(iso){
  if(!iso) return "";
  const dt = new Date(iso);
  const d = String(dt.getDate()).padStart(2,'0');
  const m = String(dt.getMonth()+1).padStart(2,'0');
  const y = dt.getFullYear();
  return `${d}/${m}/${y}`;
}

export function todayISO(){
  return toISODate(new Date());
}

export function isBeforeISO(aIso, bIso){
  return new Date(aIso) < new Date(bIso);
}

export function isSameISO(aIso, bIso){
  return toISODate(new Date(aIso)) === toISODate(new Date(bIso));
}
