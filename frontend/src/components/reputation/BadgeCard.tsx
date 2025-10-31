import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { EmojiEvents, Stars } from '@mui/icons-material';
import { Badge } from '../../types/reputation';
import { format } from 'date-fns';

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const getBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      ACTIVITY: '#6366F1',
      QUALITY: '#10B981',
      COMMUNITY: '#F59E0B',
      SPECIALIZATION: '#EC4899',
    };
    return colors[type] || '#6B7280';
  };

  const getBadgeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ACTIVITY: 'Активность',
      QUALITY: 'Качество',
      COMMUNITY: 'Сообщество',
      SPECIALIZATION: 'Специализация',
    };
    return labels[type] || type;
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      {badge.isRare && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <Chip
            icon={<Stars />}
            label="Редкий"
            size="small"
            color="warning"
          />
        </Box>
      )}
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: `${getBadgeColor(badge.type)}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <EmojiEvents sx={{ fontSize: 32, color: getBadgeColor(badge.type) }} />
          </Box>

          <Typography variant="h6" component="h3" gutterBottom>
            {badge.name}
          </Typography>

          <Chip
            label={getBadgeLabel(badge.type)}
            size="small"
            sx={{
              bgcolor: getBadgeColor(badge.type),
              color: 'white',
              mb: 2,
            }}
          />

          <Typography variant="body2" color="text.secondary" paragraph>
            {badge.description}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Получено: {format(new Date(badge.earnedAt), 'dd MMM yyyy')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BadgeCard;

