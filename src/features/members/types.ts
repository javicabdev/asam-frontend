// Member types based on GraphQL schema

// Using const assertions for better type compatibility with GraphQL
export const MembershipType = {
  INDIVIDUAL: 'INDIVIDUAL',
  FAMILY: 'FAMILY'
} as const;

export type MembershipType = typeof MembershipType[keyof typeof MembershipType];

export const MemberStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;

export type MemberStatus = typeof MemberStatus[keyof typeof MemberStatus];

export const SortDirection = {
  ASC: 'ASC',
  DESC: 'DESC'
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];

export interface Member {
  miembro_id: string;
  numero_socio: string;
  tipo_membresia: MembershipType;
  nombre: string;
  apellidos: string;
  calle_numero_piso: string;
  codigo_postal: string;
  poblacion: string;
  provincia: string;
  pais: string;
  estado: MemberStatus;
  fecha_alta: string;
  fecha_baja?: string | null;
  fecha_nacimiento?: string | null;
  documento_identidad?: string | null;
  correo_electronico?: string | null;
  profesion?: string | null;
  nacionalidad?: string | null;
  observaciones?: string | null;
}

export interface MemberFilter {
  estado?: MemberStatus;
  tipo_membresia?: MembershipType;
  search_term?: string;
  poblacion?: string;
  provincia?: string;
  fecha_alta_desde?: string;
  fecha_alta_hasta?: string;
  fecha_baja_desde?: string;
  fecha_baja_hasta?: string;
  correo_electronico?: string;
  documento_identidad?: string;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sort?: {
    field: string;
    direction: SortDirection;
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
}

export interface MemberConnection {
  nodes: Member[];
  pageInfo: PageInfo;
}

// Family types
export interface FamilyMember {
  id?: string;
  nombre: string;
  apellidos: string;
  fecha_nacimiento?: string;
  dni_nie?: string;
  correo_electronico?: string;
  parentesco?: string;
}

export interface Family {
  id: string;
  numero_socio: string;
  miembro_origen?: {
    miembro_id: string;
    nombre: string;
    apellidos: string;
  };
  esposo_nombre: string;
  esposo_apellidos: string;
  esposa_nombre: string;
  esposa_apellidos: string;
  familiares?: FamilyMember[];
}

export interface CreateFamilyInput {
  numero_socio: string;
  miembro_origen_id: string;
  esposo_nombre?: string;
  esposo_apellidos?: string;
  esposo_fecha_nacimiento?: string;
  esposo_documento_identidad?: string;
  esposo_correo_electronico?: string;
  esposa_nombre?: string;
  esposa_apellidos?: string;
  esposa_fecha_nacimiento?: string;
  esposa_documento_identidad?: string;
  esposa_correo_electronico?: string;
}

export interface FamiliarInput {
  nombre: string;
  apellidos: string;
  fecha_nacimiento?: string;
  dni_nie?: string;
  correo_electronico?: string;
  parentesco: string;
}
