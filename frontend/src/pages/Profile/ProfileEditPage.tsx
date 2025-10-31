import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Alert,
  Divider,
  Fab,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchProfile,
  fetchSkills,
  updateProfile,
  addSkill,
  deleteSkill,
  clearError,
} from '../../store/profile/profileSlice';
import Layout from '../../components/common/Layout';
import SkillCard from '../../components/profile/SkillCard';
import SkillForm from '../../components/profile/SkillForm';
import { ProfileUpdateRequest, SkillAddRequest } from '../../types/profile';

const ProfileEditPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, skills, isLoading, error } = useSelector((state: RootState) => state.profile);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    displayName: '',
    bio: '',
    email: '',
    telegram: '',
    avatarUrl: '',
    backgroundUrl: '',
  });
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ displayName?: string }>({});

  useEffect(() => {
    if (userId && Number(userId) === user?.id) {
      dispatch(fetchProfile(Number(userId)));
      dispatch(fetchSkills(Number(userId)));
    } else {
      navigate('/profile/' + user?.id + '/edit');
    }
  }, [userId, user, dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        email: profile.email || '',
        telegram: profile.telegram || '',
        avatarUrl: profile.avatarUrl || '',
        backgroundUrl: profile.backgroundUrl || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { displayName?: string } = {};

    if (!formData.displayName || formData.displayName.length < 2 || formData.displayName.length > 50) {
      errors.displayName = 'Имя должно быть от 2 до 50 символов';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    dispatch(clearError());

    try {
      await dispatch(updateProfile({ userId: Number(userId!), data: formData })).unwrap();
      navigate(`/profile/${userId}`);
    } catch (err) {
      // Ошибка обрабатывается в Redux
    }
  };

  const handleAddSkill = async (skill: SkillAddRequest) => {
    if (userId) {
      await dispatch(addSkill({ userId: Number(userId), skill })).unwrap();
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (userId) {
      await dispatch(deleteSkill({ userId: Number(userId), skillId })).unwrap();
    }
  };

  if (!profile) {
    return (
      <Layout>
        <Typography>Загрузка...</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Редактирование профиля
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Отображаемое имя"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                error={!!validationErrors.displayName}
                helperText={validationErrors.displayName || 'От 2 до 50 символов'}
                required
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Биография"
                multiline
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                helperText={`${formData.bio?.length || 0}/500 символов`}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telegram"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                placeholder="@username"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL аватара"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                helperText="Ссылка на изображение аватара"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL фона профиля"
                value={formData.backgroundUrl}
                onChange={(e) => setFormData({ ...formData, backgroundUrl: e.target.value })}
                helperText="Ссылка на фоновое изображение"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate(`/profile/${userId}`)}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: '#6366F1' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Навыки</Typography>
        <Fab
          size="small"
          color="primary"
          aria-label="добавить навык"
          onClick={() => setSkillFormOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      {skills.length > 0 ? (
        <Grid container spacing={3}>
          {skills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill.id}>
              <SkillCard skill={skill} onDelete={handleDeleteSkill} showActions />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Навыки не добавлены. Нажмите + чтобы добавить навык.
          </Typography>
        </Paper>
      )}

      <SkillForm
        open={skillFormOpen}
        onClose={() => setSkillFormOpen(false)}
        onSubmit={handleAddSkill}
      />
    </Layout>
  );
};

export default ProfileEditPage;

