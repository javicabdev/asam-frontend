import { gql } from '@apollo/client'

// Re-export member mutations from generated operations
export {
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  UpdateMemberDocument as UPDATE_MEMBER_MUTATION,
  DeleteMemberDocument as DELETE_MEMBER_MUTATION,
} from '@/graphql/generated/operations'

// Change Member Status Mutation
export const CHANGE_MEMBER_STATUS_MUTATION = gql`
  mutation ChangeMemberStatus($id: ID!, $status: MemberStatus!) {
    changeMemberStatus(id: $id, status: $status) {
      miembro_id
      nombre
      apellidos
      estado
      fecha_baja
    }
  }
`

// Export types
export type {
  UpdateMemberMutation,
  UpdateMemberMutationVariables,
  DeleteMemberMutation,
  DeleteMemberMutationVariables,
} from '@/graphql/generated/operations'

export const CREATE_FAMILY_MUTATION = gql`
  mutation CreateFamily($input: CreateFamilyInput!) {
    createFamily(input: $input) {
      id
      numero_socio
      esposo_nombre
      esposo_apellidos
      esposa_nombre
      esposa_apellidos
      miembro_origen {
        miembro_id
        nombre
        apellidos
      }
    }
  }
`

export const ADD_FAMILY_MEMBER_MUTATION = gql`
  mutation AddFamilyMember($family_id: ID!, $familiar: FamiliarInput!) {
    addFamilyMember(family_id: $family_id, familiar: $familiar) {
      id
      familiares {
        id
        nombre
        apellidos
        fecha_nacimiento
        dni_nie
        correo_electronico
      }
    }
  }
`

export const GET_FAMILY_QUERY = gql`
  query GetFamily($id: ID!) {
    getFamily(id: $id) {
      id
      numero_socio
      esposo_nombre
      esposo_apellidos
      esposo_fecha_nacimiento
      esposo_documento_identidad
      esposo_correo_electronico
      esposa_nombre
      esposa_apellidos
      esposa_fecha_nacimiento
      esposa_documento_identidad
      esposa_correo_electronico
      miembro_origen {
        miembro_id
        nombre
        apellidos
      }
      familiares {
        id
        nombre
        apellidos
        fecha_nacimiento
        dni_nie
        correo_electronico
      }
    }
  }
`
