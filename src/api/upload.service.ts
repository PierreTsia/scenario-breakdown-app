import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "@/constants";
import { plainToClass } from "class-transformer";
import { Project, RestProject } from "@/dtos/Project.dto";

export default class UploadService {
  private readonly token: string;
  private $upload: AxiosInstance;
  constructor() {
    this.token = localStorage.getItem("token") ?? "";
    this.$upload = axios.create({
      baseURL: `${BASE_URL}`,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "multipart/form-data"
      }
    });
  }

  async upload(
    document: File,
    projectId: string,
    chapterName: string
  ): Promise<Project> {
    const formData = new FormData();
    await formData.append("file", document);
    await formData.append("projectId", projectId);
    await formData.append("chapterName", chapterName);

    const { data } = await this.$upload.post(
      "/projects/chapter/upload",
      formData
    );
    return plainToClass(RestProject, data);
  }
}
