// routes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login.tsx';
import SignUp from '../pages/SignUp/SignUp.tsx';
import Home from '../pages/Home/Home.tsx';
import * as React from "react";

const RoutesComponent: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="home" element={<Home />} />
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
