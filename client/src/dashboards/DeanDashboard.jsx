import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import EventCard from "../components/EventCard.jsx";
import ApprovalModal from "../components/ApprovalModal.jsx";
import api from "../services/api.js";

const utilizationData = [
  { name: "Mon", value: 55 },
  { name: "Tue", value: 62 },
  { name: "Wed", value: 70 },
  { name: "Thu", value: 58 },
  { name: "Fri", value: 73 }
];

const DeanDashboard = () => {
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
    <DashboardLayout title="Dean Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Cross-Dept Conflicts" value={3} />
        <StatCard title="Pending Approvals" value={5} />
        <StatCard title="Priority Overrides" value={1} />
      </div>

      <ChartCard title="Resource Utilization">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={utilizationData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-semibold mb-3">Conflict Matrix</h3>
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-300">
          {["CSE", "ECE", "MECH"].map((dept) => (
            <div key={dept} className="rounded bg-slate-800 px-3 py-2 text-center">
              {dept} vs All: {Math.floor(Math.random() * 5)}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-semibold mb-4">Pending Approvals</h3>
        <div className="space-y-3">
          {pending.map((event) => (
            <EventCard key={event._id} event={event} role="Dean" onApprove={handleApprove} />
          ))}
          {!pending.length && <p className="text-xs text-slate-400">No pending approvals</p>}
        </div>
      </div>

      <ApprovalModal isOpen={showApprovalModal} onClose={() => setShowApprovalModal(false)} event={selectedEvent} onSuccess={handleApprovalSuccess} />
    </DashboardLayout>
  );
};

export default DeanDashboard;
