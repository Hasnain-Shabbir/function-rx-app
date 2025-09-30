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
