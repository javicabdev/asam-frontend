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
