import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Link, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import Layout from '../../components/common/Layout';
import apiClient from '../../services/api';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email обязателен');
      return;
    }

    if (!validateEmail(email)) {
      setError('Неверный формат email');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/password-reset', { email });
      setSuccess(true);
      setCountdown(60); // 60 секунд таймер
      
      // Таймер обратного отсчета
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка отправки запроса на восстановление пароля');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Проверьте почту
            </Typography>
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              Письмо с инструкциями по восстановлению пароля отправлено на {email}
            </Alert>
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
              Если письмо не пришло, проверьте папку "Спам" или попробуйте еще раз через{' '}
              {countdown > 0 ? `${countdown} секунд` : 'несколько минут'}
            </Typography>
            {countdown === 0 && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                sx={{ mt: 2 }}
              >
                Отправить повторно
              </Button>
            )}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Вернуться к входу
              </Link>
            </Box>
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
            Восстановление пароля
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Введите email адрес, и мы отправим вам ссылку для восстановления пароля
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
              autoComplete="email"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
              disabled={isLoading || countdown > 0}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Отправить ссылку'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Вернуться к входу
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default ForgotPasswordPage;

