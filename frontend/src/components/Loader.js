// src/components/Loader.js
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

function Loader() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80px">
      <CircularProgress />
    </Box>
  );
}

export default Loader;
