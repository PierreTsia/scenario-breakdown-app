import { gql } from "apollo-boost";

export const CREATE_ENTITY = gql`
  mutation($entityInput: EntityInput!) {
    createEntity(entityInput: $entityInput) {
      id
      label
      color
    }
  }
`;
