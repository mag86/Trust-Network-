import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { GeoPrivacySettings, LocationVisibility } from '../../types/geolocation';

interface PrivacySettingsFormProps {
  settings: GeoPrivacySettings | null;
  onSave: (settings: Partial<GeoPrivacySettings>) => void;
  isLoading?: boolean;
}

const PrivacySettingsForm: React.FC<PrivacySettingsFormProps> = ({ settings, onSave, isLoading }) => {
  const [formData, setFormData] = useState<Partial<GeoPrivacySettings>>({
    visibility: 'APPROXIMATE',
    sharingRule: 'ALL',
    showOnlyWhenOnline: false,
    hideWhenInactive: false,
    inactivityMinutes: 30,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        visibility: settings.visibility,
        sharingRule: settings.sharingRule,
        showOnlyWhenOnline: settings.showOnlyWhenOnline,
        hideWhenInactive: settings.hideWhenInactive,
        inactivityMinutes: settings.inactivityMinutes,
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getVisibilityDescription = (visibility: LocationVisibility) => {
    const descriptions: Record<LocationVisibility, string> = {
      EXACT: 'Точные координаты с высокой точностью',
      APPROXIMATE: 'Район/квартал (500м радиус)',
      CITY_ONLY: 'Только город/район города',
      HIDDEN: 'Локация полностью скрыта',
    };
    return descriptions[visibility];
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Настройки приватности геолокации
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend">Уровень видимости местоположения</FormLabel>
          <RadioGroup
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as LocationVisibility })}
          >
            <FormControlLabel value="EXACT" control={<Radio />} label="Точное" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mb: 1, display: 'block' }}>
              {getVisibilityDescription('EXACT')}
            </Typography>

            <FormControlLabel value="APPROXIMATE" control={<Radio />} label="Приблизительное" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mb: 1, display: 'block' }}>
              {getVisibilityDescription('APPROXIMATE')}
            </Typography>

            <FormControlLabel value="CITY_ONLY" control={<Radio />} label="Городское" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mb: 1, display: 'block' }}>
              {getVisibilityDescription('CITY_ONLY')}
            </Typography>

            <FormControlLabel value="HIDDEN" control={<Radio />} label="Скрытое" />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mb: 1, display: 'block' }}>
              {getVisibilityDescription('HIDDEN')}
            </Typography>
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel component="legend">Кому показывать локацию</FormLabel>
          <RadioGroup
            value={formData.sharingRule}
            onChange={(e) => setFormData({ ...formData, sharingRule: e.target.value as any })}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="Всем пользователям" />
            <FormControlLabel value="FRIENDS" control={<Radio />} label="Только друзьям" />
            <FormControlLabel value="NONE" control={<Radio />} label="Никому" />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.showOnlyWhenOnline}
                onChange={(e) => setFormData({ ...formData, showOnlyWhenOnline: e.target.checked })}
              />
            }
            label="Показывать локацию только когда онлайн"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.hideWhenInactive}
                onChange={(e) => setFormData({ ...formData, hideWhenInactive: e.target.checked })}
              />
            }
            label="Автоматически скрывать при бездействии"
          />
        </Box>

        {formData.hideWhenInactive && (
          <TextField
            fullWidth
            label="Минуты бездействия"
            type="number"
            value={formData.inactivityMinutes || 30}
            onChange={(e) => setFormData({ ...formData, inactivityMinutes: Number(e.target.value) })}
            margin="normal"
            helperText="Локация будет скрыта после указанного времени бездействия"
            inputProps={{ min: 5, max: 1440 }}
          />
        )}

        <Alert severity="info" sx={{ mt: 3 }}>
          Изменения применяются немедленно и влияют на видимость вашего местоположения для других пользователей.
        </Alert>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#6366F1' }}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PrivacySettingsForm;

