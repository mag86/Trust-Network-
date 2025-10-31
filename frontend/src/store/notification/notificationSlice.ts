import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { Notification } from '../../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (userId: number) => {
    const response = await apiClient.get(`/notifications/${userId}`);
    return response.data;
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async ({ notificationId, userId }: { notificationId: number; userId: number }) => {
    await apiClient.put(`/notifications/${notificationId}/read`, null, {
      params: { userId },
    });
    return notificationId;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (userId: number) => {
    await apiClient.put(`/notifications/${userId}/read-all`);
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async ({ notificationId, userId }: { notificationId: number; userId: number }) => {
    await apiClient.delete(`/notifications/${notificationId}`, {
      params: { userId },
    });
    return notificationId;
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications || action.payload || [];
        state.unreadCount = action.payload.unreadCount || state.notifications.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки уведомлений';
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => (n.isRead = true));
        state.unreadCount = 0;
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      });
  },
});

export const { addNotification, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;

