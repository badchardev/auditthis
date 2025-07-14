import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

console.log('main.tsx loaded');

console.log('main.tsx loaded');

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center; font-family: system-ui;">Error: Root element not found</div>';
} else {
  try {
    console.log('Creating React root...');
    
    // Clear loading content
    rootElement.innerHTML = '';
    
    // Create React root
    const root = createRoot(rootElement);
    
    console.log('Rendering app...');
    
    // Render app
    root.render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    
    console.log('App rendered successfully');
    
  } catch (error) {
    console.error('Failed to render React app:', error);
    rootElement.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-color: #f9fafb;
        font-family: system-ui;
        font-size: 18px;
        color: #374151;
        flex-direction: column;
        padding: 20px;
      ">
        <h1>Failed to load application</h1>
        <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="
          padding: 10px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">Reload Page</button>
      </div>
    `;
  }
}