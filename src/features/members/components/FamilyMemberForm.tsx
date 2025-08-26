import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FamilyMember } from '../types'

interface FamilyMemberFormProps {
  open: boolean
  member?: FamilyMember
  onClose: () => void
  onSave: (member: FamilyMember) => void
}

const PARENTESCO_OPTIONS = [
  'Hijo/a',
  'Padre',
  'Madre',
  'Hermano/a',
  'Abuelo/a',
  'Nieto/a',
  'Tío/a',
  'Sobrino/a',
  'Primo/a',
  'Otro',
]

export const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  open,
  member,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<FamilyMember>({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    dni_nie: '',
    correo_electronico: '',
    parentesco: 'Hijo/a',
  })

  const [fechaNacimiento, setFechaNacimiento] = React.useState<Date | null>(null)

  React.useEffect(() => {
    if (member) {
      setFormData(member)
      if (member.fecha_nacimiento) {
        setFechaNacimiento(new Date(member.fecha_nacimiento))
      }
    } else {
      setFormData({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        dni_nie: '',
        correo_electronico: '',
        parentesco: 'Hijo/a',
      })
      setFechaNacimiento(null)
    }
  }, [member, open])

  const handleChange =
    (field: keyof FamilyMember) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }

  const handleDateChange = (newValue: Date | null) => {
    setFechaNacimiento(newValue)
    setFormData((prev) => ({
      ...prev,
      fecha_nacimiento: newValue ? format(newValue, 'yyyy-MM-dd') : '',
    }))
  }

  const handleSubmit = () => {
    if (formData.nombre && formData.apellidos && formData.parentesco) {
      onSave(formData)
      onClose()
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{member ? 'Editar Familiar' : 'Añadir Familiar'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange('nombre')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                value={formData.apellidos}
                onChange={handleChange('apellidos')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={fechaNacimiento}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                maxDate={new Date()}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI/NIE"
                value={formData.dni_nie || ''}
                onChange={handleChange('dni_nie')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={formData.correo_electronico || ''}
                onChange={handleChange('correo_electronico')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Parentesco"
                value={formData.parentesco || ''}
                onChange={handleChange('parentesco')}
                required
              >
                {PARENTESCO_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.nombre || !formData.apellidos || !formData.parentesco}
          >
            {member ? 'Actualizar' : 'Añadir'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
