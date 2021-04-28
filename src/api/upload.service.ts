import axios, { AxiosInstance } from "axios";
import { BASE_URL, FIVE_MIN_IN_MS } from "@/constants";
import { plainToClass } from "class-transformer";
import { Project, RestProject, Status } from "@/dtos/Project.dto";
import { chaptersModule } from "@/store/modules/chapters";

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

  async chapterStatusSubscribe(chapterId: string) {
    const eventSource = new EventSource(
      `${BASE_URL}/projects/chapter/status/${chapterId}`
    );
    eventSource.onmessage = ({ data }) => {
      const parsed = JSON.parse(data);
      const { id, status } = parsed;
      chaptersModule.updateChapterStatus({ chapterId: id, status });
      if (status === Status.Parsed) {
        eventSource.close();
      }
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

    return plainToClass(RestProject, data);
  }
}
