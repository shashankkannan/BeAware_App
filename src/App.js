// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import ManageProfile from './components/ManageProfile'
import Setup from './components/Setup';
import Streams from './components/Streams';
import Manage from './components/MenuItems';
import About from './components/About'
import Forgot from './components/forgotpass'
import { AuthProvider } from './contexts/authContext';

function App() {
  
  const routesArray = [
    {
      path: "*",
      element: <SignIn />
    }
  ]
  return (
    <Router>
    <AuthProvider> 
      <div>
        <Routes>
        <Route path="*" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/manage" element={<ManageProfile />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/streams" element={<Streams />} />
          <Route path="/mg" element={<Manage />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgotpass" element={<Forgot />} />
        </Routes>
      </div>
    </AuthProvider>
  </Router>
  );
}

export default App;
