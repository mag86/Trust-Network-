import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Divider,
  Button,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../../store/notification/notificationSlice';
import { Notification, NotificationType } from '../../types/notification';
import { format } from 'date-fns';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading } = useSelector(
    (state: RootState) => state.notification
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    if (open && user?.id) {
      dispatch(fetchNotifications(user.id));
    }
  }, [open, user, dispatch]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'NEW_BID':
        return '📝';
      case 'TASK_STATUS_CHANGED':
        return '🔄';
      case 'INCOMING_TRANSFER':
        return '💰';
      case 'NEW_REVIEW':
        return '⭐';
      case 'BONUS_AWARDED':
        return '🎁';
      case 'BADGE_EARNED':
        return '🏆';
      case 'TASK_NEARBY':
        return '📍';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'NEW_BID':
      case 'TASK_STATUS_CHANGED':
        return 'primary';
      case 'INCOMING_TRANSFER':
        return 'success';
      case 'NEW_REVIEW':
        return 'warning';
      case 'BONUS_AWARDED':
      case 'BADGE_EARNED':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead && user?.id) {
      dispatch(markAsRead({ notificationId: notification.id, userId: user.id }));
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAllRead = () => {
    if (user?.id) {
      dispatch(markAllAsRead(user.id));
    }
    setAnchorEl(null);
  };

  const handleDelete = (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (user?.id) {
      dispatch(deleteNotification({ notificationId, userId: user.id }));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Уведомления</Typography>
          <Button size="small" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            Прочитать все
          </Button>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Нет уведомлений
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {notifications.slice(0, 5).map((notification) => (
              <ListItem
                key={notification.id}
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{getNotificationIcon(notification.type)}</Typography>
                      <Typography variant="subtitle2" sx={{ flex: 1 }}>
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Chip size="small" label="Новое" color={getNotificationColor(notification.type) as any} />
                      )}
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(notification.id, e)}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(notification.createdAt), 'dd MMM, HH:mm')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {notifications.length > 5 && (
          <>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); /* TODO: открыть полный список */ }}>
              Показать все уведомления ({notifications.length})
            </MenuItem>
          </>
        )}
      </Menu>

      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Центр уведомлений</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {unreadCount > 0 && (
            <Button
              fullWidth
              onClick={handleMarkAllRead}
              sx={{ mb: 2 }}
            >
              Отметить все как прочитанные
            </Button>
          )}

          <Divider sx={{ mb: 2 }} />

          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Загрузка...</Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Уведомления отсутствуют
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    mb: 1,
                    bgcolor: notification.isRead ? 'transparent' : 'primary.light',
                    borderRadius: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2">{getNotificationIcon(notification.type)}</Typography>
                        <Typography variant="subtitle2" sx={{ flex: 1 }}>
                          {notification.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(notification.createdAt), 'dd MMM yyyy, HH:mm')}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationCenter;

