import React from "react";

const EventCard = ({ event, role, onApprove, onEdit, onStart, onComplete, onRelease }) => {
  const statusColor = {
    Draft: "bg-slate-700",
    Pending: "bg-amber-700",
    Approved: "bg-emerald-700",
    Rejected: "bg-red-700",
    Completed: "bg-blue-700"
  };

  const healthColor = {
    Green: "bg-emerald-500/20 text-emerald-300",
    Yellow: "bg-amber-500/20 text-amber-300",
    Red: "bg-red-500/20 text-red-300"
  };

  return (
    <div className="rounded-2xl bg-slate-900/80 p-5 border border-slate-800/80 shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">{event.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{new Date(event.startTime).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full text-xs px-2 py-1 ${statusColor[event.status] || statusColor.Draft}`}>
            {event.status}
          </span>
          {event.healthScore && (
            <span className={`rounded-full text-xs px-2 py-1 ${healthColor[event.healthScore]}`}>
              {event.healthScore}
            </span>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 space-y-1 mb-4">
        <p>Participants: {event.participants} | Type: {event.eventType}</p>
        <p>Approval Stage: {event.approvalStage}</p>
        {event.riskFlags?.length > 0 && (
          <p className="text-red-400">⚠️ Risks: {event.riskFlags.join(", ")}</p>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {role === "EventCoordinator" && (
          <>
            {event.status === "Draft" && (
              <>
                <button
                  onClick={() => onEdit?.(event)}
                  className="rounded-lg text-xs bg-slate-800 px-2 py-1 hover:bg-slate-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => onApprove?.(event)}
                  className="rounded-lg text-xs bg-indigo-500 px-2 py-1 hover:bg-indigo-400"
                >
                  Submit
                </button>
              </>
            )}
            {event.status === "Approved" && (
              <button
                onClick={() => onStart?.(event)}
                className="rounded-lg text-xs bg-emerald-500 px-2 py-1 hover:bg-emerald-400"
              >
                Start
              </button>
            )}
            {event.status === "Completed" && (
              <button
                onClick={() => onRelease?.(event)}
                className="rounded-lg text-xs bg-orange-500 px-2 py-1 hover:bg-orange-400"
              >
                Release Resources
              </button>
            )}
          </>
        )}
        {["HOD", "Dean", "InstitutionalHead"].includes(role) && event.status === "Pending" && (
          <button
            onClick={() => onApprove?.(event)}
            className="rounded-lg text-xs bg-indigo-500 px-2 py-1 hover:bg-indigo-400"
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
