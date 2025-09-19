"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch campaigns
  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data);
      } else {
        setError(data.error || "Failed to fetch campaigns");
      }
    } catch (err) {
      setError("Something went wrong while fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  // Delete campaign
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const res = await fetch("/api/campaigns", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (res.ok) {
        setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
      } else {
        alert(data.error || "Failed to delete campaign");
      }
    } catch (err) {
      alert("Something went wrong while deleting");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[450px] max-w-3xl perspective">
          <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center text-indigo-400">
              Campaigns
            </h2>
           
            <div className="border-b border-gray-700 mb-6"></div>

            {loading && (
              <p className="text-gray-300 text-center bg-gray-800/50 rounded-lg py-2">
                Loading campaigns...
              </p>
            )}
            {error && (
              <p className="text-red-400 text-center bg-red-900/40 rounded-lg py-2">
                {error}
              </p>
            )}

            {!loading && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-5 bg-gray-800/80 border border-gray-700 rounded-lg shadow-md hover:shadow-indigo-500/40 transform transition duration-300 hover:scale-105 flex justify-between items-start"
                  >
                    <div className="max-w-[75%]">
                      <h3 className="text-xl font-semibold text-indigo-400 break-words">
                        {campaign.campaign_name}
                      </h3>
                      <p className="text-gray-300 mt-2 break-words">
                        {campaign.message_template}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Created at:{" "}
                        {new Date(campaign.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Delete button for md and above */}
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="hidden md:inline-block text-red-500 hover:text-red-700 cursor-pointer font-semibold px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-200"
                      >
                        Delete
                      </button>

                      {/* X icon for mobile only */}
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="md:hidden text-red-500 hover:text-red-700 font-bold text-xl cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <>
                  <p className="text-gray-400 text-center">
                    No campaigns found. Create one first!
                  </p>
                  <div className="flex justify-center items-center mt-6">
                    <button
                      onClick={() => router.push("/create-campaign")}
                      className="w-[250px] py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
                    >
                      Create Campaign
                    </button>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Header from "@/Header";

// export default function ViewCampaignsPage() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   // Fetch campaigns on page load
//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       try {
//         const res = await fetch("/api/campaigns"); // 🔄 Replace with Snehal's backend API later
//         const data = await res.json();

//         if (res.ok) {
//           setCampaigns(data);
//         } else {
//           setError(data.error || "Failed to fetch campaigns");
//         }
//       } catch (err) {
//         setError("Something went wrong while fetching campaigns");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCampaigns();
//   }, []);

//   return (
//     <>
//       <Header />

//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
//         <div className="w-full max-w-3xl perspective">
//           <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
//             <h2 className="text-3xl font-bold mb-6 text-center text-white">
//                 Campaigns
//             </h2>
//             {loading && <p className="text-gray-300 text-center">Loading campaigns...</p>}

//             {/* Error state */}
//             {error && <p className="text-red-400 text-center">{error}</p>}

//             {/* Campaigns List */}
//             {!loading && campaigns.length > 0 ? (
//               <div className="space-y-4">
//                 {campaigns.map((campaign, index) => (
//                   <div
//                     key={index}
//                     className="p-5 bg-gray-800/80 border border-gray-700 rounded-lg shadow-md 
//                                hover:shadow-indigo-500/40 transform transition duration-300 hover:scale-105"
//                   >
//                     <h3 className="text-xl font-semibold text-indigo-400">{campaign.keyword}</h3>
//                     <p className="text-gray-300 mt-2">{campaign.message}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               !loading && (
//                 <>
//                  <p className="text-gray-400 text-center">No campaigns found. Create one first!</p>
//                   <div className="flex justify-center items-center m-7">
//                     <button
//                       onClick={() => router.push("/create-campaign")}
//                       className="w-[250px] items-center py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 
//                       transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
//                     >
//                       Create Campaign
//                     </button>
//                   </div>
//                 </>
//               )
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
