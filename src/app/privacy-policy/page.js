export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-400">Privacy Policy</h1>

        <p className="mb-4">
          Welcome to DMify. We are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible way.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-300">1. Information We Collect</h2>
        <p className="mb-4">
          When you use our service, we collect and store the following information:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Your Instagram user ID and username (to identify you and send messages).</li>
          <li>Comments made on your posts that match keywords from your campaigns.</li>
          <li>Campaign details such as keywords and auto message templates you create.</li>
          <li>Interaction data such as message delivery status.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-300">2. How We Use Your Information</h2>
        <p className="mb-4">
          The information we collect is used solely to provide the automation services you requested:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>To send automated messages (DMs) when a comment matches your campaign’s keyword.</li>
          <li>To prevent duplicate messages and manage interactions effectively.</li>
          <li>To store and retrieve campaign information for your account.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-300">3. Data Sharing and Security</h2>
        <p className="mb-4">
          We do not share your personal data with third parties except where necessary to provide the service or where required by law.
        </p>
        <p className="mb-4">
          We take reasonable steps to protect your data and ensure that access is restricted only to authorized users.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-300">4. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your information by contacting us. We will respond to requests in a timely manner.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-indigo-300">5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@dmify.com" className="text-indigo-400 underline">support@dmify.com</a>.
        </p>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Last updated: September 2025
        </p>
      </div>
    </div>
  );
}
