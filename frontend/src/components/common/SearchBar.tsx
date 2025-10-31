import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Поиск по платформе...', onSearch }) => {
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        // По умолчанию поиск по задачам
        navigate(`/tasks?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        maxWidth: '100%',
      }}
    >
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ 'aria-label': 'поиск' }}
      />
      {query && (
        <IconButton onClick={handleClear} sx={{ p: '10px' }} aria-label="clear">
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;

