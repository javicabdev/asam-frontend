import { Box, Typography, Button, Alert, Chip, Stack } from '@mui/material';
import { 
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { MembersTable } from '@/features/members/components/MembersTable';
import { MembersFilters } from '@/features/members/components/MembersFilters';
import { useMembersTable } from '@/features/members/hooks/useMembersTable';

export default function MembersPage() {
  const navigate = useNavigate();
  const {
    members,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    filter,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleRowClick,
    handleFilterChange,
    handleSelectionChange,
    selectedMembers,
    refetch,
  } = useMembersTable();

  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete
    console.log('Bulk delete:', selectedMembers);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Socios
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Total: {totalCount} socios
            </Typography>
            {selectedMembers.length > 0 && (
              <Chip
                label={`${selectedMembers.length} seleccionados`}
                color="primary"
                size="small"
              />
            )}
          </Stack>
        </Box>
        <Stack direction="row" spacing={2}>
          {selectedMembers.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBulkDelete}
            >
              Eliminar ({selectedMembers.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/members/new')}
          >
            Nuevo Socio
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <MembersFilters onFilterChange={handleFilterChange} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los socios: {error.message}
        </Alert>
      )}

      {/* Table */}
      <MembersTable
        members={members}
        totalCount={totalCount}
        loading={loading}
        page={page}
        pageSize={pageSize}
        filters={filter}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        selectable={true}
      />
    </Box>
  );
}
