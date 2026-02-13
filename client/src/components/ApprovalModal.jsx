import React, { useState } from "react";
import api from "../services/api.js";

const ApprovalModal = ({ isOpen, onClose, event, onSuccess }) => {
  const [decision, setDecision] = useState("Approved");
  const [justification, setJustification] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/events/${event._id}/decision`, { decision, justification });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Decision failed");
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative glass-panel rounded-2xl p-6 w-full max-w-lg mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">Review: {event.title}</h2>
        <p className="text-xs text-slate-400 mb-4">{new Date(event.startTime).toLocaleString()}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400">Decision</label>
            <select
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option>Approved</option>
              <option>Rejected</option>
              <option>Returned</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">Justification</label>
            <textarea
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
            >
              Cancel
            </button>
            <button className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">
              Submit Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalModal;
