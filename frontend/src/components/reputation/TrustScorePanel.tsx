import React from 'react';
import { Paper, Typography, Box, LinearProgress, Chip, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { TrustScore, ReputationLevel } from '../../types/reputation';

interface TrustScorePanelProps {
  trustScore: TrustScore;
  trend?: 'up' | 'down' | 'stable';
  averagePlatformScore?: number;
}

const TrustScorePanel: React.FC<TrustScorePanelProps> = ({
  trustScore,
  trend = 'stable',
  averagePlatformScore = 60,
}) => {
  const getLevelInfo = (level: ReputationLevel) => {
    const levels: Record<ReputationLevel, { label: string; color: string; emoji: string; range: string }> = {
      NOVICE: {
        label: 'Новичок',
        color: '#EF4444',
        emoji: '🔴',
        range: '0-29',
      },
      EXPERIENCED: {
        label: 'Опытный',
        color: '#F59E0B',
        emoji: '🟨',
        range: '30-59',
      },
      EXPERT: {
        label: 'Эксперт',
        color: '#3B82F6',
        emoji: '🟦',
        range: '60-84',
      },
      MASTER: {
        label: 'Мастер',
        color: '#10B981',
        emoji: '🟩',
        range: '85-100',
      },
    };
    return levels[level];
  };

  const levelInfo = getLevelInfo(trustScore.level);
  const scorePercentage = trustScore.score;
  const isAboveAverage = trustScore.score > averagePlatformScore;

  return (
    <Paper sx={{ p: 3, background: `linear-gradient(135deg, ${levelInfo.color}15 0%, ${levelInfo.color}05 100%)` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {levelInfo.emoji} {levelInfo.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Trust Score: {trustScore.score.toFixed(1)}/100 ({levelInfo.range})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend === 'up' && <TrendingUp color="success" />}
          {trend === 'down' && <TrendingDown color="error" />}
          {trend === 'stable' && <TrendingFlat color="disabled" />}
          <Chip
            label={isAboveAverage ? 'Выше среднего' : 'Ниже среднего'}
            size="small"
            color={isAboveAverage ? 'success' : 'default'}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={scorePercentage}
          sx={{
            height: 20,
            borderRadius: 10,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: levelInfo.color,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Сравнение с платформой: {averagePlatformScore.toFixed(1)}/100
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Завершенность
          </Typography>
          <Typography variant="h6">{trustScore.completionRate.toFixed(0)}%</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Средняя оценка
          </Typography>
          <Typography variant="h6">★ {trustScore.averageRating.toFixed(1)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Скорость ответов
          </Typography>
          <Typography variant="h6">{trustScore.responseRate.toFixed(0)}%</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption" color="text.secondary">
            Объем транзакций
          </Typography>
          <Typography variant="h6">{trustScore.transactionVolume.toFixed(0)} ₿</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Последнее обновление: {new Date(trustScore.lastUpdated).toLocaleDateString('ru-RU')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TrustScorePanel;

