// UserProfile.js

import React, { useState } from 'react';
import userpic from '../Assets/user.png';
import {useAuth} from '../contexts/authContext'

const UserProfile = () => {
    const {currentUser, userLoggedIn} = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [showIda, setShowIda] = useState(true);
    const handleHover = () => {
      setIsHovered(!isHovered);
      if (!isHovered) {
        
          setShowIda(false);
        
      } else {
        setTimeout(() => {
        setShowIda(true);}, 190);
      }
    };
  return (
      <div
      style={{
        animation: "zoomIn 1s ease forwards",
        position: 'relative',
        marginLeft: '100px',
        width: 'fit-content',
        borderRadius: '30px',
        // boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)",
        overflow: 'hidden',
        backgroundColor: isHovered ? '#E3ECF2' : '#1B4375',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >

        <table style={{ width: "100%", height: "100%", paddingTop: "40px" }}>
          <tr>
            <td style={{ width: "30%", verticalAlign: "top", paddingLeft: "40px", paddingBottom: "40px", paddingRight: "40px"}}>
              <img src={userpic} style={{ width: "50px", height: "50px", transform: "scale(1.0)" }} alt="Edit userpic" />
            </td>
            <td style={{ width: "70%", verticalAlign: "top" , paddingRight: "40px"}}>
              <tr>
                <td style={{ fontWeight: "bold", color: "#1B4375" }}>Name: </td>
                <td style={{color: "#1B4375"}}>&nbsp;{currentUser.displayName}</td>
              </tr>
              <div id="ida" style={{ marginBottom: '10px'}}><td style={{ fontWeight: "bold", color: "#E3ECF2", display: showIda ? 'block' : 'none' }}> PROFILE INFORMATION </td></div>
            <tr>
              <td style={{ fontWeight: "bold" , color: "#1B4375"  }}>Email Id:</td>
              <td style={{color: "#1B4375"}} >&nbsp;{currentUser.email}</td>
            </tr>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default UserProfile;
