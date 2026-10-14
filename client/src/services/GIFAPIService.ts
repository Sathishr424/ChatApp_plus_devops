import { APIRequest } from "@/interfaces/APIRequest";
import ConfigService from "./ConfigService";

const API_URL = ConfigService.getGIFURL();

class GIFAPIService extends APIRequest {
  constructor() {
    super(API_URL);
  }
}

export default new GIFAPIService();
