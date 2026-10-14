import UploadAPIRequest from "./UploadAPIService";

class FileUploadService {
  async uploadFiles(files: File[]) {
    if (files.length == 0) return [];
    const formData = new FormData();

    for (const file of files) {
      formData.append("files", file);
    }

    const response = await UploadAPIRequest.request("files", "POST", formData)
    return response.files;
  }
}

export default new FileUploadService();
