import { gql } from "apollo-boost";
export const LOG_IN = gql`
  query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      user {
        id
        username
        roles
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      access_token
      user {
        id
        username
        roles
      }
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      username
      email
      roles
    }
  }
`;
