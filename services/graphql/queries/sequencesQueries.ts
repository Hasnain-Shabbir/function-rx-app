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

export const SEQUENCE_DETAIL = gql`
  query AllSequences(
    $assessmentId: ID
    $exerciseItemsPage: Int
    $assessmentSequenceOrder: Int
    $exerciseItemsPerPage: Int
    $status: String
    $dateCreated: String
    $clientId: ID
    $practitionerId: ID
    $page: Int
    $search: String
    $perPage: Int
    $createdById: ID
  ) {
    allSequences(
      filter: {
        assessmentId: $assessmentId
        exerciseItemsPage: $exerciseItemsPage
        assessmentSequenceOrder: $assessmentSequenceOrder
        exerciseItemsPerPage: $exerciseItemsPerPage
        status: $status
        dateCreated: $dateCreated
        clientId: $clientId
        practitionerId: $practitionerId
        page: $page
        search: $search
        perPage: $perPage
        createdById: $createdById
      }
    ) {
      count
      allData {
        combinedExerciseItems {
          allData {
            createdAt
            id
            name
            positionOrder
            repetition
            reps
            sets
            shortVersion
            supersetPosition
            time
            type
            updatedAt
            writtenInstructions
            sequentialExercises {
              id
              name
              positionOrder
              repetition
              sets
              shortVersion
              supersetPosition
              time
            }
          }
          count
          nextPage
          prevPage
          totalPages
        }
        practitionerComments
        practitionerCommentsAddedAt
        practitionerCommentsAddedOn
        sequenceTemplateId
        status
        askedForAdminHelp
        adminCanUpdate
        title
        id
        assessmentId
        createdAt
        practitioner {
          fullName
          id
          imageUrl
        }
        assessmentSequenceOrder
        exerciseCount
        completionCount
      }
    }
  }
`;

export const FETCH_SEQUENTIAL_EXERCISE = gql`
  query FetchSequentialExercise($fetchSequentialExerciseId: ID!) {
    fetchSequentialExercise(id: $fetchSequentialExerciseId) {
      createdAt
      exercise {
        archived
        category
        chainDirectionality
        chainReleaseIndication
        dysfunctionIndications
        id
        name
        painIndications
        photos {
          id
          url
        }
        position
        repetition
        sets
        strengthLevel
        time
        videoUrl
        writtenInstructions
      }
      id
      name
      positionOrder
      repetition
      sets
      shortVersion
      supersetPosition
      time
      updatedAt
      writtenInstructions
    }
  }
`;

export const FETCH_USER = gql`
  query User($fetchUserId: ID) {
    fetchUser(id: $fetchUserId) {
      user {
        address
        archived
        calendarLink
        city
        clinicId
        clinicName
        clinicTheme
        createdAt
        deleted
        email
        firstName
        fullName
        gender
        selfServiceClinic
        id
        imageUrl
        invitationSentAt
        lastName
        lastSignInAt
        onboardingCompleted
        phone
        revokeAccess
        state
        subscriptionPaid
        userType
        zipCode
        clinicImageUrl
        dateOfBirth
        conditions
        medicalHistory
        pregnant
        surgeries
        pregnancyDueDate
        totalClients
        sequenceCount
        maxSequenceLimit
        therapyCount
        resetPasswordToken
      }
    }
  }
`;
