import React from 'react';
import {XMarkIcon} from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadmeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 leading-5 text-sm relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <XMarkIcon className="size-5 text-gray-600"/>
        </button>
        <h2 className="text-xl font-bold mt-2 mb-2 text-gray-800">Welcome to Converge!</h2>

        <p className="mb-2 text-gray-600">Converge is your personal knowledge and information management tool.</p>

        <div className="pt-3 text-gray-600">
          <div className="mb-5">
            <p className="mb-2">What Converge can do for you:</p>

            <ol className="list-decimal list-inside space-y-2">
              <li className="[ol_&]:marker:font-bold"><strong>Search and synthesise information</strong>
                <ul className="list-disc space-y-2 ml-10 mt-2">
                  <li>Look through specific files or search across all your uploads and sources (e.g. SharePoint).</li>
                  <li>Get answers to your questions based on the content of your files, complete with sources.</li>
                  <li>No limit on the number of files Converge can handle—just your SharePoint memory limit.</li>
                </ul>
              </li>

              <li className="[ol_&]:marker:font-bold"><strong>Draft speeches and press releases</strong>
                <ul className="list-disc space-y-2 ml-10 mt-2">
                  <li>Upload excerpts, outlines, or related documents like minutes and emails.</li>
                  <li>Get 75%-ready drafts, complete with references.</li>
                  <li>Tip: Add speechwriting guidelines for better results.</li>
                </ul>
              </li>

              <li className="[ol_&]:marker:font-bold"><strong>Find details to schedule meetings (Coming soon)</strong>
                <ul className="list-disc space-y-2 ml-10 mt-2">
                  <li>Connects to your email and calendar (e.g. Outlook)</li>
                  <li>Retrieves details to help you schedule meetings.</li>
                </ul>
              </li>
            </ol>
          </div>

          <p className="text-sm">Check out <a href="#" className="text-indigo-500 underline">our tutorial</a>, where we
            guide you through examples.</p>
        </div>

      </div>
    </div>
  );
};

export default ReadmeModal;
