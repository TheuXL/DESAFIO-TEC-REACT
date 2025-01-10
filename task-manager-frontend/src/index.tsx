import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
  if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
         <React.StrictMode>
             <BrowserRouter>
                 <AuthProvider>
                     <App />
                 </AuthProvider>
             </BrowserRouter>
         </React.StrictMode>
      );
 }