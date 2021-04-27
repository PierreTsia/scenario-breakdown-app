import { gql } from "apollo-boost";
const paragraphsGql = `
      paragraphs {
          id
          index
          words
          annotations {
            id
          }
        }`;

export const USER_PROJECTS = gql`
  query {
    projects {
      id
      title
      description
      chapters {
        id
        title
      }
      creationDate
      createdBy {
        id
        username
        email
      }
    }
  }
`;

export const PROJECT_BY_ID = ({ includeParagraphs = false } = {}) =>
  gql(`
  query($projectId: String!) {
    project(projectId: $projectId) {
      id
      title
      description
      chapters {
        id
        title
        status
        ${includeParagraphs ? paragraphsGql : ""}
      }
      creationDate
      createdBy {
        id
        username
        email
      }
    }
  }
`);

export const CREATE_PROJECT = gql`
  mutation($projectInput: ProjectInput!) {
    createProject(projectInput: $projectInput) {
      title
      id
      description
      creationDate
      createdBy {
        id
        username
        email
      }
      chapters {
        id
        title
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;
