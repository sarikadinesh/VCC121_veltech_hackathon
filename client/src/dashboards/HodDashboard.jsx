import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import EventCard from "../components/EventCard.jsx";
import ApprovalModal from "../components/ApprovalModal.jsx";
import api from "../services/api.js";

const HodDashboard = () => {
  const [pending, setPending] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    api.get("/events/pending").then((res) => setPending(res.data)).catch(() => setPending([]));
  };

  const handleApprove = (event) => {
    setSelectedEvent(event);
    setShowApprovalModal(true);
  };

  const handleApprovalSuccess = () => {
    fetchPending();
  };

  return (
    <DashboardLayout title="HOD Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Pending Approvals" value={pending.length} />
        <StatCard title="Department Events" value={pending.length + 4} />
        <StatCard title="Conflict Alerts" value={Math.max(0, pending.length - 1)} />
      </div>
      <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
        <h3 className="text-sm font-semibold mb-4">Pending Approvals</h3>
        <div className="space-y-3">
          {pending.map((event) => (
            <EventCard key={event._id} event={event} role="HOD" onApprove={handleApprove} />
          ))}
          {!pending.length && <p className="text-xs text-slate-400">No pending approvals</p>}
        </div>
      </div>

      <ApprovalModal isOpen={showApprovalModal} onClose={() => setShowApprovalModal(false)} event={selectedEvent} onSuccess={handleApprovalSuccess} />
    </DashboardLayout>
  );
};

export default HodDashboard;
