import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { NoticeProvider } from './components/Notice';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NoticeProvider>
          <App />
        </NoticeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);