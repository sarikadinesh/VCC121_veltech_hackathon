import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import StatCard from "../components/StatCard.jsx";
import ChartCard from "../components/ChartCard.jsx";
import api from "../services/api.js";
import { useLiveUpdates } from "../services/useLiveUpdates.js";

const CoordinatorDashboard = () => {
  const [events, setEvents] = useState([]);
  const { venueUpdates, resourceUpdates } = useLiveUpdates();

  useEffect(() => {
    api.get("/events/my").then((res) => setEvents(res.data)).catch(() => setEvents([]));
  }, []);

  const healthCounts = events.reduce(
    (acc, event) => {
      acc[event.healthScore] = (acc[event.healthScore] || 0) + 1;
      return acc;
    },
    { Green: 0, Yellow: 0, Red: 0 }
  );

  const chartData = [
    { name: "Green", value: healthCounts.Green },
    { name: "Yellow", value: healthCounts.Yellow },
    { name: "Red", value: healthCounts.Red }
  ];

  return (
    <DashboardLayout title="Event Coordinator Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Events" value={events.length} />
        <StatCard title="Pending Approvals" value={events.filter((e) => e.status === "Pending").length} />
        <StatCard title="Risk Alerts" value={events.filter((e) => e.healthScore === "Red").length} />
      </div>

      <ChartCard title="Event Health Score">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Live Venue Occupancy</h3>
          <ul className="text-xs space-y-2 text-slate-300">
            {venueUpdates.map((item, idx) => (
              <li key={idx}>
                Venue {item.venueId} allocated {item.allocatedParticipants} participants
              </li>
            ))}
            {!venueUpdates.length && <li>No live updates</li>}
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Live Resource Updates</h3>
          <ul className="text-xs space-y-2 text-slate-300">
            {resourceUpdates.map((item, idx) => (
              <li key={idx}>
                Resource {item.resourceId} allocated {item.allocatedQuantity}
              </li>
            ))}
            {!resourceUpdates.length && <li>No live updates</li>}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
