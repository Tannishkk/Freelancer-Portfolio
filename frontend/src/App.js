import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ChatInbox from "./pages/ChatInbox";
import Navbar from "./components/Navbar";

function App() {
  return (
   <Router>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Dashboard Routes */}
    <Route path="/dashboard" element={<Dashboard />}>
      <Route path="home" element={<Home />} />
      <Route path="profile" element={<Profile />} />
      <Route path="chat" element={<ChatInbox />} />
    </Route>
  </Routes>
</Router>
  );
}

export default App;