import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import EventCard from "../components/EventCard.jsx";
import ApprovalModal from "../components/ApprovalModal.jsx";
import api from "../services/api.js";

const fairnessData = [
  { name: "CSE", value: 35 },
  { name: "ECE", value: 25 },
  { name: "MECH", value: 20 },
  { name: "CIVIL", value: 20 }
];

const COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#facc15"];

const HeadDashboard = () => {
  const [pending, setPending] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    api.get("/events/pending").then((res) => setPending(res.data)).catch(() => setPending([]));
  }, []);

  const handleApprove = (event) => {
    setSelectedEvent(event);
    setShowApprovalModal(true);
  };

  const handleApprovalSuccess = () => {
    api.get("/events/pending").then((res) => setPending(res.data));
  };
  return (
    <DashboardLayout title="Institutional Head Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Live Events" value={6} />
        <StatCard title="Occupancy" value="84%" />
        <StatCard title="Global Conflicts" value={2} />
      </div>

      <ChartCard title="Fairness Analytics">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={fairnessData} dataKey="value" nameKey="name" outerRadius={90}>
              {fairnessData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-semibold mb-3">Occupancy Heatmap</h3>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 18 }).map((_, idx) => (
            <div key={idx} className="h-6 rounded bg-slate-800"></div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-semibold mb-4">Pending Final Approvals</h3>
        <div className="space-y-3">
          {pending.map((event) => (
            <EventCard key={event._id} event={event} role="InstitutionalHead" onApprove={handleApprove} />
          ))}
          {!pending.length && <p className="text-xs text-slate-400">No pending approvals</p>}
        </div>
      </div>

      <ApprovalModal isOpen={showApprovalModal} onClose={() => setShowApprovalModal(false)} event={selectedEvent} onSuccess={handleApprovalSuccess} />
    </DashboardLayout>
  );
};

export default HeadDashboard;
