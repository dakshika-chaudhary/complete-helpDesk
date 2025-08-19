

// "use client";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// //import { Button } from "@/components/ui/button";
// import AnnouncementsPage from "./announcements/page";
// import FAQsPage from "./faqsPage/page";

// export default function Page() {
//   return (
//     <main className="transition-colors duration-500 ">
//       {/* Navbar (includes Dark/Light toggle) */}
//       <Navbar />

//       {/* Hero Section */}
//       <section className="pt-16 pb-18 px-6">
//         <div className="max-w-6xl mx-auto flex flex-col items-center text-center -pt-4">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             Welcome to SocialXN Helpdesk
//           </h2>
//           <p className="text-lg md:text-xl  max-w-2xl mb-8">
//             Manage your tickets, connect with agents, explore FAQs, and stay updated with announcements – all in one place.
//           </p>
//           <div className="flex gap-4">
//            <a
//   href={`/tickets/new`}
//   className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
// >
//   Submit a Ticket
// </a>

// <a
//   href="/knowledge-base"
//   className="inline-block px-4 py-2 border rounded-md h "
// >
//   Browse Knowledge Base
// </a>
//           </div>
//         </div>
//       </section>

//       {/* Announcements Section */}
//       <section className="px-4">
//         <div className="max-w-6xl mx-auto">
//          <AnnouncementsPage />
//         </div>
//       </section>

//       {/* FAQs Section */}
//       <section className="px-4 py-10">
//         <div className="max-w-6xl mx-auto">
//           <FAQsPage />
//         </div>
//       </section>
     
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnnouncementsPage from "./announcements/page";
import FAQsPage from "./faqsPage/page";

export default function Page() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // get role from localStorage if logged in
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <main className="transition-colors duration-500">
      {/* Navbar (includes Dark/Light toggle) */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-18 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center -pt-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to SocialXN Helpdesk
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Manage your tickets, connect with agents, explore FAQs, and stay updated with announcements – all in one place.
          </p>

          <div className="flex gap-4">
            {/* Conditionally render based on role */}
            {role === "agent" || role === "admin" ? (
              <a
                href="/alltickets"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                View All Tickets
              </a>
            ) : (
              <a
                href="/tickets/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Submit a Ticket
              </a>
            )}

            <a
              href="/knowledge-base"
              className="inline-block px-4 py-2 border rounded-md"
            >
              Browse Knowledge Base
            </a>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <AnnouncementsPage />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="px-4 -mt-32 ">
        <div className="max-w-6xl mx-auto">
          <FAQsPage />
        </div>
      </section>
    </main>
  );
}
