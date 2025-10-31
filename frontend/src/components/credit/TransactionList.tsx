import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  ExpandMore,
  ExpandLess,
  AccountCircle,
  Receipt,
} from '@mui/icons-material';
import { Transaction } from '../../types/credit';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  currentUserId: number;
}

const TransactionItem: React.FC<{ transaction: Transaction; currentUserId: number }> = ({
  transaction,
  currentUserId,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isOutgoing = transaction.fromUserId === currentUserId;
  const isIncoming = transaction.toUserId === currentUserId;

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TRANSFER: 'Перевод',
      TASK_REWARD: 'Награда за задачу',
      SYSTEM_FEE: 'Системная комиссия',
      REFUND: 'Возврат',
      BONUS: 'Бонус',
      ESCROW_RESERVE: 'Резервирование',
      ESCROW_RELEASE: 'Освобождение escrow',
      ESCROW_RETURN: 'Возврат escrow',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {isOutgoing ? (
                <ArrowUpward color="error" />
              ) : isIncoming ? (
                <ArrowDownward color="success" />
              ) : (
                <Receipt />
              )}
              <Typography variant="h6" component="div">
                {isOutgoing ? '-' : isIncoming ? '+' : ''}{transaction.amount.toFixed(0)} ₿
              </Typography>
              <Chip
                label={getTransactionTypeLabel(transaction.type)}
                size="small"
                sx={{ ml: 1 }}
              />
              <Chip
                label={transaction.status}
                size="small"
                color={getStatusColor(transaction.status) as any}
              />
            </Box>
            {transaction.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {transaction.description}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {format(new Date(transaction.timestamp), 'dd MMM yyyy, HH:mm')}
            </Typography>
          </Box>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Отправитель
              </Typography>
              <Typography variant="body2">
                {transaction.fromUserId ? `ID: ${transaction.fromUserId}` : 'Система'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Получатель
              </Typography>
              <Typography variant="body2">
                {transaction.toUserId ? `ID: ${transaction.toUserId}` : 'Система'}
              </Typography>
            </Grid>
            {transaction.fee && transaction.fee > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Комиссия
                </Typography>
                <Typography variant="body2">{transaction.fee.toFixed(2)} ₿</Typography>
              </Grid>
            )}
            {transaction.taskId && (
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Связанная задача
                </Typography>
                <Typography variant="body2">ID: {transaction.taskId}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                ID транзакции
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                #{transaction.id}
              </Typography>
            </Grid>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currentUserId }) => {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            История транзакций пуста
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} currentUserId={currentUserId} />
      ))}
    </Box>
  );
};

export default TransactionList;

