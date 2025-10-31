import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tabs, Tab, Grid, Paper, Typography, Alert } from '@mui/material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchProfile,
  fetchSkills,
  fetchTags,
  fetchPrivacySettings,
} from '../../store/profile/profileSlice';
import Layout from '../../components/common/Layout';
import ProfileHeader from '../../components/profile/ProfileHeader';
import SkillCard from '../../components/profile/SkillCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ProfileViewPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, skills, tags, isLoading, error } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);

  const isOwnProfile = user?.id === Number(userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(Number(userId)));
      dispatch(fetchSkills(Number(userId)));
      dispatch(fetchTags(Number(userId)));
      if (isOwnProfile) {
        dispatch(fetchPrivacySettings(Number(userId)));
      }
    }
  }, [userId, dispatch, isOwnProfile]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading && !profile) {
    return (
      <Layout>
        <Typography>Загрузка профиля...</Typography>
      </Layout>
    );
  }

  if (error && !profile) {
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <Typography>Профиль не найден</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProfileHeader
        profile={profile}
        trustScore={75} // TODO: получить из reputation модуля
        reputationLevel="Эксперт"
        isOwnProfile={isOwnProfile}
        onEditClick={() => navigate(`/profile/${userId}/edit`)}
      />

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="О себе" />
          <Tab label="Навыки" />
          <Tab label="Отзывы" />
          <Tab label="Активность" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box>
            {profile.bio && (
              <Typography variant="body1" paragraph>
                {profile.bio}
              </Typography>
            )}
            {!profile.bio && isOwnProfile && (
              <Typography variant="body2" color="text.secondary">
                Добавьте информацию о себе в разделе редактирования профиля
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Контакты
              </Typography>
              {profile.email && (
                <Typography variant="body2">
                  <strong>Email:</strong> {profile.email}
                </Typography>
              )}
              {profile.telegram && (
                <Typography variant="body2">
                  <strong>Telegram:</strong> {profile.telegram}
                </Typography>
              )}
            </Box>

            {tags.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Теги
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag) => (
                    <Typography
                      key={tag.id}
                      variant="body2"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {tag.name}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {skills.length > 0 ? (
            <Grid container spacing={3}>
              {skills.map((skill) => (
                <Grid item xs={12} sm={6} md={4} key={skill.id}>
                  <SkillCard skill={skill} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              Навыки не добавлены
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="body2" color="text.secondary" align="center">
            Отзывы будут отображаться здесь (интеграция с модулем репутации)
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            График активности и статистика (будет реализовано)
          </Typography>
        </TabPanel>
      </Paper>
    </Layout>
  );
};

export default ProfileViewPage;

