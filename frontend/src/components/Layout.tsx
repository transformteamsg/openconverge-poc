import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth, useChatSession } from "@chainlit/react-client";
import { useChainlitContext } from "@/hooks/useChainlitContext";
import Navbar from "./NavBar";
import DataPrivacyPolicyModal from "./DataPrivacyPolicyModal";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { chainlitApi } = useChainlitContext();
  const { user, accessToken, logout } = useAuth(chainlitApi);
  const { connect, session } = useChatSession();
  const [showPrivacyModal, setShowPrivacyModal] = useState(
    () => !localStorage.getItem("privacyPolicyAccepted")
  );

  // Check for authentication
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [navigate, user]);

  // Establish websocket connection for chatbox
  useEffect(() => {
    if (session?.socket.connected) {
      return;
    }

    connect({
      client: chainlitApi,
      userEnv: {},
      accessToken: accessToken,
    });
  }, []);

  if (user === null) {
    return null;
  }

  const handleAccept = useCallback(() => {
    localStorage.setItem("privacyPolicyAccepted", "true");
    setShowPrivacyModal(false);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        user={user}
        logout={logout}
        showPrivacyPolicy={() => setShowPrivacyModal(true)}
      />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <Outlet />
      </div>
      <DataPrivacyPolicyModal
        isOpen={showPrivacyModal}
        onAccept={handleAccept}
      />
    </div>
  );
};

export default Layout;
