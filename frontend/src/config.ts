interface AppConfig {
  CHAINLIT_SERVER_URL: string;
}

const appConfig: AppConfig = {
  CHAINLIT_SERVER_URL: import.meta.env.VITE_CHAINLIT_SERVER_URL,
};

export default appConfig;