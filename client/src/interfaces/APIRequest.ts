import JWTService from "@/services/JWTService";
import { formatErrorMessage } from "@/utils/helper";
import { SatToast, ToastType } from "@/utils/SatAlert";
import type { AxiosInstance } from "axios";
import axios from "axios";

export class APIRequest {
  private api: AxiosInstance;
  constructor(API_URL: string) {
    this.api = axios.create({
      baseURL: API_URL,
    });

    this.api.interceptors.response.use(
      response => response,

      error => {
        const message = error.response?.data?.message ?? error.response?.data?.error ?? "Something went wrong";
        SatToast.alert(formatErrorMessage(message), ToastType.ERROR);
        return Promise.reject(error);
      }
    );
  }

  #getAuthHeaders() {
    const token = JWTService.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  #postRequest(url: string, data: unknown) {
    return new Promise((resolve, reject) => {
      this.api.post(`/${url}`, data, {
        headers: this.#getAuthHeaders(),
      }).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e);
      });
    });
  }

  #patchRequest(url: string, data: unknown) {
    return new Promise((resolve, reject) => {
      this.api.patch(`/${url}`, data, {
        headers: this.#getAuthHeaders(),
      }).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e);
      });
    });
  }

  #deleteRequest(url: string) {
    return new Promise((resolve, reject) => {
      this.api.delete(`/${url}`, {
        headers: this.#getAuthHeaders(),
      }).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e);
      });
    });
  }

  #putRequest(url: string, data: unknown) {
    return new Promise((resolve, reject) => {
      this.api.put(`/${url}`, data, {
        headers: this.#getAuthHeaders(),
      }).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e);
      });
    });
  }

  #getRequest(url: string) {
    return new Promise((resolve, reject) => {
      this.api.get(`/${url}`, {
        headers: this.#getAuthHeaders(),
      }).then(res => {
        resolve(res.data);
      }).catch(e => {
        reject(e);
      });
    });
  }

  // eslint-disable-next-line
  request(url: string, method: string, data: unknown): Promise<any> {
    if (method === 'POST') return this.#postRequest(url, data);
    else if (method === 'PATCH') return this.#patchRequest(url, data);
    else if (method === 'DELETE') return this.#deleteRequest(url);
    else if (method === 'GET') return this.#getRequest(url);
    else if (method === 'PUT') return this.#putRequest(url, data);

    throw new Error(`Unsupported HTTP method: ${method}`);
  }
}

