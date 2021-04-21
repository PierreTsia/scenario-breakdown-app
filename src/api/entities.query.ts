import { gql } from "apollo-boost";

export const PROJECT_ENTITIES = gql`
  query($projectId: String!) {
    projectEntities(projectId: $projectId) {
      id
      color
      label
      project {
        id
      }
    }
  }
`;

export const CREATE_ENTITY = gql`
  mutation($entityInput: EntityInput!) {
    createEntity(entityInput: $entityInput) {
      id
      label
      color
    }
  }
`;
