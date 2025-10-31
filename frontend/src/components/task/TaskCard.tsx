import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Person,
  AttachMoney,
  ArrowForward,
} from '@mui/icons-material';
import { Task } from '../../types/task';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  currentUserId?: number;
  onBidClick?: (taskId: number) => void;
  onViewClick?: (taskId: number) => void;
  showDistance?: boolean;
  distance?: number;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUserId,
  onBidClick,
  onViewClick,
  showDistance = false,
  distance,
}) => {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      WORK: 'Работа',
      STUDY: 'Обучение',
      VOLUNTEER: 'Волонтерство',
      DELIVERY: 'Доставка',
      SERVICES: 'Услуги',
      OTHER: 'Прочее',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      WORK: '#6366F1',
      STUDY: '#10B981',
      VOLUNTEER: '#F59E0B',
      DELIVERY: '#EC4899',
      SERVICES: '#8B5CF6',
      OTHER: '#6B7280',
    };
    return colors[category] || '#6B7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
      case 'EXPIRED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: 'Черновик',
      OPEN: 'Открыта',
      IN_PROGRESS: 'В работе',
      COMPLETED: 'Выполнена',
      CANCELLED: 'Отменена',
      EXPIRED: 'Просрочена',
    };
    return labels[status] || status;
  };

  const isOwnTask = task.creatorId === currentUserId;
  const canBid = task.status === 'OPEN' && !isOwnTask;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {task.title}
            </Typography>
            <Chip
              label={getCategoryLabel(task.category)}
              size="small"
              sx={{
                bgcolor: getCategoryColor(task.category),
                color: 'white',
                mr: 1,
              }}
            />
            <Chip
              label={getStatusLabel(task.status)}
              size="small"
              color={getStatusColor(task.status) as any}
            />
          </Box>
          {onViewClick && (
            <IconButton size="small" onClick={() => onViewClick(task.id)}>
              <ArrowForward />
            </IconButton>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney color="primary" fontSize="small" />
            <Typography variant="body1" fontWeight="bold">
              {task.creditReward} ₿
            </Typography>
          </Box>

          {task.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn color="error" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {task.location.address || task.location.city || 'Местоположение указано'}
                {showDistance && distance !== undefined && ` • ${distance.toFixed(1)} км`}
              </Typography>
            </Box>
          )}

          {task.deadline && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="warning" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                До {format(new Date(task.deadline), 'dd MMM yyyy')}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Создатель: ID {task.creatorId}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {format(new Date(task.createdAt), 'dd MMM yyyy')}
        </Typography>
        {canBid && onBidClick && (
          <Button
            variant="contained"
            size="small"
            onClick={() => onBidClick(task.id)}
            sx={{ bgcolor: '#6366F1' }}
          >
            Подать заявку
          </Button>
        )}
        {isOwnTask && (
          <Typography variant="caption" color="warning.main">
            Ваша задача
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default TaskCard;

