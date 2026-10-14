export {};

declare global {
  interface Window {
    __ENV__: {
      API_URL: string;
      SOCKET_URL: string;
      STORAGE_URL: string;
    };
  }
}
