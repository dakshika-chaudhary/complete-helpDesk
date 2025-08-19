"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function TicketDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [assignAgentId, setAssignAgentId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [agents, setAgents] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchTicket();
    const role = localStorage.getItem("role");
    if (role) setUserRole(role);
    if (role === "admin") {
      fetchAgents();
    }
  }, [id]);

  async function fetchAgents() {
    try {
      const res = await fetch("http://localhost:5000/api/agents", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) setAgents(data);
    } catch (err) {
      console.error("Error fetching agents", err);
    }
  }

  async function fetchTicket() {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data);
        setEditTitle(data.title);
        setEditDescription(data.description);
        setStatus(data.status);
      } else {
        alert(data.message || "Failed to load ticket");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading ticket");
    } finally {
      setLoading(false);
    }
  }
  
  async function updateTicket(payload) {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(data);
      } else {
        alert(data.message || "Failed to update ticket");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating ticket");
    }
  }

  async function handleComment() {
    if (!comment.trim()) return;
    await updateTicket({ action: "comment", message: comment });
    setComment("");
  }

  async function handleEdit() {
    await updateTicket({
      action: "edit",
      title: editTitle,
      description: editDescription,
    });
    setEditMode(false);
  }

  async function handleStatusChange() {
    await updateTicket({ status });
  }

  async function handleAssignAgent() {
    await updateTicket({ agentId: assignAgentId });
  }

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>Ticket not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6  border shadow-lg rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        {editMode ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border px-3 py-1 rounded w-full mr-2"
          />
        ) : (
          <h1 className="text-2xl font-bold ">{ticket.title}</h1>
        )}

        {userRole === "customer" && !editMode && ticket.status !== "Resolved" && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-500 hover:bg-yellow-600  px-3 py-1 rounded-md"
          >
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="border rounded w-full p-2 mb-2"
        />
      ) : (
        <p className="">{ticket.description}</p>
      )}

      {editMode && (
        <button
          onClick={handleEdit}
          className="bg-green-500 hover:bg-green-600  px-3 py-1 rounded-md"
        >
          Save
        </button>
      )}

      <div className=" p-3 rounded-md">
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <p>
          <strong>Priority:</strong> {ticket.priority}
        </p>

        {userRole === "agent" && (
          <div className="mt-2 flex items-center space-x-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <button
              onClick={handleStatusChange}
              className="bg-blue-500 hover:bg-blue-600  px-3 py-1 rounded-md"
            >
              Update
            </button>
          </div>
        )}
      </div>

      <div className=" p-3 rounded-md">
        <p>
          <strong>Assigned Agent:</strong>{" "}
          {ticket.agentId ? ticket.agentId.name : "Not Assigned"}
        </p>

        {userRole === "admin" && (
          <div className="mt-2">
            <button
              onClick={() => router.push(`/allAgents?tickets=${ticket._id}`)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md"
            >
              Reassign Agent
            </button>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Comments</h2>
        <div className="space-y-3">
          {ticket.comments.map((c) => (
            <div
              key={c._id}
              className="border-b pb-2  flex flex-col"
            >
              <span className="font-semibold">
                🧑‍💼 {c.authorId?.name || "Unknown"}
              </span>
              <span>{c.message}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="border px-2 py-1 rounded w-full mr-2"
          />
          <button
            onClick={handleComment}
            className=" px-3 py-1 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
