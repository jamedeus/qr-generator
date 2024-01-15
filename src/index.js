import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import './darkMode.js';
import App from './App';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <App />
);
