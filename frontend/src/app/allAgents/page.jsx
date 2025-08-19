"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AgentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("tickets");

  const [agents, setAgents] = useState([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role") || "";
        setRole(userRole);

        if (!token) return;

        const res = await fetch("http://localhost:5000/api/agents", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch agents:", e);
      }
    };

    loadAgents();
  }, []);

  const handleReassign = async (agentId) => {
    if (!ticketId) {
      alert("No ticket selected for reassignment!");
      return;
    }
    if (role !== "admin") {
      alert("Only admins can assign agents!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tickets/${ticketId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agentId }),
      });
      router.push(`/tickets/${ticketId}`);
    } catch (e) {
      console.error("Error reassigning agent:", e);
    }
  };

  const filteredAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter(
      (a) =>
        !q ||
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q)
    );
  }, [agents, query]);

  const initials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="mx-auto max-w-6xl p-6 pt-6 pb-20">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight ">
            Assign an Agent
          </h1>
          {ticketId ? (
            <p className="text-sm text-gray-500">Ticket ID: {ticketId}</p>
          ) : (
            <p className="text-sm text-amber-600">
              No ticketId in URL. Go back and select a ticket.
            </p>
          )}
        </div>
        {ticketId && (
          <button
            onClick={() => router.push(`/tickets/${ticketId}`)}
            className="rounded-xl border  px-4 py-2 text-sm font-medium  shadow-sm transition"
          >
            ← Back to Ticket
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full rounded-2xl border  px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={() => setQuery("")}
          className="w-full rounded-2xl border  px-4 py-2 text-sm text-white font-medium bg-blue-500"
        >
          Reset search
        </button>
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 ? (
        <div className="rounded-2xl border  p-8 text-center shadow-sm">
          <p className="">No agents match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <div
              key={agent._id}
              className="group rounded-2xl border  p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full  text-sm font-bold text-blue-700">
                  {initials(agent.name)}
                </div>
                <div>
                  <h2 className="text-base font-semibold ">
                    {agent.name}
                  </h2>
                  <p className="text-xs">{agent.email}</p>
                </div>
              </div>

              {agent.phone && (
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="">Phone</span>
                  <span className="">{agent.phone}</span>
                </div>
              )}

              {/* Show assign button only for admins */}
              {role === "admin" && (
                <button
                  onClick={() => handleReassign(agent._id)}
                  className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold  shadow-sm transition hover:bg-blue-700"
                >
                  Assign this Agent
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
