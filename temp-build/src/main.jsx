// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

const isDev = import.meta.env.DEV;

// Carrega Web Vitals apenas em desenvolvimento, sem top-level await
if (isDev) {
  (async () => {
    try {
      const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import('web-vitals');
      onCLS(console.log);
      onFID(console.log);
      onFCP(console.log);
      onLCP(console.log);
      onTTFB(console.log);
    } catch (e) {
      console.warn('Web Vitals não carregado:', e);
    }
  })();
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('[main.jsx] Elemento #root não encontrado no HTML.');
}

ReactDOM.createRoot(root).render(
  isDev ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);
