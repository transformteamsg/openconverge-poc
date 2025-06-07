import { useChainlitContext } from "@/hooks/useChainlitContext";
import { useAuth } from "@chainlit/react-client";
import React, { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface FileItem {
  file: File;
  isProcessing: boolean;
  isUploaded: boolean;
  hasError: boolean;
}

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes

const FileUploader: React.FC = () => {
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { chainlitApi } = useChainlitContext();
  const { accessToken } = useAuth(chainlitApi);

  const processFileItem = async (fileItem: FileItem) => {
    setFileItems((currentFileItems) => [...currentFileItems, fileItem]);
    const success = await uploadFile(fileItem.file);

    setFileItems((currentFileItems) => {
      return currentFileItems.map((fi) => {
        if (fi.file === fileItem.file) {
          return {
            ...fileItem,
            isProcessing: false,
            isUploaded: success,
            hasError: !success,
          };
        }
        return fi;
      });
    });
  };

  const uploadFile = async (uploadFile: File) => {
    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await chainlitApi.post(
        "/api/files",
        formData,
        accessToken
      );

      if (response.status == 201) {
        return true;
      } else {
        throw new Error(
          `Failed to upload file! response status: ${response.status}`
        );
      }
    } catch (error) {
      return false;
    }
  };

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage("File size exceeds 30MB limit.");
        return;
      }

      setErrorMessage(null);

      const newFileItem: FileItem = {
        file,
        isProcessing: true,
        isUploaded: false,
        hasError: false,
      };

      processFileItem(newFileItem);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {errorMessage && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-red-700 rounded-lg border border-red-300 bg-red-50"
          role="alert"
        >
          <div className="flex">
            <ExclamationCircleIcon className="h-6 w-9 mr-2" />
            <span className="text-[14px] text-gray-500">
              File size exceeds 30 MB limit. Please upload a smaller file.
            </span>
          </div>
        </div>
      )}
      <input
        type="file"
        id="file-upload-input"
        hidden
        onChange={handleAddFile}
      />
      <label
        htmlFor="file-upload-input"
        className="w-full py-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-300 text-center mb-2"
      >
        Upload file
      </label>
      <div className="leading-4 text-[12px] text-gray-500 text-center">
        By continuing, you confirm your file is up to<br></br>{" "}
        <span className="font-semibold">Restricted / Sensitive Normal</span>{" "}
        classification. Types: pdf, docx, xlsx, pptx and txt
      </div>

      {fileItems.length > 0 && (
        <div className="w-full mt-4">
          {fileItems.map((fileItem, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-10 w-10 text-white bg-indigo-500 rounded-full p-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4 flex-1 overflow-x-auto">
                <div className="whitespace-nowrap">
                  <p className="font-bold text-gray-700 text-ellipsis">
                    {fileItem.file.name}
                  </p>
                  <p className="text-gray-500">
                    {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {fileItem.isProcessing && (
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-500"
                    viewBox="0 0 100 101"
                    fill="none"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}

                {fileItem.isUploaded && !fileItem.hasError && (
                  <svg
                    className="w-10 h-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}

                {fileItem.hasError && (
                  <svg
                    className="w-10 h-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
