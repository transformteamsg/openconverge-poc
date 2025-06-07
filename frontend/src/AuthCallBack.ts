import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@chainlit/react-client";
import { useChainlitContext } from "./hooks/useChainlitContext";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const query = useQuery();

  const { chainlitApi } = useChainlitContext();
  const { user, setAccessToken } = useAuth(chainlitApi);

  const assignToken = useCallback(() => {
    const token = query.get("access_token");
    setAccessToken(token);
  }, [query, setAccessToken]);

  // TODO: Resolve recursive dependencies issue
  // Set access token to auth
  useEffect(() => {
    assignToken();
  }, []);

  // Check for authentication
  useEffect(() => {
    if (user) {
      navigate("/playground");
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  return null;
}
