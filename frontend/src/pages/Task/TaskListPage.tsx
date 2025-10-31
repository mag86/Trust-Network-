import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  searchTasks,
  createTask,
  createBid,
  clearError,
  setFilters,
  setPage,
} from '../../store/task/taskSlice';
import Layout from '../../components/common/Layout';
import TaskCard from '../../components/task/TaskCard';
import TaskForm from '../../components/task/TaskForm';
import BidForm from '../../components/task/BidForm';
import FloatingActionButton from '../../components/common/FloatingActionButton';
import { TaskCreateRequest } from '../../types/task';

const TaskListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading, error, filters, pagination } = useSelector((state: RootState) => state.task);
  const { user } = useSelector((state: RootState) => state.auth);
  const { balance } = useSelector((state: RootState) => state.credit);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [bidFormOpen, setBidFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(searchTasks({ status: 'OPEN', page: 0, size: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id && !balance) {
      // Загрузить баланс для проверки при создании задачи
      import('../../store/credit/creditSlice').then((module) => {
        dispatch(module.fetchBalance(user.id));
      });
    }
  }, [user, balance, dispatch]);

  const handleCreateTask = async (task: TaskCreateRequest) => {
    if (user?.id) {
      try {
        await dispatch(createTask({ userId: user.id, task })).unwrap();
        setTaskFormOpen(false);
      } catch (err) {
        // Ошибка обрабатывается в Redux
      }
    }
  };

  const handleBidClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setBidFormOpen(true);
  };

  const handleFilterChange = (filterType: string, value: string | number) => {
    const newFilters = { ...filters, [filterType]: value || undefined };
    dispatch(setFilters(newFilters));
    dispatch(searchTasks({ ...newFilters, status: 'OPEN', page: 0, size: 20 }));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPage(page - 1));
    dispatch(searchTasks({ ...filters, status: 'OPEN', page: page - 1, size: 20 }));
  };

  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Лента задач</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTaskFormOpen(true)}
          sx={{ bgcolor: '#6366F1' }}
        >
          Создать задачу
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Поиск"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // TODO: реализовать поиск через API
              }}
              placeholder="По названию или описанию"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Категория"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">Все категории</MenuItem>
              <MenuItem value="WORK">Работа</MenuItem>
              <MenuItem value="STUDY">Обучение</MenuItem>
              <MenuItem value="VOLUNTEER">Волонтерство</MenuItem>
              <MenuItem value="DELIVERY">Доставка</MenuItem>
              <MenuItem value="SERVICES">Услуги</MenuItem>
              <MenuItem value="OTHER">Прочее</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Мин. цена"
              type="number"
              value={filters.minCredit || ''}
              onChange={(e) => handleFilterChange('minCredit', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Макс. цена"
              type="number"
              value={filters.maxCredit || ''}
              onChange={(e) => handleFilterChange('maxCredit', Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <TextField
              fullWidth
              label="Радиус (км)"
              type="number"
              value={filters.radius || ''}
              onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
            />
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Задачи не найдены
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <TaskCard
                  task={task}
                  currentUserId={user?.id}
                  onBidClick={handleBidClick}
                />
              </Grid>
            ))}
          </Grid>
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

      <TaskForm
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isLoading}
        balance={balance?.availableBalance || 0}
      />

      {selectedTask && (
        <BidForm
          open={bidFormOpen}
          onClose={() => {
            setBidFormOpen(false);
            setSelectedTaskId(null);
          }}
          onSubmit={async (bid) => {
            if (user?.id && selectedTaskId) {
              try {
                await dispatch(createBid({ taskId: selectedTaskId, userId: user.id, bid })).unwrap();
                setBidFormOpen(false);
                setSelectedTaskId(null);
              } catch (err) {
                // Ошибка обрабатывается в Redux
              }
            }
          }}
          taskTitle={selectedTask.title}
          isLoading={isLoading}
        />
      )}

      <FloatingActionButton
        icon="add"
        onClick={() => setTaskFormOpen(true)}
        label="Создать задачу"
      />
    </Layout>
  );
};

export default TaskListPage;

