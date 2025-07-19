import {
  Skeleton,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  Paper,
} from '@mui/material';

export function MemberDetailsSkeleton() {
  return (
    <Box>
      {/* Header skeleton */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Skeleton variant="text" width={300} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>
        <Box display="flex" gap={2}>
          <Skeleton variant="rectangular" width={100} height={36} />
          <Skeleton variant="rectangular" width={100} height={36} />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
              
              <Box sx={{ '& > *': { mb: 2 } }}>
                {[...Array(5)].map((_, index) => (
                  <Box key={index}>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width="80%" height={24} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
              
              <Box sx={{ '& > *': { mb: 2 } }}>
                {[...Array(4)].map((_, index) => (
                  <Box key={index}>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width="75%" height={24} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
              
              <Box sx={{ '& > *': { mb: 2 } }}>
                {[...Array(4)].map((_, index) => (
                  <Box key={index}>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width="70%" height={24} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
              
              <Box sx={{ '& > *': { mb: 2 } }}>
                {[...Array(3)].map((_, index) => (
                  <Box key={index}>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width="60%" height={24} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
            <Divider sx={{ mb: 2 }} />
            
            {[...Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                      <Skeleton variant="text" width={200} height={20} />
                      <Skeleton variant="text" width={150} height={16} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" width={100} height={24} />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
