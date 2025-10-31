import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store, RootState } from './store/store';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProfileViewPage from './pages/Profile/ProfileViewPage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import CreditDashboardPage from './pages/Credit/CreditDashboardPage';
import TaskListPage from './pages/Task/TaskListPage';
import GeolocationPage from './pages/Geolocation/GeolocationPage';
import ReputationPage from './pages/Reputation/ReputationPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366F1', // Индиго
    },
    secondary: {
      main: '#10B981', // Зеленый
    },
    background: {
      default: '#F9FAFB',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <PrivateRoute>
                  <ProfileViewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/:userId/edit"
              element={
                <PrivateRoute>
                  <ProfileEditPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/credits"
              element={
                <PrivateRoute>
                  <CreditDashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TaskListPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/geolocation"
              element={
                <PrivateRoute>
                  <GeolocationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reputation/:userId"
              element={
                <PrivateRoute>
                  <ReputationPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
