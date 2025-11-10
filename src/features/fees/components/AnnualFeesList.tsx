import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { LIST_ANNUAL_FEES_QUERY } from '../api/queries'

interface AnnualFee {
  id: string
  year: number
  base_fee_amount: number
  family_fee_extra: number
  due_date: string
}

interface MappedAnnualFee {
  id: string
  year: number
  individualAmount: number
  familyAmount: number
  dueDate: Date
}

interface ListAnnualFeesQueryResponse {
  listAnnualFees: AnnualFee[]
}

export const AnnualFeesList: React.FC = () => {
  const { t } = useTranslation('fees')

  const { data, loading, error } = useQuery<ListAnnualFeesQueryResponse>(
    LIST_ANNUAL_FEES_QUERY,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  // Mapear los campos del backend a los nombres que usa el frontend
  const mappedFees = React.useMemo<MappedAnnualFee[]>(() => {
    if (!data?.listAnnualFees) return []

    return data.listAnnualFees.map((fee) => ({
      id: fee.id,
      year: fee.year,
      individualAmount: fee.base_fee_amount,
      familyAmount: fee.base_fee_amount + fee.family_fee_extra,
      dueDate: new Date(fee.due_date),
    }))
  }, [data])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {t('list.error')}: {error.message}
      </Alert>
    )
  }

  if (mappedFees.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {t('list.empty')}
      </Alert>
    )
  }

  // Sort by year descending (most recent first)
  const sortedFees = [...mappedFees].sort((a, b) => b.year - a.year)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es })
    } catch {
      return dateString
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h2">
          {t('list.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('list.subtitle')}
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="annual fees table">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>{t('list.columns.year')}</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{t('list.columns.individualAmount')}</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{t('list.columns.familyAmount')}</strong>
              </TableCell>
              <TableCell>
                <strong>{t('list.columns.dueDate')}</strong>
              </TableCell>
              <TableCell align="center">
                <strong>{t('list.columns.status')}</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFees.map((fee) => {
              const currentYear = new Date().getFullYear()
              const isCurrentYear = fee.year === currentYear
              const isFutureYear = fee.year > currentYear

              return (
                <TableRow
                  key={fee.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{fee.year}</Typography>
                      {isCurrentYear && (
                        <Chip
                          label={t('list.currentYear')}
                          color="primary"
                          size="small"
                        />
                      )}
                      {isFutureYear && (
                        <Chip
                          label={t('list.futureYear')}
                          color="default"
                          size="small"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(fee.individualAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(fee.familyAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(fee.dueDate.toISOString())}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={t('list.statusActive')}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          {t('list.total', { count: sortedFees.length })}
        </Typography>
      </Box>
    </Paper>
  )
}
