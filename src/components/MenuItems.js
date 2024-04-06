// MenuItems.js

import React, { useState } from 'react';
import profileicon from '../Assets/profile.png';
import { doSignOut } from '../firebase/auth';
import streamicon from '../Assets/stream.png'; 
import vimeo from '../Assets/icons/vimeo.png';
import instagram from '../Assets/icons/instagram.png';
import linkedin from '../Assets/icons/linkedin.png';
import github from '../Assets/icons/github.png';
import twitter from '../Assets/icons/twitter.png';
import facebook from '../Assets/icons/facebook.png'; 
import email from '../Assets/icons/email.png'; 
import dash from '../Assets/info.png'; 
import { useNavigate } from 'react-router-dom';
import blImage from '../Assets/BeawareL.png';
import Contact from './Contact';

const MenuItems = ({ initialActiveItem }) => {
  const [activeItem, setActiveItem] = useState(initialActiveItem); 
  const navigate = useNavigate();
  const handleStreamClick = () => {
    sessionStorage.clear();
    setActiveItem('streams');
    window.location.href = '/streams';
  };
  
  const handleHomeClick = () => {
    sessionStorage.clear();
    setActiveItem('dashboard');
    window.location.href = '/about';
  };

  const handleProfileClick = () => {
    sessionStorage.clear();
    setActiveItem('profile');
    window.location.href = '/manage';
  };
  
  return (
    <div style={{animation: 'slideIn 1s ease forwards'}}>
    <img src={blImage} alt="Beaware Logo" style={{ width: "80%", height: "70px", paddingLeft:"20px", paddingTop:"30px", borderRadius:"20px"}} />
    <p></p>
      <div style= {{marginTop:"30px"}} className={activeItem === 'profile' ? "menu-itemselect" : "menu-item"}>
        <img src={profileicon} alt="Profile Icon" />
        <span><a className={activeItem === 'profile' ? "ap1" : "ap"} onClick={handleProfileClick} >Profile</a></span>
      </div>
      <br></br>
      <div style= {{marginTop:"15px"}} className={activeItem === 'streams' ? "menu-itemselect" : "menu-item"}>
        <img src={streamicon} alt="Streams Icon" />
        <span><a className={activeItem === 'streams' ? "ap1" : "ap"} onClick={handleStreamClick}>Streams</a></span>
      </div>
      <br></br>
      <div style= {{marginTop:"15px"}} className={activeItem === 'dashboard' ? "menu-itemselect" : "menu-item"}>
        <img src={dash} alt="Dashboard Icon" />
        <span><a className={activeItem === 'dashboard' ? "ap1" : "ap"} onClick={handleHomeClick}>About us</a></span>
      </div>
      {/* <div style= {{marginTop:"15px"}} className={activeItem === 'dashboard' ? "menu-itemselect" : "menu-item"}>
        <img src={dash} alt="Dashboard Icon" />
        <span><a className={activeItem === 'dashboard' ? "ap1" : "ap"} onClick={handleHomeClick}>Dashboard</a></span>
      </div> */}
  <div class="circlez">
    <div class="iconz"><a target='_blank' href="https://vimeo.com/724877299"><img src={vimeo} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 1"/></a></div>
    <div class="iconz"><a target='_blank' href="https://github.com/TheFirstPrototype"><img src={github} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 2"/></a></div>
    <div class="iconz"><a target='_blank' href="https://twitter.com/BeAware4Deaf"><img src={twitter} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 3"/></a></div>
    <div class="iconz"><a  target='_blank' href="https://www.facebook.com/BeAware4Deaf"><img src={facebook} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 4"/></a></div>
    <div class="iconz"><a target='_blank' href="https://www.linkedin.com/showcase/BeAware4Deaf"><img src={linkedin} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 5"/></a></div>
    <div class="iconz"><a target='_blank' href="https://www.instagram.com/BeAware4Deaf/"><img src={instagram} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 6"/></a></div>
    <div class="iconx"><a href="mailto:hi@deafassistant.com"><img src={email} alt="Icon 7"/></a></div>
  </div>


<div style={{paddingTop:"50px"}}>
<button  onClick={() => { doSignOut().then(()=> { sessionStorage.clear(); navigate('/signin');})}} className="logout-btn1">Logout</button>
</div>  {/* <Contact size="11px"/> */}
    </div>
  );
};

export default MenuItems;
