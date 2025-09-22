"use client";

import { useEffect, useState } from "react";
import Header from "../Header";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics")
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data);
      } else {
        setError(data.error || "Failed to fetch campaigns");
      }
    } catch (err) {
      setError("Something went wrong while fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    fetchAnalytics();
  }, []);


  return (
    <>
    <Header />
    <div className="flex flex-col justify-center pt-20 lg:flex-row gap-6 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
  <div className="w-full max-w-5xl perspective p-6">
    <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
         Campaign Analytics
      </h2>

      <div className="border-b border-gray-700 mb-6"></div>

      {loading && (
        <p className="text-gray-300 text-center bg-gray-800/50 rounded-lg py-2">
          Loading analytics...
        </p>
      )}

      {error && (
        <p className="text-red-400 text-center bg-red-900/40 rounded-lg py-2">
          {error}
        </p>
      )}

      {!loading && analytics.length === 0 ? (
        <p className="text-gray-400 text-center">
          No campaigns found. Create one first!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gray-800 text-indigo-400 text-left">
                <th className="p-3">Campaign Name</th>
                <th className="p-3">Message</th>
                <th className="p-3">Total DMs</th>
                <th className="p-3">Sent</th>
                <th className="p-3">Failed</th>
                <th className="p-3">Engagement %</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((c) => (
                <tr
                  key={c.campaignId}
                  className="hover:bg-gray-800/50 transition duration-300"
                >
                  <td className="p-3 text-gray-200 font-semibold">
                    {c.campaignName}
                  </td>
                  <td className="p-3 text-gray-400 max-w-[300px] truncate">
                    {c.campaignMessage}
                  </td>
                  <td className="p-3 text-gray-300">{c.totalDMs}</td>
                  <td className="p-3 text-green-400 font-bold">{c.sentDMs}</td>
                  <td className="p-3 text-red-400 font-bold">{c.failedDMs}</td>
                  <td className="p-3 font-semibold text-indigo-300">
                    {c.engagementRate ? `${c.engagementRate}%` : "0%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
</div> 
    </>
     

  );
}
