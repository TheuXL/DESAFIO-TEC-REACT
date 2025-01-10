import { useContext } from 'react';
import AuthContext, { AuthContextProps } from '../context/AuthContext';

export const useAuth = (): AuthContextProps => {
  return useContext(AuthContext);
};