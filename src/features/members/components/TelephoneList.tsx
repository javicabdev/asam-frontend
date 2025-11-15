import { Box, Typography, Link } from '@mui/material'
import { Phone as PhoneIcon } from '@mui/icons-material'
import type { Telephone } from '@/features/members/types'

interface TelephoneListProps {
  telefonos?: Telephone[]
  label?: string
}

/**
 * Component to display a list of phone numbers
 * Shows a formatted list with phone icons and clickable tel: links
 */
export function TelephoneList({ telefonos, label }: TelephoneListProps) {
  if (!telefonos || telefonos.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        No especificado
      </Typography>
    )
  }

  return (
    <Box>
      {label && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {telefonos.map((tel) => (
          <Box key={tel.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Link href={`tel:${tel.numero_telefono}`} underline="hover" color="primary">
              {tel.numero_telefono}
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
