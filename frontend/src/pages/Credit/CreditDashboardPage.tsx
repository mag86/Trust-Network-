import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  Pagination,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, History as HistoryIcon, Send as SendIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import { fetchBalance, fetchTransactions, createTransfer, clearError, setFilters } from '../../store/credit/creditSlice';
import Layout from '../../components/common/Layout';
import BalanceCard from '../../components/credit/BalanceCard';
import TransferForm from '../../components/credit/TransferForm';
import TransactionList from '../../components/credit/TransactionList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CreditDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { balance, transactions, isLoading, error, filters, pagination } = useSelector(
    (state: RootState) => state.credit
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [transferFormOpen, setTransferFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBalance(user.id));
      dispatch(fetchTransactions({ userId: user.id }));
    }
  }, [user, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTransfer = async (transfer: { toUserId: number; amount: number; description?: string }) => {
    if (user?.id) {
      try {
        await dispatch(createTransfer({ userId: user.id, transfer })).unwrap();
        setTransferFormOpen(false);
        // Обновить баланс и транзакции
        dispatch(fetchBalance(user.id));
        dispatch(fetchTransactions({ userId: user.id }));
      } catch (err) {
        // Ошибка обрабатывается в Redux
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    if (user?.id) {
      dispatch(setFilters({ ...filters, page }));
      dispatch(fetchTransactions({ userId: user.id, page: page - 1 }));
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value || undefined };
    dispatch(setFilters(newFilters));
    if (user?.id) {
      dispatch(fetchTransactions({ userId: user.id }));
    }
  };

  // Вычисление статистики (заглушка, нужно получать с бэкенда)
  const stats = {
    receivedMonth: 500,
    spentMonth: 200,
    feesPaid: 25,
    bonusesReceived: 100,
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Мои кредиты</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setTransferFormOpen(true)}
            sx={{ bgcolor: '#6366F1' }}
          >
            Перевести
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {balance && <BalanceCard balance={balance} stats={stats} />}

      <Paper sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="История транзакций" />
          <Tab label="Фильтры и поиск" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Тип транзакции"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Все типы</MenuItem>
              <MenuItem value="TRANSFER">Переводы</MenuItem>
              <MenuItem value="TASK_REWARD">Награды за задачи</MenuItem>
              <MenuItem value="BONUS">Бонусы</MenuItem>
              <MenuItem value="SYSTEM_FEE">Комиссии</MenuItem>
              <MenuItem value="REFUND">Возвраты</MenuItem>
            </TextField>
            <TextField
              label="Поиск"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange('search', e.target.value);
              }}
              placeholder="По описанию или ID контрагента"
            />
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TransactionList transactions={transactions} currentUserId={user.id} />
              {pagination.total > pagination.size && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={Math.ceil(pagination.total / pagination.size)}
                    page={pagination.page + 1}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="body2" color="text.secondary">
            Расширенные фильтры (дата, диапазон сумм и т.д.) будут добавлены здесь
          </Typography>
        </TabPanel>
      </Paper>

      <TransferForm
        open={transferFormOpen}
        onClose={() => setTransferFormOpen(false)}
        onSubmit={handleTransfer}
        balance={balance?.availableBalance || 0}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default CreditDashboardPage;

