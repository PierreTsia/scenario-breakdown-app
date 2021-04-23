import { gql } from "apollo-boost";

export const CREATE_ANNOTATION = gql`
  mutation($input: AnnotationInput!) {
    annotate(input: $input) {
      id
      start {
        paragraphIndex
        wordIndex
      }
      end {
        paragraphIndex
        wordIndex
      }
      entity {
        id
        color
        label
      }
      label
    }
  }
`;

export const PROJECT_ANNOTATIONS = gql`
  query($projectId: String!) {
    projectAnnotations(projectId: $projectId) {
      id
      label
      start {
        paragraphIndex
        wordIndex
      }
      end {
        paragraphIndex
        wordIndex
      }
      entity {
        label
        id
        color
      }
      creationDate
    }
  }
`;
