import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "../components/DashboardLayout.jsx";
import ChartCard from "../components/ChartCard.jsx";
import api from "../services/api.js";

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState({ peakHours: [] });

  useEffect(() => {
    api.get("/analytics/summary").then((res) => setSummary(res.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout title="Analytics Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Peak Booking Hours">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.peakHours || []}>
              <XAxis dataKey="_id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold mb-3">Highlights</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Most used venue: {summary.mostUsedVenue || "N/A"}</p>
            <p>Most requested equipment: {summary.mostRequestedEquipment || "N/A"}</p>
            <p>Resource utilization trends: Coming soon</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
