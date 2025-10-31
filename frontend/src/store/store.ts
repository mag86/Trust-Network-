import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import profileReducer from './profile/profileSlice';
import creditReducer from './credit/creditSlice';
import taskReducer from './task/taskSlice';
import geolocationReducer from './geolocation/geolocationSlice';
import reputationReducer from './reputation/reputationSlice';
import notificationReducer from './notification/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    credit: creditReducer,
    task: taskReducer,
    geolocation: geolocationReducer,
    reputation: reputationReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

