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
} from '@mui/material';
import { SkillAddRequest } from '../../types/profile';

interface SkillFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (skill: SkillAddRequest) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<SkillAddRequest>({
    name: '',
    category: 'TECHNICAL',
    level: 1,
    verificationType: 'SELF_ASSESSED',
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Название навыка обязательно' });
      return;
    }
    onSubmit(formData);
    setFormData({ name: '', category: 'TECHNICAL', level: 1, verificationType: 'SELF_ASSESSED' });
    setErrors({});
    onClose();
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Box
        key={index}
        component="span"
        onClick={() => setFormData({ ...formData, level: (index + 1) as 1 | 2 | 3 | 4 | 5 })}
        sx={{
          color: index < level ? '#F59E0B' : '#E5E7EB',
          fontSize: '2rem',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.1)' },
        }}
      >
        ★
      </Box>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Добавить навык</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название навыка"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
            autoFocus
          />

          <TextField
            fullWidth
            select
            label="Категория"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            margin="normal"
            required
          >
            <MenuItem value="TECHNICAL">Технические</MenuItem>
            <MenuItem value="CREATIVE">Творческие</MenuItem>
            <MenuItem value="HOUSEHOLD">Бытовые</MenuItem>
            <MenuItem value="EDUCATIONAL">Образовательные</MenuItem>
            <MenuItem value="BUSINESS">Бизнес</MenuItem>
          </TextField>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Уровень владения
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
              {renderStars(formData.level)}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formData.level === 1 && 'Новичок - базовые знания'}
              {formData.level === 2 && 'Опытный - уверенное владение'}
              {formData.level === 3 && 'Продвинутый - профессиональный уровень'}
              {formData.level === 4 && 'Эксперт - углубленные знания'}
              {formData.level === 5 && 'Мастер - признанный специалист'}
            </Typography>
          </Box>

          <TextField
            fullWidth
            select
            label="Тип верификации"
            value={formData.verificationType}
            onChange={(e) => setFormData({ ...formData, verificationType: e.target.value as any })}
            margin="normal"
          >
            <MenuItem value="SELF_ASSESSED">Самооценка</MenuItem>
            <MenuItem value="PLATFORM_TESTED">Платформенное тестирование</MenuItem>
            <MenuItem value="TASK_VERIFIED">Верификация через задачи</MenuItem>
            <MenuItem value="RECOMMENDED">Рекомендации</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6366F1' }}>
            Добавить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SkillForm;

