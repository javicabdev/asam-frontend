import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { MemberAutocomplete } from '../MemberAutocomplete'
import { SEARCH_MEMBERS } from '../../api/userQueries'
import type { Member, MembershipType, MemberStatus } from '@/graphql/generated/operations'

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

const mockMembers: Member[] = [
  {
    miembro_id: '1',
    nombre: 'Juan',
    apellidos: 'Pérez',
    numero_socio: 'A00001',
    documento_identidad: '12345678A',
    correo_electronico: 'juan@example.com',
    estado: 'ACTIVE' as MemberStatus,
    // Add other required fields with default values
    calle_numero_piso: '',
    codigo_postal: '',
    fecha_alta: new Date().toISOString(),
    fecha_baja: null,
    fecha_nacimiento: null,
    nacionalidad: null,
    observaciones: null,
    pais: 'España',
    poblacion: 'Madrid',
    profesion: null,
    provincia: 'Madrid',
    tipo_membresia: 'INDIVIDUAL' as MembershipType,
  },
  {
    miembro_id: '2',
    nombre: 'María',
    apellidos: 'García',
    numero_socio: 'A00002',
    documento_identidad: '87654321B',
    correo_electronico: 'maria@example.com',
    estado: 'ACTIVE' as MemberStatus,
    // Add other required fields with default values
    calle_numero_piso: '',
    codigo_postal: '',
    fecha_alta: new Date().toISOString(),
    fecha_baja: null,
    fecha_nacimiento: null,
    nacionalidad: null,
    observaciones: null,
    pais: 'España',
    poblacion: 'Barcelona',
    profesion: null,
    provincia: 'Barcelona',
    tipo_membresia: 'INDIVIDUAL' as MembershipType,
  },
]

describe('MemberAutocomplete', () => {
  it('should render and search for members', async () => {
    const mockOnChange = jest.fn()
    
    const mocks = [
      {
        request: {
          query: SEARCH_MEMBERS,
          variables: { criteria: 'Juan' },
        },
        result: {
          data: {
            searchMembers: [mockMembers[0]],
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemberAutocomplete
          value={null}
          onChange={mockOnChange}
          label="Select Member"
        />
      </MockedProvider>
    )

    const input = screen.getByLabelText('Select Member')
    
    // Type in the search field
    fireEvent.change(input, { target: { value: 'Juan' } })
    
    // Wait for the search results
    await waitFor(() => {
      expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Click on the result
    fireEvent.click(screen.getByText(/Juan Pérez/))
    
    // Verify onChange was called with the selected member
    expect(mockOnChange).toHaveBeenCalledWith(mockMembers[0])
  })

  it('should show loading state while searching', async () => {
    const mocks = [
      {
        request: {
          query: SEARCH_MEMBERS,
          variables: { criteria: 'test' },
        },
        delay: 1000, // Add delay to see loading state
        result: {
          data: {
            searchMembers: [],
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemberAutocomplete
          value={null}
          onChange={jest.fn()}
          label="Select Member"
        />
      </MockedProvider>
    )

    const input = screen.getByLabelText('Select Member')
    
    // Open the autocomplete
    fireEvent.click(input)
    
    // Type in the search field
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Check for loading text
    await waitFor(() => {
      expect(screen.getByText('form.memberSearch.loading')).toBeInTheDocument()
    })
  })

  it('should require at least 2 characters to search', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <MemberAutocomplete
          value={null}
          onChange={jest.fn()}
          label="Select Member"
        />
      </MockedProvider>
    )

    const input = screen.getByLabelText('Select Member')
    
    // Open the autocomplete
    fireEvent.click(input)
    
    // Type only 1 character
    fireEvent.change(input, { target: { value: 'J' } })
    
    // Should show the "type to search" message
    expect(screen.getByText('form.memberSearch.typeToSearch')).toBeInTheDocument()
  })

  it('should filter only active members', async () => {
    const mockOnChange = jest.fn()
    
    const mixedMembers = [
      ...mockMembers,
      {
        ...mockMembers[0],
        miembro_id: '3',
        nombre: 'Pedro',
        apellidos: 'López',
        numero_socio: 'A00003',
        estado: 'INACTIVE' as MemberStatus,
      },
    ]
    
    const mocks = [
      {
        request: {
          query: SEARCH_MEMBERS,
          variables: { criteria: 'test' },
        },
        result: {
          data: {
            searchMembers: mixedMembers,
          },
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemberAutocomplete
          value={null}
          onChange={mockOnChange}
          label="Select Member"
        />
      </MockedProvider>
    )

    const input = screen.getByLabelText('Select Member')
    
    // Type in the search field
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Wait for the search results
    await waitFor(() => {
      // Should show active members
      expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument()
      expect(screen.getByText(/María García/)).toBeInTheDocument()
    })
    
    // Should NOT show inactive member
    expect(screen.queryByText(/Pedro López/)).not.toBeInTheDocument()
  })
})
