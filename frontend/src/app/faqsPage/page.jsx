// "use client";

// import { useEffect, useState } from "react";

// export default function FAQsPage() {
//   const [faqs, setFaqs] = useState([]);
//   const [openIndex, setOpenIndex] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/faqs")
//       .then((res) => res.json())
//       .then((data) => setFaqs(data));
//   }, []);

//   const toggleFaq = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-green dark:bg-gray-800">
//       <h1 className="text-xl font-medium mb-8 text-center text-gray-800 dark:text-gray-200">
//         Frequently Asked Questions
//       </h1>
//       <div className="space-y-3">
//         {faqs.map((faq, index) => (
//           <div
//             key={faq._id}
//             className="border border-gray-200 rounded-lg bg-gray-50 p-4 shadow-sm hover:shadow-md transition"
//           >
//             <button
//               className="w-full flex justify-between items-center text-left focus:outline-none"
//               onClick={() => toggleFaq(index)}
//             >
//               <span className="text-gray-800 text-base font-medium">
//                 {faq.question}
//               </span>
//               <span
//                 className={`transform transition-transform duration-300 text-gray-500 ${
//                   openIndex === index ? "rotate-180" : "rotate-0"
//                 }`}
//               >
//                 ⬇️
//               </span>
//             </button>
//             {openIndex === index && (
//               <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/faqs")
      .then((res) => res.json())
      .then((data) => setFaqs(data));
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-2xl mx-auto -mt-10 rounded-xl shadow-sm">
      <h1 className="text-xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h1>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq._id}
            className="border  rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <button
              className="w-full flex justify-between items-center text-left focus:outline-none"
              onClick={() => toggleFaq(index)}
            >
              <span className=" text-base font-medium">
                {faq.question}
              </span>
              <span
                className={`transform transition-transform duration-300  text-gray-500 dark:text-gray-400 ${
                  openIndex === index ? "rotate-180" : "rotate-0"
                }`}
              >
                ⬇️
              </span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
