"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // to read [campaignId] from URL
import Header from "../Header";

export default function AnalyticsPage() {
  const { campaignId } = useParams(); // URL param: /analytics/[campaignId]
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (campaignId) {
      fetchAnalytics(campaignId);
    }
  }, [campaignId]);

  const fetchAnalytics = async (campaignId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/analytics?campaignId=${campaignId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      console.log("Analytics data:", data);
      if (res.ok) {
        setStats(data);
      } else {
        setError(data.error || "Failed to fetch analytics");
      }
    } catch (err) {
      setError("Something went wrong while fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="w-full max-w-3xl perspective">
          <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center text-indigo-400">
              Analytics
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

            {!loading && stats && (
              <div className="mt-6 text-gray-300 space-y-3">
                <p><strong>Total:</strong> {stats.total}</p>
                <p><strong>Sent:</strong> {stats.sent}</p>
                <p><strong>Failed:</strong> {stats.failed}</p>
                <p><strong>Pending:</strong> {stats.pending}</p>
                <p><strong>Engagement:</strong> {stats.engagement}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
