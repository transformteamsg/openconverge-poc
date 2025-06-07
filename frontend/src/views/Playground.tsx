import { useEffect, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import {
  useChatInteract,
  useChatMessages,
  IStep,
} from "@chainlit/react-client";

import FileUploader from "@/components/FileUploader";
import FileSources from "@/components/FileSources";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ReadmeModal from "@/components/ReadmeModal.tsx";
import {
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
  PencilIcon
} from "@heroicons/react/24/outline";

const Playground: React.FC = () => {
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);

  const chatScrollPin = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    chatScrollPin.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (content) {
      const message: IStep = {
        id: uuidv4(),
        name: "User",
        type: "user_message",
        output: content,
        createdAt: new Date().toISOString(),
      };
      setLoading(true);
      sendMessage(message, []);
      setInputValue("");
      scrollToBottom();
    }
  };

  const renderMessage = (message: IStep) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(message.createdAt).toLocaleTimeString(
      undefined,
      dateOptions
    );
    return (
      <div key={message.id} className="flex items-start space-x-4">
        <div className="w-20 text-sm text-indigo-500">{message.name}</div>
        <div className="flex-1 border-solid border-2 border-gray-200 rounded-lg p-4">
          <MarkdownRenderer content={message.output} />
          <small className="text-xs text-gray-500">{date}</small>
        </div>
      </div>
    );
  };

    // Scroll to the latest chat message in the chatbox
  useEffect(() => {
    scrollToBottom();
    if (loading && messages.length > 0 && messages[messages.length - 1].type !== "user_message") {
      setLoading(false); // Stop loading when a new message is received
    }
  }, [messages, loading]);

  return (
    <>
      <div className="w-[22.5rem] flex flex-col flex-shrink-0 border-r-2 border-gray-300">
        <div className="flex flex-col px-6 pt-6 mb-8 border-gray-300">
          <span className="text-[24px] font-bold">Ask Converge</span>
          <span className="text-[14px] mb-8 text-gray-500">
            Search from your uploads and sources
          </span>

          <div className="flex flex-col">
            <FileUploader />
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto">
          <FileSources />
        </div>
      </div>

      <div className="flex flex-col overflow-hidden w-full">
        {messages.length === 0 && (
          <div className="flex flex-grow items-center justify-center overflow-y-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="relative p-5 rounded-full bg-indigo-100">
                <MagnifyingGlassIcon className="size-10 text-indigo-600"/>
              </div>

              <div className="text-2xl font-bold text-indigo-500">
                How can Converge help you today?
              </div>

              <div className="space-y-2">
                <div className="flex items-start">
                  <DocumentMagnifyingGlassIcon className="size-5 text-indigo-600 mr-2"/>
                  <span className="text-gray-500 text-sm">Search across files and answer questions</span>
                </div>
                <div className="flex items-start">
                  <PencilIcon className="size-5 text-indigo-600 mr-2"/>
                  <span className="text-gray-500 text-sm">Draft speeches from outlines, minutes, and more</span>
                </div>
                <div className="flex items-start">
                  <ClockIcon className="size-5 text-indigo-600 mr-2"/>
                  <span className="text-gray-500 text-sm">Search emails and calendars to schedule meetings</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
            <div className="flex flex-col flex-grow overflow-auto">
              <div className="p-8 space-y-4">
                {messages.map((message) => renderMessage(message))}
                {loading && (
                    <div className="flex justify-center items-center">
                      <svg
                          className="animate-spin h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                      >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                )}
                <div ref={chatScrollPin}/>
              </div>
            </div>
        )}

        <div className="p-4">
          <div className="flex items-center">
            <input
              className="flex-grow py-2 px-4 border-solid border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              id="message-input"
              placeholder="Ask Converge a question"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="py-2 px-4 ml-2 rounded-md bg-indigo-500 hover:bg-indigo-800 text-white"
              type="submit"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 left-4 z-10">
        <button
            onClick={() => setIsReadmeModalOpen(true)}
            className="bg-gray-100 text-gray-600 font-bold p-2 rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.66675 4.02317C8.22885 2.65634 10.7615 2.65634 12.3236 4.02317C13.8857 5.39001 13.8857 7.60609 12.3236 8.97292C12.0517 9.21082 11.7504 9.40731 11.43 9.5624C10.4357 10.0436 9.49518 10.8935 9.49518 11.998V12.998M9.49487 16.998H9.50487V17.008H9.49487V16.998Z"
                stroke="#4A5054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <ReadmeModal isOpen={isReadmeModalOpen} onClose={() => setIsReadmeModalOpen(false)}/>
    </>
  );
};

export default Playground;
