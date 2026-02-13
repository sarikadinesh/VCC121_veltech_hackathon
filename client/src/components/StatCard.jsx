import React from "react";

const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 border border-slate-800/80 shadow-lg">
      <p className="text-xs uppercase text-slate-400 tracking-[0.2em]">{title}</p>
      <p className="text-3xl font-semibold mt-3 text-slate-100">{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
