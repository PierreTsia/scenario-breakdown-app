import { gql } from "apollo-boost";

export const PROJECT_ATTRIBUTES = gql`
  query($projectId: String!) {
    projectAttributes(projectId: $projectId) {
      id
      slug
      entity {
        id
        color
        label
      }
    }
  }
`;
