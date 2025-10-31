import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Chip } from '@mui/material';
import { UserLocation, NearbyUser } from '../../types/geolocation';
import 'leaflet/dist/leaflet.css';

// Fix для иконок Leaflet в React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  currentLocation: UserLocation | null;
  nearbyUsers: NearbyUser[];
  tasks?: Array<{ id: number; latitude: number; longitude: number; title: string }>;
  accuracy?: number;
  onLocationClick?: (userId: number) => void;
  onTaskClick?: (taskId: number) => void;
}

const MapController: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  nearbyUsers,
  tasks = [],
  accuracy,
  onLocationClick,
  onTaskClick,
}) => {
  const defaultCenter: [number, number] = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [55.7558, 37.6173]; // Москва по умолчанию

  const getAccuracyRadius = (accuracy: string, distance?: number): number => {
    switch (accuracy) {
      case 'HIGH':
        return 50;
      case 'MEDIUM':
        return 500;
      case 'LOW':
        return 5000;
      case 'CITY':
        return 50000;
      default:
        return distance || 1000;
    }
  };

  const currentRadius = currentLocation
    ? getAccuracyRadius(currentLocation.accuracy, accuracy)
    : 1000;

  return (
    <Box sx={{ width: '100%', height: '500px', borderRadius: 2, overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapController center={defaultCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Текущая локация пользователя */}
        {currentLocation && (
          <>
            <Marker
              position={[currentLocation.latitude, currentLocation.longitude]}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <Typography variant="subtitle2">Ваше местоположение</Typography>
                <Typography variant="caption">
                  {currentLocation.address || currentLocation.city || 'Текущая позиция'}
                </Typography>
                <Chip
                  label={currentLocation.accuracy}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Popup>
            </Marker>
            <Circle
              center={[currentLocation.latitude, currentLocation.longitude]}
              radius={currentRadius}
              pathOptions={{ color: '#3B82F6', fillOpacity: 0.1 }}
            />
          </>
        )}

        {/* Пользователи поблизости */}
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}
            position={[user.latitude, user.longitude]}
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
            eventHandlers={{
              click: () => onLocationClick?.(user.userId),
            }}
          >
            <Popup>
              <Typography variant="subtitle2">Пользователь ID: {user.userId}</Typography>
              <Typography variant="caption">
                Расстояние: {user.distance.toFixed(1)} м
              </Typography>
              {user.address && (
                <Typography variant="caption" display="block">
                  {user.address}
                </Typography>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Задачи на карте */}
        {tasks.map((task) => (
          <Marker
            key={task.id}
            position={[task.latitude, task.longitude]}
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
            eventHandlers={{
              click: () => onTaskClick?.(task.id),
            }}
          >
            <Popup>
              <Typography variant="subtitle2">{task.title}</Typography>
              <Typography variant="caption" component="div">
                ID задачи: {task.id}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapView;

