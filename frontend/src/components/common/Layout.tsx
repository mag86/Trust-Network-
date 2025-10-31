import React, { useState } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/auth/authSlice';
import NotificationCenter from './NotificationCenter';
import SearchBar from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notification);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      dispatch(logout(refreshToken) as any);
    }
    navigate('/login');
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#6366F1' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 3, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Trust Network
          </Typography>
          
          {user && (
            <>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mr: 2 }}>
                <SearchBar />
              </Box>
              
              <IconButton color="inherit" sx={{ mr: 1 }} onClick={() => navigate('/tasks')} title="Задачи">
                📝
              </IconButton>
              <IconButton color="inherit" sx={{ mr: 1 }} onClick={() => navigate('/credits')} title="Кредиты">
                💰
              </IconButton>
              <IconButton color="inherit" sx={{ mr: 1 }} onClick={() => navigate('/geolocation')} title="Геолокация">
                🗺️
              </IconButton>
              <IconButton 
                color="inherit" 
                sx={{ mr: 2 }} 
                onClick={() => setNotificationDrawerOpen(true)}
                title="Уведомления"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#10B981' }}>
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate(`/profile/${user.id}`); handleMenuClose(); }}>
                  Профиль
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                  Настройки
                </MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        {children}
      </Container>
      
      <Box component="footer" sx={{ bgcolor: 'grey.200', py: 3, mt: 'auto' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 Trust Network. Все права защищены.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
              <Typography variant="body2" component="a" href="/terms" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Пользовательское соглашение
              </Typography>
              <Typography variant="body2" component="a" href="/privacy" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Политика конфиденциальности
              </Typography>
              <Typography variant="body2" component="a" href="/support" sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Поддержка
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <NotificationCenter
        open={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </Box>
  );
};

export default Layout;

