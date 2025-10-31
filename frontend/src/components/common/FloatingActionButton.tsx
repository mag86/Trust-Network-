import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Add as AddIcon, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';

interface FloatingActionButtonProps {
  icon?: 'add' | 'up';
  onClick: () => void;
  label: string;
  bottom?: number;
  right?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon = 'add',
  onClick,
  label,
  bottom = 24,
  right = 24,
}) => {
  const IconComponent = icon === 'add' ? AddIcon : ArrowUpwardIcon;

  return (
    <Tooltip title={label} placement="left">
      <Fab
        color="primary"
        aria-label={label}
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom,
          right,
          bgcolor: '#6366F1',
          '&:hover': { bgcolor: '#4F46E5' },
          zIndex: 1000,
        }}
      >
        <IconComponent />
      </Fab>
    </Tooltip>
  );
};

export default FloatingActionButton;

