import React, { useState, useEffect } from "react";
import { useChainlitContext } from "@/hooks/useChainlitContext";
import { useAuth } from "@chainlit/react-client";
import { ArrowUpTrayIcon, LinkIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";

interface File {
  id: string;
  name: string;
  size: number;
  updated_at: string;
  source: string;
}

const formatDate = (dateString: string | null | undefined) => {
  return dateString
    ? dayjs(dateString).format("MMM D, YYYY, h:mm A")
    : "Invalid date";
};

const FileViewer: React.FC = () => {
  const { chainlitApi } = useChainlitContext();
  const { accessToken } = useAuth(chainlitApi);

  const [files, setFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("My Uploads");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      chainlitApi
        .fetch("get", "/api/files", accessToken)
        .then((res) => res.json())
        .then((data) => {
          setFiles(data);
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
        });
    }
  }, [accessToken, chainlitApi]);

  const handleDeleteFile = async (fileId: string) => {
    if (!accessToken) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await chainlitApi.fetch(
        "delete",
        `/api/files/${fileId}`,
        accessToken
      );

      if (!response.ok) {
        const errorData = await response.json();
        setDeleteError(errorData.detail || "Failed to delete file");
        return;
      }

      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
      setDeleteError("An error occurred while deleting the file");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderFiles = (source: string) => {
    const filteredFiles = files.filter((file) => file.source === source);

    return (
      <div className="divide-y divide-gray-200">
        {deleteError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {deleteError}
          </div>
        )}

        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-7 py-4 text-sm text-gray-800"
            >
              <div className="col-span-3 overflow-hidden whitespace-nowrap text-ellipsis break-word">
                {file.name}
              </div>
              <div className="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis break-word">
                {file.source}
              </div>
              <div className="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis break-word">
                {formatDate(file.updated_at)}
              </div>
              <div className="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis break-word">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <div className="col-span-1 overflow-hidden whitespace-nowrap text-ellipsis break-word">
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-7 py-4 text-gray-500">
            No files available.
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="w-[22.5rem] flex flex-col flex-shrink-0 border-r-2 border-gray-300">
        <div className="flex flex-col pt-12 px-8">
          <button
            className={`flex mb-8 ${
              activeTab === "My Uploads" ? "text-gray-600" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("My Uploads")}
          >
            <ArrowUpTrayIcon className="h-6 w-6 mr-2" />
            <span className="text-[16px] font-semibold">My Uploads</span>
          </button>
          <button
            className={`flex ${
              activeTab === "Linked Sources" ? "text-gray-600" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("Linked Sources")}
          >
            <LinkIcon className="h-6 w-6 mr-2" />
            <span className="text-[16px] font-semibold">Linked sources</span>
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col px-12 py-12">
        <div className="mb-6">
          <p className="text-[24px] font-bold text-gray-800">
            {activeTab === "My Uploads" ? "My Uploads" : "Linked Sources"}
          </p>
        </div>

        <div className="flex flex-col overflow-y-auto">
          <div className="grid grid-cols-7 sticky top-0 z-10 pb-3 border-b border-gray-200">
            <div className="col-span-3 text-[16px] whitespace-nowrap font-semibold text-gray-600">
              Name
            </div>
            <div className="col-span-1 text-[16px] whitespace-nowrap font-semibold text-gray-600">
              Sources
            </div>
            <div className="col-span-1 text-[16px] whitespace-nowrap font-semibold text-gray-600">
              Last synced
            </div>
            <div className="col-span-1 text-[16px] whitespace-nowrap font-semibold text-gray-600">
              File size
            </div>
            <div className="col-span-1 text-[16px] whitespace-nowrap font-semibold text-gray-600">
              Actions
            </div>
          </div>
          <div className="overflow-y-auto flex-grow">
            {activeTab === "My Uploads"
              ? renderFiles("Converge")
              : renderFiles("MICROSOFT")}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileViewer;
