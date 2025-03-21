import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import PapurosController from './PapurosController';
import { ThemeProvider } from './ThemeProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <PapurosController />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);