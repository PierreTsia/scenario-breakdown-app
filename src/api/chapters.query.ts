import { gql } from "apollo-boost";
export const DELETE_CHAPTER = gql`
  mutation($chapterId: String!) {
    deleteChapter(chapterId: $chapterId) {
      id
    }
  }
`;
