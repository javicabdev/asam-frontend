import { gql } from '@apollo/client';

// Query to list members with pagination and filters
export const LIST_MEMBERS_QUERY = gql`
  query ListMembers($filter: MemberFilter) {
    listMembers(filter: $filter) {
      nodes {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`;

// Query to get a single member
export const GET_MEMBER_QUERY = gql`
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
`;

// Mutation to create a new member
export const CREATE_MEMBER_MUTATION = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      miembro_id
      numero_socio
      tipo_membresia
      nombre
      apellidos
      estado
    }
  }
`;

// Mutation to update a member
export const UPDATE_MEMBER_MUTATION = gql`
  mutation UpdateMember($input: UpdateMemberInput!) {
    updateMember(input: $input) {
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
`;

// Mutation to delete a member
export const DELETE_MEMBER_MUTATION = gql`
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id) {
      success
      message
      error
    }
  }
`;
