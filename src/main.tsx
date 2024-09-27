import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/poppins';
import './index.css' // Importa tu archivo CSS
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
   <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  </React.StrictMode>,
);
