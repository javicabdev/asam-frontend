import { Box, TextField, IconButton, Button } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface TelephoneInputProps {
  telefonos: string[]
  onChange: (telefonos: string[]) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
}

/**
 * Component to manage multiple phone numbers in a form
 * Allows adding, editing, and removing phone numbers
 */
export function TelephoneInput({
  telefonos,
  onChange,
  error,
  helperText,
  disabled,
}: TelephoneInputProps) {
  const { t } = useTranslation('members')

  const handleAdd = () => {
    onChange([...telefonos, ''])
  }

  const handleRemove = (index: number) => {
    onChange(telefonos.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, value: string) => {
    const updated = [...telefonos]
    updated[index] = value
    onChange(updated)
  }

  // Always show at least one input field for better UX
  const displayTelefonos = telefonos.length === 0 ? [''] : telefonos

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1 }}>
        {displayTelefonos.map((tel, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              value={tel}
              onChange={(e) => handleChange(index, e.target.value)}
              label={index === 0 ? t('memberForm.fields.phone') : undefined}
              placeholder={index === 0 ? undefined : "+34 612 345 678"}
              error={error}
              helperText={index === 0 ? helperText : undefined}
              disabled={disabled}
              type="tel"
            />
            {/* Only show delete button if there's more than one field or if the array actually has items */}
            {(telefonos.length > 1 || (telefonos.length === 1 && index === 0)) && (
              <IconButton
                size="small"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        disabled={disabled}
        variant="outlined"
      >
        {t('form.helpers.addPhone')}
      </Button>
    </Box>
  )
}
