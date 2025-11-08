import React, { useState, useEffect, useCallback } from 'react'
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material'
import { useLazyQuery } from '@apollo/client'
import { SEARCH_MEMBERS, SEARCH_MEMBERS_FOR_USER_ASSOCIATION } from '../api/userQueries'
import type { Member } from '@/graphql/generated/operations'
import { useTranslation } from 'react-i18next'

// Custom debounce implementation with proper typing
function debounce<T extends unknown[]>(
  func: (...args: T) => void,
  wait: number
): ((...args: T) => void) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null

  const debounced = (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, wait)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}

interface MemberAutocompleteProps {
  value: Member | null
  onChange: (member: Member | null) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  label?: string
  required?: boolean
  excludeMembersWithUser?: boolean
  size?: 'small' | 'medium'
}

interface SearchMembersResponse {
  searchMembers: Member[]
}

interface SearchMembersWithoutUserResponse {
  searchMembersWithoutUser: Member[]
}

export const MemberAutocomplete: React.FC<MemberAutocompleteProps> = ({
  value,
  onChange,
  error,
  helperText,
  disabled,
  label,
  required,
  excludeMembersWithUser = false,
  size = 'medium',
}) => {
  const { t } = useTranslation('users')
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<Member[]>([])
  
  // Use the appropriate query based on the prop
  const query = excludeMembersWithUser 
    ? SEARCH_MEMBERS_FOR_USER_ASSOCIATION 
    : SEARCH_MEMBERS
    
  const [searchMembers, { 
    loading, 
    data 
  }] = useLazyQuery<SearchMembersResponse | SearchMembersWithoutUserResponse>(query)

  // Search function
  const performSearch = useCallback((searchTerm: string) => {
    if (searchTerm.length >= 2) {
      void searchMembers({ 
        variables: { criteria: searchTerm } 
      })
    }
  }, [searchMembers])

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce(performSearch, 300),
    [performSearch]
  )

  // Effect to update options when data changes
  useEffect(() => {
    if (excludeMembersWithUser && data && 'searchMembersWithoutUser' in data) {
      // When using the optimized query, members are already filtered by backend
      setOptions(data.searchMembersWithoutUser)
    } else if (!excludeMembersWithUser && data && 'searchMembers' in data) {
      // For regular search, filter active members
      setOptions(data.searchMembers.filter((m: Member) => m.estado === 'ACTIVE'))
    }
  }, [data, excludeMembersWithUser])

  // Effect to trigger search on input change
  useEffect(() => {
    if (inputValue.length >= 2) {
      debouncedSearch(inputValue)
    } else {
      setOptions([])
    }

    return () => {
      debouncedSearch.cancel()
    }
  }, [inputValue, debouncedSearch])

  const getOptionLabel = (option: Member) => {
    return `${option.nombre} ${option.apellidos} - N° ${option.numero_socio}`
  }

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: Member) => (
    <Box component="li" {...props}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography variant="body1">
          {option.nombre} {option.apellidos}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            N° {option.numero_socio}
          </Typography>
          {option.documento_identidad && (
            <Typography variant="caption" color="text.secondary">
              • {option.documento_identidad}
            </Typography>
          )}
          {option.estado === 'ACTIVE' && (
            <Chip label="Activo" size="small" color="success" />
          )}
        </Box>
      </Box>
    </Box>
  )

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      loading={loading}
      disabled={disabled}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      isOptionEqualToValue={(option, val) => option.miembro_id === val.miembro_id}
      noOptionsText={
        inputValue.length < 2
          ? t('form.memberSearch.typeToSearch')
          : t('form.memberSearch.noResults')
      }
      loadingText={t('form.memberSearch.loading')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || t('form.fields.member')}
          error={error}
          helperText={helperText}
          required={required}
          placeholder={t('form.memberSearch.placeholder')}
          size={size}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
