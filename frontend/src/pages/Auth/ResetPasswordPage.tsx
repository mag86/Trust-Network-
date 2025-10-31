import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, LinearProgress } from '@mui/material';
import { AppDispatch } from '../../store/store';
import Layout from '../../components/common/Layout';
import apiClient from '../../services/api';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Токен восстановления не найден. Пожалуйста, запросите новую ссылку.');
    }
  }, [token]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof validationErrors = {};

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      errors.password = 'Пароль должен быть минимум 8 символов';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Пароль должен содержать заглавную букву';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Пароль должен содержать цифру';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setError(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/password-reset/confirm', {
        token,
        newPassword: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка сброса пароля. Токен может быть недействителен или истек.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Alert severity="success" sx={{ width: '100%' }}>
              Пароль успешно изменен! Вы будете перенаправлены на страницу входа через 3 секунды...
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!token) {
    return (
      <Layout>
        <Container maxWidth="sm">
          <Box sx={{ mt: 8 }}>
            <Alert severity="error">
              Токен восстановления не найден. Пожалуйста, запросите новую ссылку.
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
              sx={{ mt: 2, bgcolor: '#6366F1' }}
            >
              Запросить новую ссылку
            </Button>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Установка нового пароля
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Введите новый пароль для вашего аккаунта
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Новый пароль"
              type="password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={!!validationErrors.password}
              helperText={validationErrors.password || 'Минимум 8 символов, 1 заглавная буква, 1 цифра'}
              margin="normal"
              required
              autoFocus
            />

            {formData.password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                  }}
                  color={passwordStrength < 50 ? 'error' : passwordStrength < 75 ? 'warning' : 'success'}
                />
                <Typography variant="caption" color="text.secondary">
                  Надежность пароля: {passwordStrength}%
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              label="Подтверждение пароля"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              margin="normal"
              required
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              После смены пароля вы будете автоматически выйдены со всех устройств.
            </Alert>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
              disabled={isLoading}
            >
              {isLoading ? 'Смена пароля...' : 'Изменить пароль'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button variant="text" onClick={() => navigate('/login')}>
                Вернуться к входу
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ResetPasswordPage;

