import { gql } from "@apollo/client";

export const ALL_SEQUENCES = gql`
  query AllSequences($filter: SequenceFilterInput) {
    allSequences(filter: $filter) {
      count
      nextPage
      prevPage
      totalPages
      allData {
        id
        exerciseCount
        assessmentId
        status
        title
        sequenceTemplateId
        assessmentSequenceOrder
        createdAt
        askedForAdminHelp
        adminCanUpdate
        client {
          id
          imageUrl
          fullName
        }
        practitioner {
          imageUrl
          id
          fullName
        }
      }
    }
  }
`;
