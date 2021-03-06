import { gql } from "apollo-boost";
export const paginationMetaGql = `
  meta {
    total
    result
    pageSize
    pageIndex
    pagesCount
  }`;
export const DELETE_CHAPTER = gql`
  mutation($chapterId: String!) {
    deleteChapter(chapterId: $chapterId) {
      id
    }
  }
`;

export const ANALYZE_CHAPTER = gql`
  query($chapterId: String!) {
    analyzeChapter(chapterId: $chapterId)
  }
`;

export const CHAPTER_PARAGRAPHS = gql`
  query($chapterParagraphsInput: ChapterParagraphsInput!) {
    chapterParagraphs(chapterParagraphsInput: $chapterParagraphsInput) {
      ${paginationMetaGql}
      results {
        id
        index
        tokens { 
          tag
          value
          entityType
          uid
          originalSeq
        }
        fullText
      }
    }
  }
`;
