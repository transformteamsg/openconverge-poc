import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@chainlit/react-client";
import { useChainlitContext } from "@/hooks/useChainlitContext";
import AuthLogin from "@/components/AuthLogin";

const LoginView: React.FC = () => {
  const navigate = useNavigate();

  const { chainlitApi } = useChainlitContext();
  const { data: config, user } = useAuth(chainlitApi);

  useEffect(() => {
    if (user) {
      navigate("/playground");
    }
  }, [navigate, user]);

  if (user) {
    return;
  }

  return (
    <div className="container">
      <div className="flex justify-center m-32">
        <div className="flex flex-col self-center items-center border-2 rounded-lg border-gray-300 p-16">
          <span className="text-3xl font-bold mb-8">Converge</span>
          <AuthLogin providers={config?.oauthProviders || []} />
        </div>
      </div>
    </div>
  );
};

export default LoginView;
