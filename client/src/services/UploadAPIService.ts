import { APIRequest } from "@/interfaces/APIRequest";
import ConfigService from "./ConfigService";

const API_URL = ConfigService.getStorageURL();

class UplaodAPIService extends APIRequest {
  constructor() {
    super(API_URL);
  }
}

export default new UplaodAPIService();
