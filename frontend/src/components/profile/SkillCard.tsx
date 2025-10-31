import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, LinearProgress } from '@mui/material';
import { Delete as DeleteIcon, Verified as VerifiedIcon } from '@mui/icons-material';
import { Skill } from '../../types/profile';

interface SkillCardProps {
  skill: Skill;
  onDelete?: (skillId: number) => void;
  showActions?: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onDelete, showActions = false }) => {
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      TECHNICAL: 'Технические',
      CREATIVE: 'Творческие',
      HOUSEHOLD: 'Бытовые',
      EDUCATIONAL: 'Образовательные',
      BUSINESS: 'Бизнес',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      TECHNICAL: '#6366F1',
      CREATIVE: '#EC4899',
      HOUSEHOLD: '#F59E0B',
      EDUCATIONAL: '#10B981',
      BUSINESS: '#8B5CF6',
    };
    return colors[category] || '#6B7280';
  };

  const getVerificationIcon = (type: string) => {
    if (type === 'TASK_VERIFIED' || type === 'PLATFORM_TESTED' || type === 'RECOMMENDED') {
      return <VerifiedIcon fontSize="small" color="primary" />;
    }
    return null;
  };

  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Box
        key={index}
        component="span"
        sx={{
          color: index < level ? '#F59E0B' : '#E5E7EB',
          fontSize: '1.2rem',
        }}
      >
        ★
      </Box>
    ));
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {skill.name}
          </Typography>
          {showActions && onDelete && (
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(skill.id)}
              aria-label="удалить навык"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Chip
          label={getCategoryLabel(skill.category)}
          size="small"
          sx={{
            bgcolor: getCategoryColor(skill.category),
            color: 'white',
            mb: 2,
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box>{renderStars(skill.level)}</Box>
          <Typography variant="body2" color="text.secondary">
            Уровень {skill.level}/5
          </Typography>
          {getVerificationIcon(skill.verificationType)}
        </Box>

        <LinearProgress
          variant="determinate"
          value={(skill.level / 5) * 100}
          sx={{ height: 8, borderRadius: 1, mb: 1 }}
        />

        <Typography variant="caption" color="text.secondary">
          {skill.verificationType === 'TASK_VERIFIED' && 'Верифицировано через задачи'}
          {skill.verificationType === 'PLATFORM_TESTED' && 'Платформенное тестирование'}
          {skill.verificationType === 'RECOMMENDED' && 'Рекомендации от пользователей'}
          {skill.verificationType === 'SELF_ASSESSED' && 'Самооценка'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SkillCard;

