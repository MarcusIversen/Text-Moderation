// routes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.tsx';
import SignUp from '../pages/SignUp.tsx';
import App from '../pages/App.tsx';
import * as React from "react";

const RoutesComponent: React.FC = () => {
  return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="main" element={<App />} />
        {/* Add more routes as needed */}
      </Routes>
  );
};

export const AppRouter: React.FC = () => {
  return (
      <Router>
        <RoutesComponent />
      </Router>
  );
};
