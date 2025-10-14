import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(
      input: { loginAttributes: { email: $email, password: $password } }
    ) {
      message
    }
  }
`;

export const VALIDATE_OTP = gql`
  mutation ValidateOtp($otpCode: String!, $email: String!) {
    validateOtp(input: { otpCode: $otpCode, email: $email }) {
      token
      user {
        resetPasswordToken
        address
        archived
        calendarLink
        city
        clinicId
        clinicName
        createdAt
        deleted
        email
        firstName
        fullName
        gender
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
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword(
    $password: String!
    $currentPassword: String!
    $passwordConfirmation: String!
  ) {
    updatePassword(
      input: {
        password: $password
        currentPassword: $currentPassword
        passwordConfirmation: $passwordConfirmation
      }
    ) {
      response
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $email: String
    $password: String
    $passwordConfirmation: String
    $firstName: String
    $lastName: String
    $userType: String
    $phone: String
    $address: String
    $state: String
    $city: String
    $zipCode: String
    $gender: String
    $calendarLink: String
    $image: Upload
    $archive: Boolean
    $unarchive: Boolean
    $revokeAccess: Boolean
    $id: ID
    $dateOfBirth: ISO8601Date
    $conditions: String
    $medicalHistory: String
    $pregnant: Boolean
    $surgeries: String
    $pregnancyDueDate: ISO8601Date
  ) {
    updateUser(
      input: {
        userAttributes: {
          email: $email
          password: $password
          passwordConfirmation: $passwordConfirmation
          firstName: $firstName
          lastName: $lastName
          userType: $userType
          phone: $phone
          address: $address
          state: $state
          city: $city
          zipCode: $zipCode
          gender: $gender
          calendarLink: $calendarLink
          image: $image
          archive: $archive
          unarchive: $unarchive
          revokeAccess: $revokeAccess
          dateOfBirth: $dateOfBirth
          conditions: $conditions
          medicalHistory: $medicalHistory
          pregnant: $pregnant
          surgeries: $surgeries
          pregnancyDueDate: $pregnancyDueDate
        }
        id: $id
      }
    ) {
      user {
        resetPasswordToken
        address
        archived
        calendarLink
        city
        clinicId
        clinicName
        createdAt
        deleted
        email
        firstName
        fullName
        gender
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
      }
    }
  }
`;
