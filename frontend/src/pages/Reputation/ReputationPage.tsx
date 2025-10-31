import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  Pagination,
} from '@mui/material';
import { EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchTrustScore,
  fetchReviews,
  fetchBadges,
  createReview,
  checkBadges,
  clearError,
  setFilters,
} from '../../store/reputation/reputationSlice';
import Layout from '../../components/common/Layout';
import TrustScorePanel from '../../components/reputation/TrustScorePanel';
import ReviewCard from '../../components/reputation/ReviewCard';
import ReviewForm from '../../components/reputation/ReviewForm';
import BadgeCard from '../../components/reputation/BadgeCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ReputationPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { trustScore, reviews, badges, isLoading, error, filters, pagination } = useSelector(
    (state: RootState) => state.reputation
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');

  const isOwnProfile = user?.id === Number(userId);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTrustScore(Number(userId)));
      dispatch(fetchReviews({ userId: Number(userId) }));
      dispatch(fetchBadges(Number(userId)));
    }
  }, [userId, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateReview = async (review: any) => {
    if (user?.id && userId && selectedTaskId) {
      try {
        await dispatch(
          createReview({
            authorId: user.id,
            targetUserId: Number(userId),
            review: { ...review, taskId: selectedTaskId },
          })
        ).unwrap();
        setReviewFormOpen(false);
        setSelectedTaskId(null);
        dispatch(fetchTrustScore(Number(userId)));
      } catch (err) {
        // Ошибка обрабатывается в Redux
      }
    }
  };

  const handleFilterChange = (filterType: string, value: string | number) => {
    const newFilters = { ...filters, [filterType]: value || undefined };
    dispatch(setFilters(newFilters));
    if (userId) {
      dispatch(fetchReviews({ userId: Number(userId) }));
    }
  };

  // Вычисление тренда (заглушка, нужно получать с бэкенда)
  const trend: 'up' | 'down' | 'stable' = 'stable';
  const averagePlatformScore = 60;

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Репутация {isOwnProfile && '(Ваш профиль)'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {trustScore ? (
        <TrustScorePanel
          trustScore={trustScore}
          trend={trend}
          averagePlatformScore={averagePlatformScore}
        />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Paper sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Отзывы" />
          <Tab label="Бейджи" />
          <Tab label="Детальная статистика" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Фильтр по оценке"
              value={filters.rating || ''}
              onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Все оценки</MenuItem>
              <MenuItem value={5}>5 звезд</MenuItem>
              <MenuItem value={4}>4+ звезды</MenuItem>
              <MenuItem value={3}>3+ звезды</MenuItem>
            </TextField>
            <Button
              variant="outlined"
              onClick={() => {
                dispatch(clearFilters());
                if (userId) {
                  dispatch(fetchReviews({ userId: Number(userId) }));
                }
              }}
            >
              Сбросить фильтры
            </Button>
          </Box>

          {reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  canReply={isOwnProfile}
                  onReply={async (reviewId, reply) => {
                    // TODO: реализовать ответ на отзыв через API
                    console.log('Reply to review', reviewId, reply);
                  }}
                />
              ))}
              {pagination.total > pagination.size && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={Math.ceil(pagination.total / pagination.size)}
                    page={pagination.page + 1}
                    onChange={(_, page) => {
                      if (userId) {
                        dispatch(fetchReviews({ userId: Number(userId), page: page - 1 }));
                      }
                    }}
                    color="primary"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Отзывы отсутствуют
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Бейджи и достижения</Typography>
            {isOwnProfile && (
              <Button
                variant="outlined"
                startIcon={<EmojiEventsIcon />}
                onClick={() => userId && dispatch(checkBadges(Number(userId)))}
                disabled={isLoading}
              >
                Проверить новые бейджи
              </Button>
            )}
          </Box>

          {badges.length > 0 ? (
            <Grid container spacing={3}>
              {badges.map((badge) => (
                <Grid item xs={12} sm={6} md={4} key={badge.id}>
                  <BadgeCard badge={badge} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Бейджи не получены
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="body2" color="text.secondary" align="center">
            Детальная статистика с графиками будет реализована здесь
          </Typography>
          {trustScore && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Процент завершенных задач
                  </Typography>
                  <Typography variant="h4">{trustScore.completionRate.toFixed(1)}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Возраст аккаунта
                  </Typography>
                  <Typography variant="h4">{Math.floor(trustScore.accountAge)} дней</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Уровень верификации
                  </Typography>
                  <Typography variant="h4">{trustScore.verificationLevel.toFixed(0)}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Рекомендации сообщества
                  </Typography>
                  <Typography variant="h4">{trustScore.communityEndorsements.toFixed(0)}%</Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </TabPanel>
      </Paper>

      <ReviewForm
        open={reviewFormOpen}
        onClose={() => {
          setReviewFormOpen(false);
          setSelectedTaskId(null);
        }}
        onSubmit={handleCreateReview}
        isLoading={isLoading}
        taskTitle={selectedTaskTitle}
        isExecutor={false}
      />
    </Layout>
  );
};

export default ReputationPage;

