import React from 'react';
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import LoginPage from './pages/LoginPage';
  import RegisterPage from './pages/RegisterPage';
  import HomePage from './pages/HomePage';
  import { useAuth } from './hooks/useAuth';


  const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
      <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/"/>}/>
          <Route path="/register" element={!isAuthenticated ? <RegisterPage />: <Navigate to="/"/> } />
          <Route path="/" element={ isAuthenticated ? <HomePage /> : <Navigate to="/login"/>}/>
      </Routes>
  );
  };

  export default App;