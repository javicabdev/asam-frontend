import { gql } from '@apollo/client'

// Authentication mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        username
        role
        isActive
        lastLogin
      }
      accessToken
      refreshToken
      expiresAt
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
      error
    }
  }
`

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      expiresAt
    }
  }
`
