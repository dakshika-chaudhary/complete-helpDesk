"use client";

import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/announcements/")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data));
  }, []);

  const typeColors = {
    Urgent: "bg-red-500 text-white",
    Update: "bg-blue-500 text-white",
    Tip: "bg-green-500 text-white",
    Announcement: "bg-yellow-400 text-gray-800",
    General: "bg-gray-200 text-gray-800",
  };

  const typeIcons = {
    Urgent: "⚠️",
    Update: "🔔",
    Tip: "💡",
    Announcement: "📢",
    General: "📝",
  };

  return (
    <div className=" px-6 pt-10 mb-2 min-h-screen">
      <h1 className="text-xl font-bold mb-6 text-center">
        Helpdesk Announcements
      </h1>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No announcements found.
        </p>
      ) : (
        <div className="marquee overflow-x-hidden">
          <div className="marquee__inner flex animate-scroll">
            <div className="marquee__group flex gap-6 ">
              {announcements.map((item) => (
                <div key={item._id} className="announcement-item p-4  rounded shadow w-80">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 mb-2 ${typeColors[item.type]}`}
                  >
                    {typeIcons[item.type]} {item.type}
                  </span>
                  <h2 className="announcement-title font-semibold  text-lg">
                    {item.title}
                  </h2>
                  <p className="announcement-desc  text-sm">
                    {item.description}
                  </p>
                  <span className="announcement-date  text-xs">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="marquee__group flex gap-6">
              {announcements.map((item) => (
                <div key={`dup-${item._id}`} className="announcement-item p-4  rounded shadow w-80">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 mb-2 ${typeColors[item.type]}`}
                  >
                    {typeIcons[item.type]} {item.type}
                  </span>
                  <h2 className="announcement-title font-semibold  text-lg">
                    {item.title}
                  </h2>
                  <p className="announcement-desc  text-sm">
                    {item.description}
                  </p>
                  <span className="announcement-date  text-xs">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

