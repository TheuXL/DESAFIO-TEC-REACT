import React from 'react';
import Login from '../components/auth/Login';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="auth-container">
      <Login />
      <p>
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
};

export default LoginPage;
