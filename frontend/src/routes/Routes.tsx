import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignUp from "../pages/SignUp/SignUp.tsx";
import {ForgotPassword} from "../pages/ForgotPassword/ForgotPassword.tsx";
import * as React from "react";
import AuthGuard from "./AuthGuard.tsx";
import {Login} from "../pages/Login/Login.tsx";
import {Home} from "../pages/Home/Home.tsx";
import {NotFound} from "../pages/PageNotFound/NotFound.tsx";

const RoutesComponent: React.FunctionComponent = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
      {/* Use AuthGuard to protect the 'home' route */}
      <Route
        path="home"
        element={
          <AuthGuard>
            <Home />
          </AuthGuard>
        }
      />
        <Route path="home/text-input/id/:textInputId" element={<Home />} />
        <Route path="create-new-password" element={<ForgotPassword />} />
    </Routes>
  );
};

export const AppRouter: React.FunctionComponent = () => {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
};
