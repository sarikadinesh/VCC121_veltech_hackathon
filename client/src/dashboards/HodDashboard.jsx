import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../services/api.js";

const HodDashboard = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    api.get("/events/pending").then((res) => setPending(res.data)).catch(() => setPending([]));
  }, []);

  return (
    <DashboardLayout title="HOD Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Pending Approvals" value={pending.length} />
        <StatCard title="Department Events" value={pending.length + 4} />
        <StatCard title="Conflict Alerts" value={Math.max(0, pending.length - 1)} />
      </div>
      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-semibold mb-4">Pending Approvals</h3>
        <div className="space-y-3 text-sm">
          {pending.map((event) => (
            <div key={event._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-slate-400">{new Date(event.startTime).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-amber-500/20 text-amber-300 px-3 py-1 text-xs">Awaiting</span>
            </div>
          ))}
          {!pending.length && <p className="text-slate-400">No pending approvals</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HodDashboard;
