import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp.tsx';
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.tsx";
import * as React from "react";
import AuthGuard from "./AuthGuard.tsx";
import NotFound from "../pages/PageNotFound/NotFound.tsx";
import {Login} from "../pages/Login/Login.tsx";
import {Home} from "@mui/icons-material";

const RoutesComponent: React.FunctionComponent = () => {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        {/* Use AuthGuard to protect the 'home' route */}
        <Route path="home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="create-new-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
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