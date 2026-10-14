import { APIRequest } from "@/interfaces/APIRequest";
import ConfigService from "./ConfigService";

const API_URL = ConfigService.getAPIURL();

class APIService extends APIRequest {
  constructor() {
    super(API_URL);
  }
}

export default new APIService();
