// AuthGuard.tsx
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {jwtDecode} from 'jwt-decode';

interface AuthGuardProps {
  children?: ReactNode;
}

const AuthGuard: React.FunctionComponent<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

const checkAuthentication = (): boolean => {
  const token = new Cookies().get('AuthCookie');

  if (!token) {
    return false;
  }

  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

export default AuthGuard;
