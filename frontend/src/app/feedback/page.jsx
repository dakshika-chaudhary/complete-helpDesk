"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function FeedbackPage() {
  const [role, setRole] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role") || "";
    setRole(userRole);

    if (userRole === "admin") fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/feedbacks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text(); 
        console.error("Failed to fetch feedbacks:", text);
        return;
      }

      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || rating === 0) {
      alert("Please provide rating and comment.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comments: message, rating, ticketId: null }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to submit feedback:", text);
        alert("Failed to submit feedback. Check console.");
        return;
      }

      const data = await res.json();
      setMessage("");
      setRating(0);
      alert("Feedback submitted!");
      if (role === "admin") fetchFeedbacks(); // refresh if admin
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pt-20 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-center ">
        Feedback
      </h1>

      {role !== "admin" && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col border gap-4 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={28}
                className={`cursor-pointer transition-colors ${
                  (hoverRating || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full rounded-xl border  focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            rows={5}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-40 self-end rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}

      {role === "admin" && (
        <div className="flex flex-col gap-6 mt-4">
          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedbacks submitted yet.</p>
          ) : (
            feedbacks.map((f) => (
              <div
                key={f._id}
                className="rounded-2xl border p-4 shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={20}
                      className={`${
                        f.rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="">{f.comments}</p>
                <p className="text-xs  mt-1">
                  From: {f.userName || "Anonymous"} | Ticket: {f.ticketId || "-"} |{" "}
                  {new Date(f.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
