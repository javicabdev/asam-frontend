import { Box, TextField, IconButton, Button, Typography } from '@mui/material'
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

  return (
    <Box>
      <Typography variant="body2" fontWeight="medium" gutterBottom>
        {t('details.phone')}
      </Typography>

      {telefonos.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('form.helpers.noPhones')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 1 }}>
          {telefonos.map((tel, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                size="small"
                value={tel}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="+34 612 345 678"
                error={error}
                helperText={index === 0 ? helperText : undefined}
                disabled={disabled}
                type="tel"
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                color="error"
                sx={{ mt: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

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
