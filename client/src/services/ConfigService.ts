class ConfigService {
  getSocketURL(): string {
    return import.meta.env.DEV ? import.meta.env.VITE_SOCKET_URL : "/";
  }

  getStorageURL(): string {
    return import.meta.env.DEV ? import.meta.env.VITE_STORAGE_URL : "/";
  }

  getGIFURL(): string {
    return "https://gifsnap.com/api/v1/gifs/";
  }

  getAPIURL(): string {
    return import.meta.env.DEV ? import.meta.env.VITE_API_URL : "/api";
  }
}

export default new ConfigService();
