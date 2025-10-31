import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  InputAdornment,
} from '@mui/material';
import { TaskCreateRequest, TaskCategory } from '../../types/task';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: TaskCreateRequest) => void;
  isLoading?: boolean;
  balance: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, onSubmit, isLoading, balance }) => {
  const [formData, setFormData] = useState<TaskCreateRequest>({
    title: '',
    description: '',
    category: 'WORK',
    creditReward: 10,
    deadline: '',
    latitude: undefined,
    longitude: undefined,
    address: '',
  });
  const [errors, setErrors] = useState<{ title?: string; description?: string; creditReward?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string; creditReward?: string } = {};

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Минимум 3 символа';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Максимум 200 символов';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Минимум 10 символов';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Максимум 2000 символов';
    }

    if (!formData.creditReward || formData.creditReward < 10) {
      newErrors.creditReward = 'Минимальная цена: 10 кредитов';
    } else if (formData.creditReward > 1000) {
      newErrors.creditReward = 'Максимальная цена: 1000 кредитов';
    } else if (formData.creditReward > balance) {
      newErrors.creditReward = `Недостаточно средств. Доступно: ${balance.toFixed(0)} ₿`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Сброс формы
      setFormData({
        title: '',
        description: '',
        category: 'WORK',
        creditReward: 10,
        deadline: '',
        latitude: undefined,
        longitude: undefined,
        address: '',
      });
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Создать задачу</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название задачи"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title || `${formData.title.length}/200 символов`}
            margin="normal"
            required
            autoFocus
            inputProps={{ maxLength: 200 }}
          />

          <TextField
            fullWidth
            label="Описание"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description || `${formData.description.length}/2000 символов`}
            margin="normal"
            required
            inputProps={{ maxLength: 2000 }}
          />

          <TextField
            fullWidth
            select
            label="Категория"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
            margin="normal"
            required
          >
            <MenuItem value="WORK">Работа</MenuItem>
            <MenuItem value="STUDY">Обучение</MenuItem>
            <MenuItem value="VOLUNTEER">Волонтерство</MenuItem>
            <MenuItem value="DELIVERY">Доставка</MenuItem>
            <MenuItem value="SERVICES">Услуги</MenuItem>
            <MenuItem value="OTHER">Прочее</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Цена в кредитах"
            type="number"
            value={formData.creditReward}
            onChange={(e) => setFormData({ ...formData, creditReward: Number(e.target.value) })}
            error={!!errors.creditReward}
            helperText={errors.creditReward || 'От 10 до 1000 кредитов'}
            margin="normal"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">₿</InputAdornment>,
              inputProps: { min: 10, max: 1000, step: 1 },
            }}
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Доступно: {balance.toFixed(0)} ₿
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Будет зарезервировано: {formData.creditReward.toFixed(0)} ₿
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Срок выполнения (опционально)"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Адрес (опционально)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
            placeholder="Город, улица, дом"
            helperText="Можно указать местоположение или выбрать на карте"
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Кредиты будут автоматически зарезервированы при создании задачи. При отмене задачи средства вернутся на баланс.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#6366F1' }}
            disabled={isLoading || formData.creditReward > balance}
          >
            {isLoading ? 'Создание...' : 'Создать задачу'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;

