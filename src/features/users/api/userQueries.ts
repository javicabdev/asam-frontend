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

// Query to search members for association
export const SEARCH_MEMBERS = gql`
  query SearchMembers($criteria: String!) {
    searchMembers(criteria: $criteria) {
      miembro_id
      nombre
      apellidos
      numero_socio
      documento_identidad
      correo_electronico
      estado
    }
  }
`

// Query to search members for user association (filters out members with existing users)
export const SEARCH_MEMBERS_FOR_USER_ASSOCIATION = gql`
  query SearchMembersForUserAssociation($criteria: String!) {
    searchMembersWithoutUser(criteria: $criteria) {
      miembro_id
      nombre
      apellidos
      numero_socio
      documento_identidad
      correo_electronico
      estado
    }
  }
`

// Query to get members without user account
export const GET_MEMBERS_WITHOUT_USER = gql`
  query GetMembersWithoutUser {
    listMembers(filter: { pagination: { pageSize: 100 } }) {
      nodes {
        miembro_id
        nombre
        apellidos
        numero_socio
        documento_identidad
        correo_electronico
        estado
      }
    }
  }
`
