"use client"; 

import { useState } from "react";
import Header from "../Header";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Initialize supabase client (frontend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreateCampaignPage() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      // Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setStatus("❌ User not logged in");
        return;
      }

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Campaign saved successfully!");
        setKeyword("");
        setMessage("");
        setSaved(true);
      } else {
        setStatus("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error("Error saving campaign:", err);
      setStatus("❌ Failed to save campaign");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="w-full max-w-md perspective">
          <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-6">
            {!saved && (
              <h2 className="text-2xl font-bold mb-6 text-center text-white">
                Create Campaign
              </h2>
            )}
            {saved ? (
              <div className="text-center">
                <p className="text-green-400 font-medium mb-6">{status}</p>
                <Link href="/view-campaigns" className="w-full inline-block py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 cursor-pointer text-white">
                  View Campaigns
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Enter keyword"
                  required
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Enter auto-reply message"
                  rows="4"
                  required
                />
                {status && (
                  <p className={`mt-4 text-center font-medium ${status.startsWith("✅") ? "text-green-400" : status.startsWith("❌") ? "text-red-400" : "text-gray-300"}`}>
                    {status}
                  </p>
                )}
                <button type="submit" className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 cursor-pointer text-white">
                  Save Campaign
                </button>
              </form>
            )}
          </div>
        </div>
      </div>      
    </>
  );
}


// "use client";

// import { useState } from "react";
// import Header from "../Header";
// import Link from "next/link";

// export default function CreateCampaignPage() {
//   const [keyword, setKeyword] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");
//   const [saved, setSaved] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("Saving...");

//     try {
//       const res = await fetch("/api/campaigns", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ keyword, message }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus("✅ Campaign saved successfully!");
//         setKeyword("");
//         setMessage("");
//         setSaved(true);
//       } else {
//         setStatus("❌ " + (data.error || "Something went wrong"));
//       }
//     } catch (err) {
//       setStatus("❌ Failed to save campaign");
//     }
//   };

//   return (
//     <>
//       <Header />
      // <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      //   <div className="w-full max-w-md perspective">
      //     <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-6">
      //       {!saved && (
      //         <h2 className="text-2xl font-bold mb-6 text-center text-white">
      //           Create Campaign
      //         </h2>
      //       )}
      //       {saved ? (
      //         <div className="text-center">
      //           <p className="text-green-400 font-medium mb-6">{status}</p>
      //           <Link href="/view-campaigns" className="w-full inline-block py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 cursor-pointer text-white">
      //             View Campaigns
      //           </Link>
      //         </div>
      //       ) : (
      //         <form onSubmit={handleSubmit} className="space-y-5">
      //           <input
      //             type="text"
      //             value={keyword}
      //             onChange={(e) => setKeyword(e.target.value)}
      //             className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      //             placeholder="Enter keyword"
      //             required
      //           />
      //           <textarea
      //             value={message}
      //             onChange={(e) => setMessage(e.target.value)}
      //             className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      //             placeholder="Enter auto-reply message"
      //             rows="4"
      //             required
      //           />
      //           {status && (
      //             <p className={`mt-4 text-center font-medium ${status.startsWith("✅") ? "text-green-400" : status.startsWith("❌") ? "text-red-400" : "text-gray-300"}`}>
      //               {status}
      //             </p>
      //           )}
      //           <button type="submit" className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 cursor-pointer text-white">
      //             Save Campaign
      //           </button>
      //         </form>
      //       )}
      //     </div>
      //   </div>
      // </div>
//     </>
//   );
// }



// "use client";

// import { useState } from "react";
// import Header from "@/Header";
// import Link from "next/link";

// export default function CreateCampaignPage() {
//   const [keyword, setKeyword] = useState("");
//   const [message, setMessage] = useState("");
//   const [status, setStatus] = useState("");
//   const [saved, setSaved] = useState(false); // Track if campaign saved

//   //  Handles form submission (when user clicks "Save Campaign")
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setStatus("Saving...");

//   try {
//     // ⚠️ Temporary: Calling Next.js mock API to test frontend functionality
//     // ✅ This is just for now to check saving, status updates, and UI response.
//     // 🔄 Later: Replace "/api/campaigns" with Snehal's real backend API URL
//     //      which will handle validation, DB save, and JSON response.
//     const res = await fetch("/api/campaigns", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ keyword, message }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setStatus("Campaign saved successfully!");
//       setKeyword("");
//       setMessage("");
//       setSaved(true); // witch to success state
//     } else {
//       setStatus("❌ " + (data.error || "Something went wrong"));
//     }
//   } catch (err) {
//     setStatus("❌ Failed to save campaign");
//   }
// };


  

//   return (
//     <>
//       <Header />

//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
//         <div className="w-full max-w-md perspective">
//           <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-6">
            
//             {!saved &&  <h2 className="text-2xl font-bold mb-6 text-center text-white">
//               Create Campaign
//             </h2>}
           

//             {/*  Show success message & View button when saved */}
//             {saved ? (
//               <div className="text-center">
//                 <p className="text-green-400 font-medium mb-6">{status}</p>
//                 <Link
//                   href="/view-campaigns"
//                   className="w-full inline-block py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 
//                   transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
//                 >
//                   View Campaigns
//                 </Link>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Keyword Input */}
//                 <div>
//                   <input
//                     type="text"
//                     value={keyword}
//                     onChange={(e) => setKeyword(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 
//                   focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                     placeholder="Enter keyword"
//                     required
//                   />
//                 </div>

//                 {/* Message Input */}
//                 <div>
//                   <textarea
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 
//                   focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                     placeholder="Enter auto-reply message"
//                     rows="4"
//                     required
//                   />
//                 </div>

//                 {/* Status Message */}
//                 {status && (
//                   <p
//                     className={`mt-4 text-center font-medium ${
//                       status.startsWith("✅")
//                         ? "text-green-400"
//                         : status.startsWith("❌")
//                         ? "text-red-400"
//                         : "text-gray-300"
//                     }`}
//                   >
//                     {status}
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 
//                 transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
//                 >
//                   Save Campaign
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
