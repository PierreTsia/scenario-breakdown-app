import axios, { AxiosInstance } from "axios";
import { BASE_URL, FIVE_MIN_IN_MS } from "@/constants";
import { plainToClass } from "class-transformer";
import { Project, RestProject } from "@/dtos/Project.dto";

export default class UploadService {
  private readonly token: string;
  private $upload: AxiosInstance;
  constructor() {
    this.token = localStorage.getItem("token") ?? "";
    this.$upload = axios.create({
      baseURL: `${BASE_URL}`,
      timeout: FIVE_MIN_IN_MS,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "multipart/form-data"
      }
    });
  }

  async chapterStatusSubscribe(chapterName: string) {
    const eventSource = new EventSource(
      `${BASE_URL}/projects/sse/${chapterName}`
    );
    console.log(eventSource);
    eventSource.onmessage = ({ data }) => {
      console.log("New message", data);
    };
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
    await this.chapterStatusSubscribe(chapterName!);

    return plainToClass(RestProject, data);
  }
}
