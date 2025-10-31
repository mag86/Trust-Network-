import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { BidCreateRequest } from '../../types/task';

interface BidFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bid: BidCreateRequest) => void;
  isLoading?: boolean;
  taskTitle: string;
}

const BidForm: React.FC<BidFormProps> = ({ open, onClose, onSubmit, isLoading, taskTitle }) => {
  const [formData, setFormData] = useState<BidCreateRequest>({
    message: '',
    proposedDeadline: '',
    portfolioUrl: '',
  });
  const [errors, setErrors] = useState<{ message?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { message?: string } = {};

    if (!formData.message || formData.message.length < 10) {
      newErrors.message = 'Минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ message: '', proposedDeadline: '', portfolioUrl: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Подать заявку на задачу</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Задача: <strong>{taskTitle}</strong>
          </Typography>

          <TextField
            fullWidth
            label="Сообщение создателю"
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            error={!!errors.message}
            helperText={errors.message || 'Расскажите, почему вы подходите для выполнения задачи'}
            margin="normal"
            required
            autoFocus
            inputProps={{ maxLength: 1000 }}
          />

          <TextField
            fullWidth
            label="Предлагаемый срок выполнения (опционально)"
            type="datetime-local"
            value={formData.proposedDeadline}
            onChange={(e) => setFormData({ ...formData, proposedDeadline: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Ссылка на портфолио (опционально)"
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            margin="normal"
            placeholder="https://..."
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Максимум 10 активных заявок одновременно. Вы можете подать только 1 заявку на эту задачу.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#6366F1' }}
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Подать заявку'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BidForm;

