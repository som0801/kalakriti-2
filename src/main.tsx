
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add viewport meta tag for mobile optimization
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
document.getElementsByTagName('head')[0].appendChild(meta);

// Add app status bar styles for mobile
const metaThemeColor = document.createElement('meta');
metaThemeColor.name = 'theme-color';
metaThemeColor.content = '#8B5CF6'; // Kala primary color
document.getElementsByTagName('head')[0].appendChild(metaThemeColor);

// Add apple specific meta tags for PWA experience
const appleMobileWebAppCapable = document.createElement('meta');
appleMobileWebAppCapable.name = 'apple-mobile-web-app-capable';
appleMobileWebAppCapable.content = 'yes';
document.getElementsByTagName('head')[0].appendChild(appleMobileWebAppCapable);

const appleMobileWebAppStatusBar = document.createElement('meta');
appleMobileWebAppStatusBar.name = 'apple-mobile-web-app-status-bar-style';
appleMobileWebAppStatusBar.content = 'black-translucent';
document.getElementsByTagName('head')[0].appendChild(appleMobileWebAppStatusBar);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <App />
);
