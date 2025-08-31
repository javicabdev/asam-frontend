import { gql } from '@apollo/client'

// Query to get list of users
export const LIST_USERS = gql`
  query ListUsers($page: Int, $pageSize: Int) {
    listUsers(page: $page, pageSize: $pageSize) {
      id
      username
      email
      role
      isActive
      lastLogin
      emailVerified
      emailVerifiedAt
      member {
        miembro_id
        nombre
        apellidos
        numero_socio
      }
    }
  }
`

// Query to get current user
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      username
      email
      role
      isActive
      emailVerified
      member {
        miembro_id
        nombre
        apellidos
        numero_socio
      }
    }
  }
`

// Mutation to create user
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      role
      isActive
      member {
        miembro_id
        nombre
        apellidos
      }
    }
  }
`

// Mutation to update user
export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      role
      isActive
      member {
        miembro_id
        nombre
        apellidos
      }
    }
  }
`

// Mutation to delete user
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
      error
    }
  }
`
