import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplicationPage from "./pages/ApplicationPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ApplicationPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;