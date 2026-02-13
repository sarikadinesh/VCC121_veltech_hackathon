import React from "react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-lg font-semibold">Access denied</h1>
        <p className="text-sm text-slate-400">You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
