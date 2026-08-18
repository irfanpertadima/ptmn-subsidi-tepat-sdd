import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx';
const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}><CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
