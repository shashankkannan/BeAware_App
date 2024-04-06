import React, { useState, useEffect } from 'react';
import styles from '../css/Login.module.css';
import logo from '../Assets/Group.png';
import videoSource from '../Assets/welcome.mp4';
import log from '../Assets/Vector.png'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import {doSignInWithEmailAndPassword} from '../firebase/auth';
import {useAuth} from '../contexts/authContext'
import {getDatabase, ref, push, set, orderByChild, onChildAdded,equalTo, child, query, get } from 'firebase/database';
import { database } from "../firebase/firebase";
import reg from '../Assets/registerbck.mp4';
import vimeo from '../Assets/icons/vimeo.png';
import instagram from '../Assets/icons/instagram.png';
import linkedin from '../Assets/icons/linkedin.png';
import github from '../Assets/icons/github.png';
import twitter from '../Assets/icons/twitter.png';
import facebook from '../Assets/icons/facebook.png'; 
import email1 from '../Assets/icons/email.png'; 



function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}
const SignIn = () => {
  const navigate = useNavigate()
    const { userLoggedIn, currentUser  } = useAuth()
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typedText, setTypedText] = useState('');
    const textToType = "BeAware assists hearing-impaired individuals with secure sign-up and stream URL generation via user inputs, fostering accessibility goals.";
    const [rotationAngle, setRotationAngle] = useState(0);
    const [showVideo, setShowVideo] = useState(true);
    const [isFirst, setIsFirst] = useState('');
    
    const [toastMessage, setToastMessage] = useState('');
    const showToast = (message) => {
      setToastMessage(message);
      setTimeout(() => {
        setToastMessage('');
      }, 3000); // Hide the toast after 3 seconds
    };

    useEffect(() => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < textToType.length) {
          setTypedText((prevText) => prevText + textToType.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // Typing speed: 100 milliseconds per character
  
      return () => clearInterval(typingInterval);
    }, []); 


    useEffect(() => {
      const rotationInterval = setInterval(() => {
        setRotationAngle((prevAngle) => prevAngle + 1);
      }, 50); // Rotation speed: 50 milliseconds
  
      return () => clearInterval(rotationInterval);
    }, []); 

    useEffect(() => {
    // Show video after 5 seconds
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);


  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      showToast('Password reset email sent successfully. Please check your email.');
    } catch (error) {
      showToast('Error sending password reset email.');
    }
  };


    const handleVideoEnd = () => {
      setShowVideo(false); // Update state to hide the video after it ends
  };
  
    return (

     
        <div className='hero' style={{overflow: "hidden"}}>
        <video autoPlay loop muted playsInline className='back-video' style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'fixed', top: 0, left: 0, zIndex: -1 }} onLoadedMetadata={handleVideoLoaded}>
            <source src={reg} type='video/mp4' />
          </video>
    
          {videoLoaded && (
            <>
          <div className='formdiv' style={{width:"35%", marginRight:"15vw", scale:"0.9", borderRadius:"40px", padding:"30px", animation: 'slideIn 1s ease forwards', backgroundColor:"#E5E5E5", display:"flex", alignItems:"center", flexDirection:"column"}} >
              <h4  style={{scale:"1.7" ,color:"#1B4375"}}>Forgot password?</h4><p></p>
              <p style={{width:"70%", color:"#1B4375"}}>Don't worry! Just provide your registered email address, and we'll send you a password reset link right away.</p>
              <form onSubmit={handleSubmit} className={styles.formz}>
                <label htmlFor="email" className={styles.labelz}>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputz}
                  style={{color:"#1B4375"}}
                  required
                />
                {/* <label htmlFor="password" className={styles.labelz} style={{color:"#1B4375"}}>
                </label>
                <input
                style={{color:"#1B4375"}}
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputz}
                /> */}
                <p></p>
              <button type="submit" className={styles.button} style={{ fontWeight:"bold", scale:"0.95",transition: "transform 0.3s ease", backgroundColor:"#1B4375", transform:"3s ease"}} onMouseEnter={(e)=>{
                e.target.style.backgroundColor="#A6E4F6"
                e.target.style.color="#1B4375"
                 e.target.style.transform = "scale(0.99)";
              }} onMouseLeave={(e)=>{
                e.target.style.backgroundColor="#1B4375"
                e.target.style.color="#E5E5E5"
                e.target.style.transform="scale(0.95)";
              }} 
              onMouseDown={(e)=>{
                e.target.style.backgroundColor="#1B4375"
                e.target.style.color="#E5E5E5"
              }}
              onMouseUp={(e)=>{
                e.target.style.backgroundColor="#A6E4F6"
                e.target.style.color="#1B4375"
              }}>
                Password reset
              </button>
            </form>
            <p style={{cursor:"pointer", color: "#1B4375"}} className={styles.signup}>
              <Link to="/signin">Back to sign in?</Link> 
            </p>
            <p></p>
            {/* <p style={{color:"#1B4375"}} className={styles.signup}>
              Need a new account? <Link to ="/SignUp">Sign up</Link>
            </p> */}
          </div>
          <div style={{ 
    position: 'fixed',
    top: '38vh', // Adjust this value to change the distance from the top
    right: '10px', // Adjust this value to change the distance from the right
    paddingLeft:"40px",
    display: 'flex',
    flexDirection: 'column',
    alignItems:"center",
    animation: 'slideout 1s ease forwards',
    // backgroundColor:"#E5E5E5",
    padding:"10px",
    borderRadius: '30px 0 0 30px'
  }}>
    <div class="circlez">
      <div class="iconz"><a href="https://vimeo.com/724877299"><img src={vimeo} onMouseEnter={(e) => {
        e.target.style.opacity = "0.6";
        e.target.style.transform = "scale(1.2)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }} alt="Icon 1"/></a></div>
      <div class="iconz"><a href="https://github.com/TheFirstPrototype"><img src={github} onMouseEnter={(e) => {
        e.target.style.opacity = "0.6";
        e.target.style.transform = "scale(1.2)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }} alt="Icon 2"/></a></div>
      <div class="iconz"><a href="https://twitter.com/BeAware4Deaf"><img src={twitter} onMouseEnter={(e) => {
        e.target.style.opacity = "0.6";
        e.target.style.transform = "scale(1.2)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }} alt="Icon 3"/></a></div>
      <div class="iconz"><a href="https://www.facebook.com/BeAware4Deaf"><img src={facebook} onMouseEnter={(e) => {
        e.target.style.opacity = "0.6";
        e.target.style.transform = "scale(1.2)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }} alt="Icon 4"/></a></div>
      <div class="iconz"><a href="https://www.linkedin.com/showcase/BeAware4Deaf"><img src={linkedin} onMouseEnter={(e) => {
        e.target.style.opacity = "0.6";
        e.target.style.transform = "scale(1.2)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }} alt="Icon 5"/></a></div>
      <div class="iconz"><a href="https://www.instagram.com/BeAware4Deaf/"><img src={instagram} onMouseEnter={(e) => {
        e.target.style.opacity = "0.6";
        e.target.style.transform = "scale(1.2)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }} alt="Icon 6"/></a></div>
      <div class="iconx"><a href="mailto:hi@deafassistant.com"><img src={email1} alt="Icon 7"/></a></div>
    </div>
  </div>
          </>
          )}
          
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    );
};

export default SignIn;



