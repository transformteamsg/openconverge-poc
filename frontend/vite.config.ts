import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig(() => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      proxy: isDevelopment
        ? {
            "/auth/oauth/aws-cognito/callback": {
              target: "http://127.0.0.1:8000",
              changeOrigin: true,
            },
          }
        : undefined,
    },
    preview: {
      port: 5173,
      /* Uncomment to test preview in local machine */
      // proxy: {
      //   "/auth/oauth/aws-cognito/callback": {
      //     target: "http://127.0.0.1:8000",
      //     changeOrigin: true,
      //   },
      // }
    }
  };
});
