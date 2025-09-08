"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/Header";

export default function ViewCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch campaigns on page load
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns"); // 🔄 Replace with Snehal's backend API later
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

    fetchCampaigns();
  }, []);

  return (
    <>
      <Header />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="w-full max-w-3xl perspective">
          <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">
                Campaigns
            </h2>
            {loading && <p className="text-gray-300 text-center">Loading campaigns...</p>}

            {/* Error state */}
            {error && <p className="text-red-400 text-center">{error}</p>}

            {/* Campaigns List */}
            {!loading && campaigns.length > 0 ? (
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gray-800/80 border border-gray-700 rounded-lg shadow-md 
                               hover:shadow-indigo-500/40 transform transition duration-300 hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-indigo-400">{campaign.keyword}</h3>
                    <p className="text-gray-300 mt-2">{campaign.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <>
                 <p className="text-gray-400 text-center">No campaigns found. Create one first!</p>
                  <div className="flex justify-center items-center m-7">
                    <button
                      onClick={() => router.push("/create-campaign")}
                      className="w-[250px] items-center py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 
                      transition-all duration-300 transform hover:scale-105 cursor-pointer text-white"
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
