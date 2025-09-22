"use client";

import { useEffect, useState } from "react";
import Header from "../Header";
import { FiTrash2, FiEdit } from "react-icons/fi"; // icons
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from "react-icons/ai"; // toggle icons

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // For modal editing
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editName, setEditName] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
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

  // Delete campaign
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const res = await fetch("/api/campaigns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setAnalytics((prev) => prev.filter((c) => c.id !== id));
        setStatus("✅ Campaign deleted");
      } else {
        const data = await res.json();
        setStatus("❌ " + (data.error || "Delete failed"));
      }
    } catch (err) {
      setStatus("❌ Failed to delete campaign");
    }
  };

  // Toggle Start/Pause
  const handleToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      const res = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setAnalytics((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
        //setStatus(`✅ Campaign ${newStatus}`);
      }
    } catch (err) {
      setStatus("❌ Failed to update campaign status");
    }
  };

  // Open edit modal
  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setEditName(campaign.campaign_name);
    setEditMessage(campaign.message_template);
    setEditModalOpen(true);
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCampaign.id,
          keyword: editName,
          message: editMessage,
        }),
      });

      if (res.ok) {
        setAnalytics((prev) =>
          prev.map((c) =>
            c.id === editingCampaign.id
              ? { ...c, campaign_name: editName, message_template: editMessage }
              : c
          )
        );
        setStatus("✅ Campaign updated successfully");
        setEditModalOpen(false);
      } else {
        const data = await res.json();
        setStatus("❌ " + (data.error || "Update failed"));
      }
    } catch (err) {
      setStatus("❌ Failed to update campaign");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center pt-20 lg:flex-row gap-6 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="w-full max-w-6xl perspective p-6">
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

            {status && (
              <p className="text-green-400 text-center bg-green-900/40 rounded-lg py-2 mb-4">
                {status}
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
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-800/50 transition duration-300">
                        <td className="p-3 text-gray-200 font-semibold">{c.campaign_name}</td>
                        <td className="p-3 text-gray-400 max-w-[300px] truncate">{c.message_template}</td>
                        <td className="p-3 text-gray-300">{c.totalDMs}</td>
                        <td className="p-3 text-green-400 font-bold">{c.sentDMs}</td>
                        <td className="p-3 text-red-400 font-bold">{c.failedDMs}</td>
                        <td className="p-3 font-semibold text-indigo-300">{c.engagementRate ? `${c.engagementRate}%` : "0%"}</td>
                        <td className="p-3 flex gap-2">
                          {/* Start/Pause Toggle */}
                          <button
                            onClick={() => handleToggle(c.id, c.status || "paused")}
                            className={`p-1 rounded-full ${
                              c.status === "active" ? "bg-yellow-500" : "bg-green-500"
                            }`}
                          >
                            {c.status === "active" ? <AiOutlinePauseCircle size={20} /> : <AiOutlinePlayCircle size={20} />}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <FiEdit size={18} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                          >
                            <FiTrash2 size={18} />
                          </button>
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

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-96 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Edit Campaign</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                placeholder="Campaign Name"
                required
              />
              <textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                placeholder="Message Template"
                rows={4}
                required
              />
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
