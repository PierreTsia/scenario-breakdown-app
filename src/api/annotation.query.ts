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
      attribute {
        id
        slug
        entity {
          id
          color
          label
        }
      }
      value
      creationDate
      createdBy {
        email
        id
        username
      }
    }
  }
`;

export const PROJECT_ANNOTATIONS = gql`
  query($input: FetchAnnotationInput!) {
    projectAnnotations(input: $input) {
      id
      value
      attribute {
        id
        slug
        entity {
          id
          label
          color
        }
      }
      chapterId
      projectId
      start {
        wordIndex
        paragraphIndex
      }
      end {
        wordIndex
        paragraphIndex
      }
      createdBy {
        email
        id
        username
      }
      creationDate
    }
  }
`;

export const DELETE_ANNOTATIONS = gql`
  mutation($deleteInput: DeleteAnnotationInput!) {
    deleteAnnotations(deleteInput: $deleteInput)
  }
`;
