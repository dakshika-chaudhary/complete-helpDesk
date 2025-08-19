"use client";

import { useState } from "react";

export default function SubmitTicketPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, priority }),
      });

      if (res.ok) {
        setMessage("✅ Ticket submitted successfully!");
        setTitle("");
        setDescription("");
        setPriority("Low");
      } else {
        setMessage("❌ Failed to submit ticket. Please try again.");
      }
    } catch (error) {
      setMessage("⚠️ Server error. Please check your backend.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <div className="shadow-lg rounded-2xl p-8 w-full max-w-lg border">
        <h1 className="text-2xl font-bold text-center mb-6">
          Submit a Support Ticket
        </h1>

        {message && (
          <p className="text-center mb-4 text-sm font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              placeholder="Describe your issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-400"
            ></textarea>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-blue-400"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
