import { Box, Typography, Button, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { MembersTable } from '@/features/members/components/MembersTable';
import { MembersFilters } from '@/features/members/components/MembersFilters';
import { useMembersTable } from '@/features/members/hooks/useMembersTable';

export default function MembersPage() {
  const {
    members,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleRowClick,
    handleFilterChange,
  } = useMembersTable();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Socios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Implement in next requirement
            console.log('Add new member');
          }}
        >
          Nuevo Socio
        </Button>
      </Box>

      <MembersFilters onFilterChange={handleFilterChange} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los socios: {error.message}
        </Alert>
      )}

      <MembersTable
        members={members}
        totalCount={totalCount}
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
      />
    </Box>
  );
}
