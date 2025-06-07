import React from "react";
import { useChainlitContext } from "../hooks/useChainlitContext";

type AuthLoginProps = {
  providers: string[];
};

const AuthLogin: React.FC<AuthLoginProps> = ({ providers }) => {
  const { chainlitApi } = useChainlitContext();

  return providers.map((provider, index) => {
    return (
      <div key={index}>
        <button
          className="py-2 px-4 rounded-md bg-indigo-500 hover:bg-indigo-800 text-white"
          onClick={() => {
            window.location.href = chainlitApi.getOAuthEndpoint(provider);
          }}
        >
          Login with Cognito
        </button>
      </div>
    );
  });
};

export default AuthLogin;
