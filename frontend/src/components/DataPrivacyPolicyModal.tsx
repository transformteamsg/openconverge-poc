import React from 'react';

interface DataPrivacyPolicyModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const DataPrivacyPolicyModal: React.FC<DataPrivacyPolicyModalProps> = ({
  isOpen,
  onAccept,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-2/3 max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mt-2 mb-4 text-gray-800">
          Data Security and Privacy Policy
        </h2>

        <div className="text-gray-600 mb-6">
          <p className="mb-4">
            At the Government Technology Agency, your privacy and data security
            are paramount. This policy outlines how we collect, use, and protect
            your information when using Converge.
          </p>

          <h3 className="font-semibold text-lg mb-2">Data We Collect</h3>

          <h4 className="font-semibold text-md mb-2">
            Document Metadata and Content
          </h4>
          <p className="mb-4">
            Through our SharePoint integration and direct uploads, we collect:
          </p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>
              Document metadata (file names, creation dates, modification dates)
            </li>
            <li>Document content for processing</li>
            <li>Access and permission data</li>
          </ul>
          <p className="mb-4">
            We process this information according to SharePoint's existing
            permission structures and security protocols. Importantly, none of
            this data is used to train AI models.
          </p>

          <h4 className="font-semibold text-md mb-2">
            User Queries and Interactions
          </h4>
          <p className="mb-4">We collect and process:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Your queries and prompts</li>
            <li>System interactions</li>
          </ul>
          <p className="mb-4">
            These are processed through our AI systems and Microsoft Azure
            OpenAI Service to generate responses and retrieve information. We
            maintain strict privacy standards - your queries and interactions
            are never used for AI model training.
          </p>

          <h4 className="font-semibold text-md mb-2">Usage Data</h4>
          <p className="mb-4">We monitor system usage through:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Chat message volumes</li>
            <li>Document access patterns</li>
            <li>Token usage metrics</li>
          </ul>
          <p className="mb-4">
            This data helps us manage system resources and calculate usage for
            billing purposes.
          </p>

          <h4 className="font-semibold text-md mb-2">
            Authentication Information
          </h4>
          <p className="mb-4">We securely process:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Your official government email address</li>
            <li>WOG Azure Active Directory (AAD) credentials</li>
            <li>SharePoint authentication tokens</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2">Use of Cookies</h3>
          <p className="mb-4">We use browser cookies solely for:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Managing your authentication status</li>
            <li>Maintaining secure system access</li>
            <li>Ensuring efficient user authorization</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2">
            Data Processing and Storage
          </h3>
          <p className="mb-4">Our secure processing infrastructure includes:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Vector search and semantic matching technology</li>
            <li>Government-approved secure infrastructure</li>
            <li>SharePoint-aligned access controls</li>
            <li>End-to-end data encryption</li>
            <li>Regular security audits</li>
          </ul>
          <p className="mb-4">
            All processing adheres to government security guidelines for&nbsp;
            <b>Restricted/Sensitive Normal</b> classification.
          </p>

          <h3 className="font-semibold text-lg mb-2">
            Use of Your Information
          </h3>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Deliver precise document search results</li>
            <li>Generate requested content (reports, speeches, etc.)</li>
            <li>Ensure system security</li>
            <li>Enhance user experience</li>
            <li>Maintain government compliance</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2">
            Data Retention and Access
          </h3>
          <p className="mb-4">Our retention practices include:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Maintaining document access logs per government policies</li>
            <li>Storing user interactions for system optimization</li>
            <li>Providing user access to personal usage history</li>
            <li>Following government data retention guidelines</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2">System Security</h3>
          <p className="mb-4">Our comprehensive security framework includes:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>End-to-end encryption</li>
            <li>Integration with government security systems</li>
            <li>Regular security assessments</li>
            <li>Strict access control</li>
            <li>Compliance with government cybersecurity standards</li>
          </ul>

          <h3 className="font-semibold text-lg mb-2">
            Changes to this Privacy Policy
          </h3>
          <p className="mb-4">
            We may update this policy periodically to reflect system
            improvements or regulatory changes. All updates will be posted here,
            and significant changes will be communicated to users.
          </p>

          <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
          <p className="mb-4">
            For questions about this Privacy Policy or our data practices,
            please contact the Converge support team through official government
            channels.
          </p>
        </div>

        <div className="flex justify-center mt-4 border-t pt-4">
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            I accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyPolicyModal;
