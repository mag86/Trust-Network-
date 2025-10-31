import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, FormControlLabel, Checkbox, Link, Alert, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../store/auth/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import Layout from '../../components/common/Layout';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    acceptTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

    if (!formData.displayName || formData.displayName.length < 2 || formData.displayName.length > 50) {
      errors.displayName = 'Имя должно быть от 2 до 50 символов';
    }

    if (!formData.email) {
      errors.email = 'Email обязателен';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Неверный формат email';
    }

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

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Необходимо принять условия';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    dispatch(clearError());
    
    try {
      await dispatch(register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      })).unwrap();
      
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      // Ошибка обрабатывается в Redux
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Регистрация
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Начальный бонус: 100 кредитов доверия
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              fullWidth
              label="Отображаемое имя"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              error={!!validationErrors.displayName}
              helperText={validationErrors.displayName}
              margin="normal"
              required
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={async () => {
                // TODO: Проверка уникальности email через API
              }}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              required
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={!!validationErrors.password}
              helperText={validationErrors.password || 'Минимум 8 символов, 1 заглавная буква, 1 цифра'}
              margin="normal"
              required
              autoComplete="new-password"
            />

            {formData.password && (
              <Box sx={{ mt: 1, mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={passwordStrength} 
                  sx={{ height: 8, borderRadius: 1 }}
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
              autoComplete="new-password"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  Я принимаю{' '}
                  <Link href="/terms" target="_blank">
                    пользовательское соглашение
                  </Link>
                </Typography>
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#6366F1', '&:hover': { bgcolor: '#4F46E5' } }}
              disabled={isLoading || !formData.acceptTerms}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Уже есть аккаунт?{' '}
                <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                  Войти
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default RegisterPage;

