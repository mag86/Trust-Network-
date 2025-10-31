import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import Layout from '../../components/common/Layout';

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Добро пожаловать в Trust Network!</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Здесь будет главная страница с лентой задач, статистикой и быстрыми действиями.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default DashboardPage;

