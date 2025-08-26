import { gql } from '@apollo/client'

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
