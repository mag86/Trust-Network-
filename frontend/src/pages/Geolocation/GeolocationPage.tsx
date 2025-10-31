import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { MyLocation as MyLocationIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store/store';
import {
  fetchLocation,
  updateLocation,
  searchNearbyUsers,
  fetchPrivacySettings,
  updatePrivacySettings,
  clearError,
} from '../../store/geolocation/geolocationSlice';
import Layout from '../../components/common/Layout';
import MapView from '../../components/geolocation/MapView';
import PrivacySettingsForm from '../../components/geolocation/PrivacySettingsForm';
import { LocationAccuracy, LocationSource } from '../../types/geolocation';

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

const GeolocationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentLocation, nearbyUsers, privacySettings, isLoading, error } = useSelector(
    (state: RootState) => state.geolocation
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.task);
  const [activeTab, setActiveTab] = useState(0);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchLocation(user.id));
      dispatch(fetchPrivacySettings(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (currentLocation) {
      dispatch(
        searchNearbyUsers({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          radiusMeters: 1000,
          limit: 20,
        })
      );
    }
  }, [currentLocation, dispatch]);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (user?.id) {
          const locationUpdate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: (position.coords.accuracy <= 50
              ? 'HIGH'
              : position.coords.accuracy <= 500
              ? 'MEDIUM'
              : position.coords.accuracy <= 5000
              ? 'LOW'
              : 'CITY') as LocationAccuracy,
            source: 'GPS' as LocationSource,
          };

          dispatch(updateLocation({ userId: user.id, location: locationUpdate }));
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Ошибка получения геолокации:', error);
        alert('Не удалось получить ваше местоположение. Проверьте настройки браузера.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const handleSavePrivacySettings = (settings: Partial<any>) => {
    if (user?.id) {
      dispatch(updatePrivacySettings({ userId: user.id, settings }));
    }
  };

  const handleLocationClick = (userId: number) => {
    // Переход на профиль пользователя
    window.location.href = `/profile/${userId}`;
  };

  const handleTaskClick = (taskId: number) => {
    // Переход на детали задачи
    window.location.href = `/tasks/${taskId}`;
  };

  const tasksWithLocation = tasks.filter((t) => t.location?.latitude && t.location?.longitude).map((t) => ({
    id: t.id,
    latitude: t.location!.latitude,
    longitude: t.location!.longitude,
    title: t.title,
  }));

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Геолокация</Typography>
        <Button
          variant="contained"
          startIcon={isGettingLocation ? <CircularProgress size={20} /> : <MyLocationIcon />}
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          sx={{ bgcolor: '#6366F1' }}
        >
          {isGettingLocation ? 'Получение...' : 'Обновить местоположение'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Карта" />
          <Tab label="Настройки приватности" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {currentLocation ? (
            <>
              <MapView
                currentLocation={currentLocation}
                nearbyUsers={nearbyUsers}
                tasks={tasksWithLocation}
                accuracy={currentLocation.accuracy === 'HIGH' ? 50 : undefined}
                onLocationClick={handleLocationClick}
                onTaskClick={handleTaskClick}
              />

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Ваше местоположение
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Широта: {currentLocation.latitude.toFixed(6)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Долгота: {currentLocation.longitude.toFixed(6)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Точность: {currentLocation.accuracy}
                    </Typography>
                    {currentLocation.address && (
                      <Typography variant="body2" color="text.secondary">
                        Адрес: {currentLocation.address}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Пользователи поблизости
                    </Typography>
                    {nearbyUsers.length > 0 ? (
                      <Box>
                        {nearbyUsers.slice(0, 5).map((user) => (
                          <Typography key={user.id} variant="body2" sx={{ mb: 1 }}>
                            ID {user.userId} • {user.distance.toFixed(0)} м
                          </Typography>
                        ))}
                        {nearbyUsers.length > 5 && (
                          <Typography variant="caption" color="text.secondary">
                            И еще {nearbyUsers.length - 5} пользователей
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Пользователи не найдены
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Местоположение не установлено
              </Typography>
              <Button
                variant="contained"
                startIcon={<MyLocationIcon />}
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                sx={{ mt: 2, bgcolor: '#6366F1' }}
              >
                Определить местоположение
              </Button>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {privacySettings ? (
            <PrivacySettingsForm
              settings={privacySettings}
              onSave={handleSavePrivacySettings}
              isLoading={isLoading}
            />
          ) : (
            <CircularProgress />
          )}
        </TabPanel>
      </Paper>
    </Layout>
  );
};

export default GeolocationPage;

