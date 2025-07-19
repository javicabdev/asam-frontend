// GraphQL type definitions for TypeScript
// These are manually defined to match the backend schema

// Scalars
export type Time = string;
export type JWT = string;

// Enums (already defined in types.ts)

// Input types
export interface CreateMemberInput {
  numero_socio: string;
  tipo_membresia: 'INDIVIDUAL' | 'FAMILY';
  nombre: string;
  apellidos: string;
  calle_numero_piso: string;
  codigo_postal: string;
  poblacion: string;
  provincia?: string;
  pais?: string;
  fecha_nacimiento?: string;
  documento_identidad?: string;
  correo_electronico?: string;
  profesion?: string;
  nacionalidad?: string;
  observaciones?: string;
}

export interface UpdateMemberInput {
  miembro_id: string;
  calle_numero_piso?: string;
  codigo_postal?: string;
  poblacion?: string;
  provincia?: string;
  pais?: string;
  documento_identidad?: string;
  correo_electronico?: string;
  profesion?: string;
  observaciones?: string;
}

export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface SortInput {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface MemberFilterInput {
  estado?: 'ACTIVE' | 'INACTIVE';
  tipo_membresia?: 'INDIVIDUAL' | 'FAMILY';
  search_term?: string;
  pagination?: PaginationInput;
  sort?: SortInput;
  // TODO: The following fields need to be implemented in the backend
  // poblacion?: string;
  // provincia?: string;
  // fecha_alta_desde?: string;
  // fecha_alta_hasta?: string;
  // fecha_baja_desde?: string;
  // fecha_baja_hasta?: string;
  // correo_electronico?: string;
  // documento_identidad?: string;
}

// Response types
export interface MutationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Query response types
export interface ListMembersQueryResponse {
  listMembers: {
    nodes: Array<{
      miembro_id: string;
      numero_socio: string;
      tipo_membresia: 'INDIVIDUAL' | 'FAMILY';
      nombre: string;
      apellidos: string;
      calle_numero_piso: string;
      codigo_postal: string;
      poblacion: string;
      provincia: string;
      pais: string;
      estado: 'ACTIVE' | 'INACTIVE';
      fecha_alta: string;
      fecha_baja?: string | null;
      fecha_nacimiento?: string | null;
      documento_identidad?: string | null;
      correo_electronico?: string | null;
      profesion?: string | null;
      nacionalidad?: string | null;
      observaciones?: string | null;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      totalCount: number;
    };
  };
}

export interface GetMemberQueryResponse {
  getMember: {
    miembro_id: string;
    numero_socio: string;
    tipo_membresia: 'INDIVIDUAL' | 'FAMILY';
    nombre: string;
    apellidos: string;
    calle_numero_piso: string;
    codigo_postal: string;
    poblacion: string;
    provincia: string;
    pais: string;
    estado: 'ACTIVE' | 'INACTIVE';
    fecha_alta: string;
    fecha_baja?: string | null;
    fecha_nacimiento?: string | null;
    documento_identidad?: string | null;
    correo_electronico?: string | null;
    profesion?: string | null;
    nacionalidad?: string | null;
    observaciones?: string | null;
  } | null;
}

// Mutation response types
export interface CreateMemberMutationResponse {
  createMember: {
    miembro_id: string;
    numero_socio: string;
    tipo_membresia: 'INDIVIDUAL' | 'FAMILY';
    nombre: string;
    apellidos: string;
    estado: 'ACTIVE' | 'INACTIVE';
  };
}

export interface UpdateMemberMutationResponse {
  updateMember: {
    miembro_id: string;
    numero_socio: string;
    tipo_membresia: 'INDIVIDUAL' | 'FAMILY';
    nombre: string;
    apellidos: string;
    calle_numero_piso: string;
    codigo_postal: string;
    poblacion: string;
    provincia: string;
    pais: string;
    estado: 'ACTIVE' | 'INACTIVE';
    fecha_alta: string;
    fecha_baja?: string | null;
    fecha_nacimiento?: string | null;
    documento_identidad?: string | null;
    correo_electronico?: string | null;
    profesion?: string | null;
    nacionalidad?: string | null;
    observaciones?: string | null;
  };
}

export interface DeleteMemberMutationResponse {
  deleteMember: MutationResponse;
}
