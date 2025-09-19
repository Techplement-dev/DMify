"use client";

import CreateCampaignPage from "../create-campaign/page";
import Header from "../Header";
import ViewCampaignsPage from "../view-campaigns/page";

export default function CreateViewCampaignPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Create Campaign Section */}
        <div className="w-full lg:w-1/2">
          <CreateCampaignPage />
        </div>

        {/* View Campaigns Section */}
        <div className="w-full lg:w-1/2">
            <ViewCampaignsPage />
        </div>
      </div>
    </>
  );
}
