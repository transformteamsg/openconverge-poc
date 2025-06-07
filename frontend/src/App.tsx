import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import appConfig from "./config";
import AuthCallback from "./AuthCallBack";

import LoginView from "./views/LoginView";
import Playground from "./views/Playground";

import { ChainlitAPI } from "@chainlit/react-client";
import { ChainlitContext } from "./hooks/useChainlitContext";
import FileViewer from "./components/FileViewer";
import Layout from "./components/Layout"; // Ensure correct path to Layout

function App() {
  const chainlitApi = new ChainlitAPI(appConfig.CHAINLIT_SERVER_URL, "webapp");
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginView />,
    },
    {
      path: "/login/callback",
      element: <AuthCallback />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "playground",
          element: <Playground />,
        },
        {
          path: "file-viewer",
          element: <FileViewer />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate replace to="/login" />,
    },
  ]);

  return (
    <ChainlitContext.Provider value={{ chainlitApi }}>
      <RouterProvider router={router} />
    </ChainlitContext.Provider>
  );
}

export default App;
