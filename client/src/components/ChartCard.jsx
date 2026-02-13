import React from "react";

const ChartCard = ({ title, children }) => {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
};

export default ChartCard;
