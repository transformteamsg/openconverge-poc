import { useChainlitContext } from "@/hooks/useChainlitContext";
import { useAuth } from "@chainlit/react-client";
import { useEffect, useState } from "react";
import { ArchiveBoxArrowDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface File {
  name: string;
  size: number;
  updated_at: string;
  source: string;
}

const FileSources: React.FC = () => {
  const { chainlitApi } = useChainlitContext();
  const { accessToken } = useAuth(chainlitApi);

  const [files, setFiles] = useState<File[]>([]);

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

  const renderFiles = (source: string) => {
    const filteredFiles = files.filter((file) => file.source === source);

    return (
      <div className="flex flex-col space-y-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center px-6"
            >
              <DocumentTextIcon className="h-6 w-6 flex-shrink-0 text-gray-600 mr-1" />
              <p className="text-[14px] truncate text-gray-800 w-full">{file.name}</p>
            </div>
          ))
        ) : (
          <p className="pl-6 text-gray-500">No files available.</p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex mb-8 pl-6 items-center">
          <ArrowUpTrayIcon className="h-6 w-6 text-gray-600 mr-2" />
          <span className="text-[16px] font-semibold text-gray-600">My Uploads</span>
        </div>
        {renderFiles('Converge')}
      </div>

      <div className="flex mt-8 mb-8 pl-6 items-center">
        <ArchiveBoxArrowDownIcon className="h-6 w-6 text-gray-600 mr-2" />
        <span className="text-[16px] font-semibold text-gray-600">Sharepoint</span>
      </div>
      <div className="mb-8">
        {renderFiles('MICROSOFT')}
      </div>
    </>
  );
};

export default FileSources;