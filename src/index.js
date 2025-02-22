import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'smoothscroll-polyfill/dist/smoothscroll.min.js';
import './style.css';
import { ThemeProvider } from './DarkMode.js';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
