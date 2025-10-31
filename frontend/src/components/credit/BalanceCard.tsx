import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { AccountBalanceWallet, Lock, TrendingUp, TrendingDown } from '@mui/icons-material';
import { CreditBalance } from '../../types/credit';

interface BalanceCardProps {
  balance: CreditBalance;
  stats?: {
    receivedMonth?: number;
    spentMonth?: number;
    feesPaid?: number;
    bonusesReceived?: number;
  };
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, stats }) => {
  const totalBalance = balance.availableBalance + balance.reservedBalance;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Общий баланс
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {totalBalance.toFixed(0)} ₿
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Доступно
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {balance.availableBalance.toFixed(0)} ₿
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Зарезервировано
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock sx={{ fontSize: 20 }} />
                    {balance.reservedBalance.toFixed(0)} ₿
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {stats && (
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статистика
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="success" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Получено (месяц)
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="success.main">
                    +{stats.receivedMonth?.toFixed(0) || 0} ₿
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingDown color="error" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Потрачено (месяц)
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="error.main">
                    -{stats.spentMonth?.toFixed(0) || 0} ₿
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Комиссия уплачена
                  </Typography>
                  <Typography variant="body1">
                    {stats.feesPaid?.toFixed(0) || 0} ₿
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Бонусы получены
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    +{stats.bonusesReceived?.toFixed(0) || 0} ₿
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default BalanceCard;

