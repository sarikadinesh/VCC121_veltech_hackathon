import React, { useState } from "react";
import api from "../services/api.js";

const EventModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "Seminar",
    importance: 3,
    participants: 50,
    startTime: "",
    endTime: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "importance" || name === "participants" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/events", form);
      setForm({
        title: "",
        description: "",
        eventType: "Seminar",
        importance: 3,
        participants: 50,
        startTime: "",
        endTime: ""
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create event");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative glass-panel rounded-2xl p-6 w-full max-w-2xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400">Title</label>
              <input
                name="title"
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Event Type</label>
              <select
                name="eventType"
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                value={form.eventType}
                onChange={handleChange}
              >
                <option>Seminar</option>
                <option>Workshop</option>
                <option>Conference</option>
                <option>Cultural</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Start Time</label>
              <input
                name="startTime"
                type="datetime-local"
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">End Time</label>
              <input
                name="endTime"
                type="datetime-local"
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Participants</label>
              <input
                name="participants"
                type="number"
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                value={form.participants}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400">Importance (1-5)</label>
              <input
                name="importance"
                type="number"
                min="1"
                max="5"
                className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
                value={form.importance}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400">Description</label>
            <textarea
              name="description"
              className="w-full mt-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              value={form.description}
              onChange={handleChange}
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
