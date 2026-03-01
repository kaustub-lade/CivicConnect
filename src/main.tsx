import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import './index.css';
import { registerServiceWorker, requestNotificationPermission } from './utils/pwa';

// Register service worker for PWA functionality
registerServiceWorker();

// Request notification permission
requestNotificationPermission();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
