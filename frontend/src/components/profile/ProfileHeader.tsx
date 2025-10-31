import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Avatar, Typography, Chip, Grid, Paper, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { UserProfile } from '../../types/profile';

interface ProfileHeaderProps {
  profile: UserProfile;
  trustScore?: number;
  reputationLevel?: string;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  trustScore = 0,
  reputationLevel = 'Новичок',
  isOwnProfile = false,
  onEditClick,
}) => {
  const navigate = useNavigate();
  
  const getReputationColor = (level: string) => {
    if (level.includes('Мастер')) return '#10B981'; // зеленый
    if (level.includes('Эксперт')) return '#3B82F6'; // синий
    if (level.includes('Опытный')) return '#F59E0B'; // желтый
    return '#EF4444'; // красный
  };

  return (
    <Paper
      sx={{
        position: 'relative',
        background: profile.backgroundUrl
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${profile.backgroundUrl})`
          : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        p: 4,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Avatar
          src={profile.avatarUrl}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            cursor: profile.avatarUrl ? 'zoom-in' : 'default',
          }}
        >
          {profile.displayName.charAt(0).toUpperCase()}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1">
              {profile.displayName}
            </Typography>
            {isOwnProfile && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEditClick}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}
              >
                Редактировать
              </Button>
            )}
          </Box>

          <Chip
            label={reputationLevel}
            onClick={() => navigate(`/reputation/${profile.userId}`)}
            sx={{
              bgcolor: getReputationColor(reputationLevel),
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Box
                onClick={() => navigate(`/reputation/${profile.userId}`)}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Trust Score
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {trustScore}/100
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Просмотры профиля
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {profile.viewCount}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Приватность
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {profile.privacyLevel === 'PUBLIC' ? 'Публичный' :
                 profile.privacyLevel === 'REGISTERED_ONLY' ? 'Только участникам' :
                 profile.privacyLevel === 'LIMITED' ? 'Ограниченный' : 'Приватный'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;

