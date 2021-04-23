import { Action, Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";
import {
  ALL_ENTITIES,
  CREATE_ENTITY,
  PROJECT_ENTITIES
} from "@/api/entities.query";
import apolloClient from "@/api/apollo.client";
import { plainToClass } from "class-transformer";
import { CreateEntityInput, Entity } from "@/dtos/Entity.dto";

@Module
export class EntitiesModule extends VuexModule {
  entities: Entity[] = [];

  @Action
  async createEntity(entityInput: CreateEntityInput) {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_ENTITY,
      variables: { entityInput }
    });
    const entity = plainToClass(Entity, data.createEntity);
    this.addEntity(entity);
  }

  @Action
  async fetchEntities(projectId?: string) {
    const query = projectId
      ? {
          query: PROJECT_ENTITIES,
          variables: { projectId }
        }
      : {
          query: ALL_ENTITIES
        };

    const { data } = await apolloClient.query(query);
    const key = projectId ? "projectEntities" : "userEntities";
    const entities = data[key].map((e: never) => plainToClass(Entity, e));
    this.setEntities(entities);
  }

  @Mutation
  setEntities(entities: Entity[]) {
    this.entities = entities;
  }

  @Mutation
  addEntity(entity: Entity) {
    this.entities = [entity, ...this.entities];
  }
}

export const entitiesModule = new EntitiesModule({ store, name: "entities" });
