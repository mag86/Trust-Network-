import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { Reply as ReplyIcon, Person } from '@mui/icons-material';
import { Review } from '../../types/reputation';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  authorName?: string;
  canReply?: boolean;
  onReply?: (reviewId: number, reply: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, authorName, canReply = false, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Person fontSize="small" />
              <Typography variant="subtitle1">
                {authorName || `Пользователь ID: ${review.authorId}`}
              </Typography>
              <Rating value={review.overallRating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {review.overallRating.toFixed(1)}/5.0
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Качество
                </Typography>
                <Rating value={review.qualityRating} precision={0.5} readOnly size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Сроки
                </Typography>
                <Rating value={review.timelinessRating} precision={0.5} readOnly size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Коммуникация
                </Typography>
                <Rating value={review.communicationRating} precision={0.5} readOnly size="small" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">
                  Цена/Качество
                </Typography>
                <Rating value={review.valueRating} precision={0.5} readOnly size="small" />
              </Grid>
            </Grid>

            {review.publicComment && (
              <Typography variant="body1" paragraph>
                {review.publicComment}
              </Typography>
            )}

            {review.privateComment && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Приватный комментарий (только для вас)
                </Typography>
                <Typography variant="body2">{review.privateComment}</Typography>
              </Box>
            )}

            {review.reply && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Ответ от получателя:
                </Typography>
                <Typography variant="body2">{review.reply}</Typography>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              {format(new Date(review.createdAt), 'dd MMM yyyy, HH:mm')}
              {review.editedAt && ` • Отредактировано: ${format(new Date(review.editedAt), 'dd MMM yyyy, HH:mm')}`}
            </Typography>
          </Box>
        </Box>

        {canReply && !review.reply && (
          <Box>
            {!showReplyForm ? (
              <Button
                variant="outlined"
                startIcon={<ReplyIcon />}
                onClick={() => setShowReplyForm(true)}
                size="small"
              >
                Ответить
              </Button>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Написать ответ на отзыв..."
                  margin="normal"
                  inputProps={{ maxLength: 500 }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleReplySubmit}
                    size="small"
                    sx={{ bgcolor: '#6366F1' }}
                  >
                    Отправить
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText('');
                    }}
                    size="small"
                  >
                    Отмена
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

