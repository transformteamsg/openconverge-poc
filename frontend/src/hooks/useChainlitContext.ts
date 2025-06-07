// Import necessary dependencies
import { createContext, useContext } from "react";

import { ChainlitAPI } from "@chainlit/react-client";

interface ChainlitContextType {
  chainlitApi: ChainlitAPI;
}

const ChainlitContext = createContext<ChainlitContextType | null>(null);

const useChainlitContext = () => {
  const context = useContext(ChainlitContext);

  if (!context) {
    throw new Error(
      "useChainlitContext has to be used within <ChainlitContext.Provider>"
    );
  }

  return context;
};

export { ChainlitContext, useChainlitContext };
