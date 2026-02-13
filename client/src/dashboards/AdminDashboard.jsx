import React from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin / ITC Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Resources Managed" value={12} />
        <StatCard title="Maintenance Mode" value={1} />
        <StatCard title="Live Occupancy" value="76%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Resource Inventory</h3>
          <div className="space-y-3 text-sm">
            {[
              { name: "Projector", qty: 4 },
              { name: "Microphone", qty: 10 },
              { name: "Laptops", qty: 6 }
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span>{item.name}</span>
                <span className="text-slate-400">{item.qty} units</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Failure Simulation</h3>
          <p className="text-xs text-slate-400">Simulate resource reductions, venue outages, or time extension impacts.</p>
          <button className="mt-4 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400">
            Run Simulation
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
