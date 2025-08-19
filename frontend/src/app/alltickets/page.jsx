"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [role, setRole] = useState("");

  const fetchTickets = async (pageNum, userRole) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/tickets?page=${pageNum}&role=${userRole}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch tickets");

      const data = await res.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setTickets((prev) => {
          const merged = [...prev, ...data];
          return merged.filter(
            (t, index, self) =>
              index === self.findIndex((x) => x._id === t._id)
          );
        });
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "customer";
    setRole(storedRole);
  }, []);

  useEffect(() => {
    if (role) {
      fetchTickets(page, role);
    }
  }, [page, role]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      if (nearBottom && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }

      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  if (loading && tickets.length === 0)
    return <p className="text-center mt-10">Loading tickets...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-xl tracking-tight">
          {role === "customer" ? "My Tickets" : "All Tickets"}
        </h1>
        {role === "customer" && (
          <Link
            href="/tickets/new"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg transition font-medium"
          >
            + Submit Ticket
          </Link>
        )}
      </div>

      {/* Ticket Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            href={`/tickets/${ticket._id}`}
            className="group block p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Title */}
            <h2 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition">
              {ticket.title}
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm line-clamp-3 mt-2">
              {ticket.description}
            </p>

            {/* Meta Info */}
            <div className="text-xs text-gray-500 space-y-1 mt-4">
              <p>
                <span className="font-semibold text-gray-700">📅 Created:</span>{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold text-gray-700">👤 Customer:</span>{" "}
                {ticket.customerId?.name || "N/A"}
              </p>
              {ticket.agentId && (
                <p>
                  <span className="font-semibold text-gray-700">🎯 Agent:</span>{" "}
                  {ticket.agentId?.name}
                </p>
              )}
            </div>

            {/* Status & Priority */}
            <div className="mt-5 flex justify-between items-center">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  ticket.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : ticket.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {ticket.priority}
              </span>
              <span className="text-xs text-gray-600">{ticket.status}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading / No More */}
      {loading && tickets.length > 0 && (
        <p className="text-center mt-6 text-gray-500">
          Loading more tickets...
        </p>
      )}
      {!hasMore && tickets.length > 0 && (
        <p className="text-center mt-6 text-gray-400">No more tickets.</p>
      )}

      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          ⬆
        </button>
      )}
    </div>
  );
}
