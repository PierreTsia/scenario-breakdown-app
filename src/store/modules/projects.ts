import {
  VuexModule,
  Module,
  Action,
  Mutation,
  RegisterOptions
} from "vuex-class-modules";
import apolloClient from "@/api/apollo.client";
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  USER_PROJECTS,
  PROJECT_BY_ID
} from "@/api/index.queries";
import { plainToClass } from "class-transformer";
import store from "@/store/index";
import { Project } from "@/dtos/Project.dto";
import { CreateProjectDto } from "@/dtos/CreateProject.dto";
import UploadService from "@/api/upload.service";
import { ChaptersModule, chaptersModule } from "@/store/modules/chapters";
import { RestChapter } from "@/dtos/Chapter.dto";
const uploadService = new UploadService();

@Module
export class ProjectsModule extends VuexModule {
  projects: Project[] = [];
  project: Project | null = null;
  private chaptersModule: ChaptersModule;

  constructor(chaptersModule: ChaptersModule, options: RegisterOptions) {
    super(options);
    this.chaptersModule = chaptersModule;
  }

  @Mutation
  setProject(project: Project) {
    this.project = project;
  }

  @Mutation
  setProjects(projects: Project[]) {
    this.projects = projects;
  }

  @Mutation
  addProject(project: Project) {
    this.projects.push(project);
  }

  @Mutation
  removeProject(projectId: string) {
    this.projects = this.projects.filter(p => p.id !== projectId);
  }

  @Action
  async uploadFileToProject({
    document,
    projectId,
    fileName
  }: {
    document: File;
    projectId: string;
    fileName: string;
  }) {
    try {
      const updatedProject = await uploadService.upload(
        document,
        projectId,
        fileName
      );
      this.setProject(updatedProject);
      this.chaptersModule.setChapters({
        chapters: updatedProject.chapters.map(c =>
          plainToClass(RestChapter, c, { excludeExtraneousValues: true })
        )
      });
    } catch (e) {
      console.error(e);
    }
  }

  @Action
  async fetchProject({
    projectId,
    includeParagraphs = false
  }: {
    projectId: string;
    includeParagraphs: boolean;
  }) {
    try {
      const { data } = await apolloClient.query({
        query: PROJECT_BY_ID({ includeParagraphs }),
        variables: { projectId }
      });

      const project = plainToClass(Project, data.project, {
        excludeExtraneousValues: true
      });
      this.setProject(project);
      this.chaptersModule.setChapters({ chapters: project.chapters });
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async fetchProjects() {
    try {
      const { data } = await apolloClient.query({ query: USER_PROJECTS });
      const projects = data.projects.map((p: unknown) =>
        plainToClass(Project, p, {
          excludeExtraneousValues: true
        })
      );
      this.setProjects(projects);
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async deleteProject(projectId: string) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: DELETE_PROJECT,
        variables: { projectId }
      });
      if (data.deleteProject === 1) {
        this.removeProject(projectId);
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async createProject(payload: CreateProjectDto) {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_PROJECT,
        variables: payload
      });

      this.addProject(
        plainToClass(Project, data.createProject, {
          excludeExtraneousValues: true
        })
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export const projectsModule = new ProjectsModule(chaptersModule, {
  store,
  name: "projects"
});
