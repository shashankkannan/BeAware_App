// MenuItems.js

import React, { useState } from 'react';
import profileicon from '../Assets/profile.png';
import { doSignOut } from '../firebase/auth';
import streamicon from '../Assets/stream.png'; 
import dash from '../Assets/dashboard.png'; 
import { useNavigate } from 'react-router-dom';

const Phonemenu = () => {
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const handleStreamClick = () => {
    window.location.href = '/streams';
  };

  const handleProfileClick = () => {
    window.location.href = '/manage';
  };
  const handledash = () => {
    window.location.href = '/Home';
  };

  const openNav = () => {
    setIsSideNavOpen(true);
  };

  const closeNav = () => {
    setIsSideNavOpen(false);
  };
  const handlelogout = () => {
    doSignOut().then(()=> { navigate('/signin')});
  }
  
  return (
    <>
      <div>
      <div id="mySidenav" className={`sidenav ${isSideNavOpen ? 'open' : ''}`}>
        <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
        <a onClick={handleProfileClick}>Profile</a>
        <a onClick={handleStreamClick}>Streams</a>
        <a onClick={handledash}>Dashboard</a>
        <a onClick={handlelogout}>Logout</a>
      </div>
      <span className="openbtn" onClick={openNav}>&#9776;</span>
    </div>
    </>
  );
};

export default Phonemenu;
