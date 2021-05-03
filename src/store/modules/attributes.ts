import { Action, Module, Mutation, VuexModule } from "vuex-class-modules";
import store from "@/store/index";

import apolloClient from "@/api/apollo.client";
import { plainToClass } from "class-transformer";
import { Attribute } from "@/dtos/Attribute.dto";
import { PROJECT_ATTRIBUTES } from "@/api/index.queries";

@Module
export class AttributesModule extends VuexModule {
  attributes: Attribute[] = [];

  @Action
  async fetchAttribute(projectId: string) {
    const query = {
      query: PROJECT_ATTRIBUTES,
      variables: { projectId }
    };

    const { data } = await apolloClient.query(query);

    const attributes = data.projectAttributes.map((attr: never) =>
      plainToClass(Attribute, attr)
    );
    this.setAttributes(attributes);
  }

  @Mutation
  setAttributes(attributes: Attribute[]) {
    this.attributes = attributes;
  }

  @Mutation
  addEntity(attribute: Attribute) {
    this.attributes = [attribute, ...this.attributes];
  }
}

export const attributesModule = new AttributesModule({
  store,
  name: "attributes"
});
