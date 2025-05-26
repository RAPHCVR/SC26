import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Global styles

// Override ResizeObserver to ignorer erreurs de boucle incomplète
(() => {
  const OriginalRO = window.ResizeObserver;
  window.ResizeObserver = class {
    constructor(callback) {
      this._ro = new OriginalRO(callback);
    }
    observe(target) {
      try {
        this._ro.observe(target);
      } catch (e) {
        // Ignorer ResizeObserver loop error
      }
    }
    unobserve(target) {
      try {
        this._ro.unobserve(target);
      } catch (_){}
    }
    disconnect() {
      try {
        this._ro.disconnect();
      } catch (_){}
    }
  };
})();

// Global error filter pour ignorer ResizeObserver loop
window.addEventListener('error', event => {
  if (event.message && event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

window.onerror = function(message) {
  if (message && message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return true;
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);