import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, Link } from '@mui/material';
import { Person, AccessTime, Link as LinkIcon } from '@mui/icons-material';
import { Bid } from '../../types/task';
import { format } from 'date-fns';

interface BidCardProps {
  bid: Bid;
  executorName?: string;
  executorRating?: number;
  canManage?: boolean;
  onAccept?: (bidId: number) => void;
  onReject?: (bidId: number) => void;
}

const BidCard: React.FC<BidCardProps> = ({
  bid,
  executorName,
  executorRating,
  canManage = false,
  onAccept,
  onReject,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Person fontSize="small" />
              <Typography variant="h6">
                {executorName || `Исполнитель ID: ${bid.userId}`}
              </Typography>
              {executorRating && (
                <Chip
                  label={`★ ${executorRating.toFixed(1)}`}
                  size="small"
                  color="primary"
                />
              )}
              <Chip
                label={bid.status === 'ACCEPTED' ? 'Принята' : bid.status === 'REJECTED' ? 'Отклонена' : 'Активна'}
                size="small"
                color={
                  bid.status === 'ACCEPTED'
                    ? 'success'
                    : bid.status === 'REJECTED'
                    ? 'error'
                    : 'default'
                }
              />
            </Box>

            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {bid.message}
            </Typography>

            {bid.proposedDeadline && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Предлагаемый срок: {format(new Date(bid.proposedDeadline), 'dd MMM yyyy')}
                </Typography>
              </Box>
            )}

            {bid.portfolioUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LinkIcon fontSize="small" color="action" />
                <Link href={bid.portfolioUrl} target="_blank" rel="noopener">
                  Портфолио
                </Link>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary">
              Подано: {format(new Date(bid.createdAt), 'dd MMM yyyy, HH:mm')}
            </Typography>
          </Box>
        </Box>

        {canManage && bid.status === 'ACTIVE' && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => onAccept?.(bid.id)}
              size="small"
            >
              Принять
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => onReject?.(bid.id)}
              size="small"
            >
              Отклонить
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BidCard;

