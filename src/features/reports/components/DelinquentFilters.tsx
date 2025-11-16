import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Clear } from '@mui/icons-material'
import { DebtorType, SortBy } from '../types'
import type { DelinquentReportInput } from '../types'

interface DelinquentFiltersProps {
  filters: DelinquentReportInput
  onUpdateFilters: (filters: Partial<DelinquentReportInput>) => void
  onResetFilters: () => void
}

/**
 * Panel de filtros para el informe de morosos
 */
export function DelinquentFilters({
  filters,
  onUpdateFilters,
  onResetFilters,
}: DelinquentFiltersProps) {
  const { t } = useTranslation('reports')

  const debtorTypeOptions: Array<{ value: DebtorType | null; label: string }> =
    [
      { value: null, label: t('delinquent.filters.all') },
      {
        value: DebtorType.INDIVIDUAL,
        label: t('delinquent.debtorType.individual'),
      },
      { value: DebtorType.FAMILY, label: t('delinquent.debtorType.family') },
    ]

  const sortByOptions: Array<{ value: SortBy; label: string }> = [
    {
      value: SortBy.AMOUNT_DESC,
      label: t('delinquent.filters.sortBy.amountDesc'),
    },
    {
      value: SortBy.AMOUNT_ASC,
      label: t('delinquent.filters.sortBy.amountAsc'),
    },
    { value: SortBy.DAYS_DESC, label: t('delinquent.filters.sortBy.daysDesc') },
    { value: SortBy.DAYS_ASC, label: t('delinquent.filters.sortBy.daysAsc') },
    { value: SortBy.NAME_ASC, label: t('delinquent.filters.sortBy.nameAsc') },
  ]

  return (
    <Card>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('delinquent.filters.debtorType')}
              value={filters.debtorType ?? ''}
              onChange={(e) =>
                onUpdateFilters({
                  debtorType: (e.target.value || null) as DebtorType | null,
                })
              }
            >
              {debtorTypeOptions.map((option) => (
                <MenuItem
                  key={option.value ?? 'all'}
                  value={option.value ?? ''}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('delinquent.filters.sortBy.label')}
              value={filters.sortBy ?? SortBy.DAYS_DESC}
              onChange={(e) =>
                onUpdateFilters({ sortBy: e.target.value as SortBy })
              }
            >
              {sortByOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              size="small"
              label={t('delinquent.filters.minAmount')}
              value={filters.minAmount ?? 0}
              onChange={(e) =>
                onUpdateFilters({ minAmount: Number(e.target.value) })
              }
              inputProps={{ min: 0, step: 10 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Clear />}
              onClick={onResetFilters}
              fullWidth
            >
              {t('delinquent.filters.reset')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
