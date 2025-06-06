import { gql } from '@apollo/client'

// Member queries
export const GET_MEMBER = gql`
  query GetMember($id: ID!) {
    getMember(id: $id) {
      miembro_id
      numero_socio
      tipo_membresia
      nombre
      apellidos
      calle_numero_piso
      codigo_postal
      poblacion
      provincia
      pais
      estado
      fecha_alta
      fecha_baja
      fecha_nacimiento
      documento_identidad
      correo_electronico
      profesion
      nacionalidad
      observaciones
    }
  }
`

export const LIST_MEMBERS = gql`
  query ListMembers($filter: MemberFilter) {
    listMembers(filter: $filter) {
      nodes {
        miembro_id
        numero_socio
        nombre
        apellidos
        estado
        tipo_membresia
        fecha_alta
        correo_electronico
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`

export const SEARCH_MEMBERS = gql`
  query SearchMembers($criteria: String!) {
    searchMembers(criteria: $criteria) {
      miembro_id
      numero_socio
      nombre
      apellidos
      estado
      tipo_membresia
      correo_electronico
    }
  }
`

// Member mutations
export const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      miembro_id
      numero_socio
      tipo_membresia
      nombre
      apellidos
      estado
      fecha_alta
      correo_electronico
    }
  }
`

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: UpdateMemberInput!) {
    updateMember(input: $input) {
      miembro_id
      nombre
      apellidos
      correo_electronico
      calle_numero_piso
      codigo_postal
      poblacion
      provincia
      pais
      documento_identidad
      profesion
      observaciones
    }
  }
`

export const CHANGE_MEMBER_STATUS = gql`
  mutation ChangeMemberStatus($id: ID!, $status: MemberStatus!) {
    changeMemberStatus(id: $id, status: $status) {
      miembro_id
      nombre
      apellidos
      estado
    }
  }
`

export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id) {
      success
      message
      error
    }
  }
`
