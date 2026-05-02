import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import HomePage          from "./pages/HomePage";
import Login             from "./components/auth/Login";
import Register          from "./components/auth/Register";
import ApplicationPage   from "./pages/ApplicationPage";
import SuccessPage       from "./pages/SuccessPage";
import MyApplicationPage from "./pages/MyApplicationPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register"element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <ApplicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-application"
            element={
              <ProtectedRoute>
                <MyApplicationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;