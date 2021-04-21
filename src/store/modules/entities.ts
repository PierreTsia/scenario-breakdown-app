import { Module, Mutation, VuexModule, Action } from "vuex-class-modules";
import store from "@/store/index";
import { CREATE_ENTITY } from "@/api/entities.query";
import apolloClient from "@/api/apollo.client";
import {
  IsHexColor,
  IsNotEmpty,
  validate,
  ValidationError
} from "class-validator";

export class CreateEntityInput {
  @IsNotEmpty()
  label!: string;
  @IsHexColor()
  color!: string;

  async errors(): Promise<ValidationError[]> {
    return await validate(this);
  }

  async isValid() {
    const errors = await this.errors();
    return !errors?.length;
  }
}

@Module
export class Entities extends VuexModule {
  entities = [];

  @Action
  async createEntity(entityInput: CreateEntityInput) {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_ENTITY,
      variables: { entityInput }
    });
    console.log(data);
  }

  @Mutation
  setEntities(entities: never[]) {
    this.entities = entities;
  }
}

export const entitiesModule = new Entities({ store, name: "entities" });
