import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Rating,
  Alert,
} from '@mui/material';
import { ReviewCreateRequest } from '../../types/reputation';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewCreateRequest) => void;
  isLoading?: boolean;
  taskTitle: string;
  isExecutor?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading,
  taskTitle,
  isExecutor = false,
}) => {
  const [formData, setFormData] = useState<ReviewCreateRequest>({
    qualityRating: 0,
    timelinessRating: 0,
    communicationRating: 0,
    valueRating: 0,
    publicComment: '',
    privateComment: '',
  });
  const [errors, setErrors] = useState<{ ratings?: string }>({});

  const calculateOverallRating = () => {
    const weights = { quality: 0.4, timeliness: 0.3, communication: 0.2, value: 0.1 };
    const overall =
      formData.qualityRating * weights.quality +
      formData.timelinessRating * weights.timeliness +
      formData.communicationRating * weights.communication +
      formData.valueRating * weights.value;
    return overall;
  };

  const validateForm = (): boolean => {
    const newErrors: { ratings?: string } = {};

    if (
      formData.qualityRating === 0 ||
      formData.timelinessRating === 0 ||
      formData.communicationRating === 0 ||
      formData.valueRating === 0
    ) {
      newErrors.ratings = 'Все оценки обязательны';
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
        qualityRating: 0,
        timelinessRating: 0,
        communicationRating: 0,
        valueRating: 0,
        publicComment: '',
        privateComment: '',
      });
      setErrors({});
      onClose();
    }
  };

  const overallRating = calculateOverallRating();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Оставить отзыв</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Задача: <strong>{taskTitle}</strong>
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Качество работы (40% веса)
            </Typography>
            <Rating
              value={formData.qualityRating}
              onChange={(_, newValue) =>
                setFormData({ ...formData, qualityRating: newValue || 0 })
              }
              precision={0.5}
              max={5}
              size="large"
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Соблюдение сроков (30% веса)
            </Typography>
            <Rating
              value={formData.timelinessRating}
              onChange={(_, newValue) =>
                setFormData({ ...formData, timelinessRating: newValue || 0 })
              }
              precision={0.5}
              max={5}
              size="large"
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Коммуникация (20% веса)
            </Typography>
            <Rating
              value={formData.communicationRating}
              onChange={(_, newValue) =>
                setFormData({ ...formData, communicationRating: newValue || 0 })
              }
              precision={0.5}
              max={5}
              size="large"
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Соотношение цена/качество (10% веса)
            </Typography>
            <Rating
              value={formData.valueRating}
              onChange={(_, newValue) =>
                setFormData({ ...formData, valueRating: newValue || 0 })
              }
              precision={0.5}
              max={5}
              size="large"
            />
          </Box>

          {overallRating > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2">
                Общая оценка: <strong>{overallRating.toFixed(2)}/5.0</strong>
              </Typography>
            </Box>
          )}

          {errors.ratings && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.ratings}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Публичный комментарий"
            multiline
            rows={3}
            value={formData.publicComment}
            onChange={(e) => setFormData({ ...formData, publicComment: e.target.value })}
            margin="normal"
            helperText="Будет виден всем пользователям (до 1000 символов)"
            inputProps={{ maxLength: 1000 }}
          />

          {isExecutor && (
            <TextField
              fullWidth
              label="Приватный комментарий (только для исполнителя)"
              multiline
              rows={2}
              value={formData.privateComment}
              onChange={(e) => setFormData({ ...formData, privateComment: e.target.value })}
              margin="normal"
              helperText="Будет виден только исполнителю задачи (до 500 символов)"
              inputProps={{ maxLength: 500 }}
            />
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            Вы можете редактировать отзыв только в течение 24 часов после создания. Можно оставить только 1 отзыв на задачу.
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
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Опубликовать отзыв'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReviewForm;

