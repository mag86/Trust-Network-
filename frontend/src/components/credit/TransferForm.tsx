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
  Alert,
  InputAdornment,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { TransferRequest } from '../../types/credit';

interface TransferFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transfer: TransferRequest) => void;
  balance: number;
  isLoading?: boolean;
}

const TransferForm: React.FC<TransferFormProps> = ({ open, onClose, onSubmit, balance, isLoading }) => {
  const [formData, setFormData] = useState<TransferRequest>({
    toUserId: 0,
    amount: 0,
    description: '',
  });
  const [errors, setErrors] = useState<{ toUserId?: string; amount?: string }>({});
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateFee = (amount: number) => {
    const feeRate = 0.05; // 5%
    return Math.max(amount * feeRate, 1); // минимум 1 кредит
  };

  const handleAmountChange = (value: number) => {
    const newFee = calculateFee(value);
    const newTotal = value + newFee;
    setFormData({ ...formData, amount: value });
    setFee(newFee);
    setTotal(newTotal);
  };

  const validateForm = (): boolean => {
    const newErrors: { toUserId?: string; amount?: string } = {};

    if (!formData.toUserId || formData.toUserId <= 0) {
      newErrors.toUserId = 'ID пользователя обязателен';
    }

    if (!formData.amount || formData.amount < 1) {
      newErrors.amount = 'Минимальная сумма: 1 кредит';
    } else if (formData.amount > 1000) {
      newErrors.amount = 'Максимальная сумма: 1000 кредитов';
    } else if (total > balance) {
      newErrors.amount = `Недостаточно средств. Доступно: ${balance.toFixed(0)} ₿, требуется: ${total.toFixed(0)} ₿`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Сброс формы
      setFormData({ toUserId: 0, amount: 0, description: '' });
      setFee(0);
      setTotal(0);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon />
            <Typography variant="h6">Перевод кредитов</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ID получателя"
            type="number"
            value={formData.toUserId || ''}
            onChange={(e) => setFormData({ ...formData, toUserId: Number(e.target.value) })}
            error={!!errors.toUserId}
            helperText={errors.toUserId || 'ID пользователя или отображаемое имя'}
            margin="normal"
            required
            autoFocus
          />

          <TextField
            fullWidth
            label="Сумма перевода"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            error={!!errors.amount}
            helperText={errors.amount || 'От 1 до 1000 кредитов'}
            margin="normal"
            required
            InputProps={{
              endAdornment: <InputAdornment position="end">₿</InputAdornment>,
              inputProps: { min: 1, max: 1000, step: 1 },
            }}
          />

          {formData.amount > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Комиссия (5%):</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {fee.toFixed(2)} ₿
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" fontWeight="bold">
                  Итого к списанию:
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={total > balance ? 'error' : 'primary'}>
                  {total.toFixed(2)} ₿
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Доступно: {balance.toFixed(0)} ₿
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Описание (опционально)"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            inputProps={{ maxLength: 500 }}
            helperText={`${formData.description.length}/500 символов`}
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Дневной лимит переводов: 5,000 кредитов. Комиссия 5% (минимум 1 кредит).
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SendIcon />}
            sx={{ bgcolor: '#6366F1' }}
            disabled={isLoading || total > balance}
          >
            {isLoading ? 'Отправка...' : 'Перевести'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferForm;

