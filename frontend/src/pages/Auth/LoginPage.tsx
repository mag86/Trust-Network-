import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, FormControlLabel, Checkbox, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/auth/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import Layout from '../../components/common/Layout';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    dispatch(clearError());
    
    try {
      await dispatch(login(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Ошибка обрабатывается в Redux
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Вход в систему
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              margin="normal"
              required
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <Button size="small" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Скрыть' : 'Показать'}
                  </Button>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
              }
              label="Запомнить меня"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component="button" variant="body2" onClick={() => navigate('/forgot-password')}>
                Забыли пароль?
              </Link>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Нет аккаунта?{' '}
                <Link component="button" variant="body2" onClick={() => navigate('/register')}>
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage;

