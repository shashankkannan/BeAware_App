import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import '../css/SignUp.css';
import { Link } from 'react-router-dom';
import styles from '../css/Login.module.css';
import Image from '../Assets/SignUp.png'; 
import TxtImage from '../Assets/Vector.png';
import { getDatabase, ref, push, set } from 'firebase/database';
import { auth, database, app } from '../firebase/firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
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


export default function SignUp() {
  const [username, setUsername] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
    const showToast = (message) => {
      setToastMessage(message);
      setTimeout(() => {
        setToastMessage('');
      }, 3000); // Hide the toast after 3 seconds
    };

    const gotosignin = (message) =>{
      showToast(message);
      setTimeout(()=>{
        window.location.href = "/signin";
      }, 5000);
    };


  const handleGoogleSignIn = async () => {
    const username = prompt('Please enter your username:');
    
    if (!username) {
      // Handle case where username is not provided
      showToast('Username is required for registration.');
      return;
    }
  
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await updateProfile(user, { displayName: username });
      const usersRef = ref(database, 'users');
      const newUserRef = push(usersRef);
      await set(newUserRef, {
        username: username,
        email: user.email,
        first: 0
      });
      // You can handle the sign-in success here
      showToast('Google sign-in successful');
      const redirectUrl = `/setup?username=${encodeURIComponent(username)}&email=${encodeURIComponent(user.email)}`;
      window.location.href = redirectUrl;
    } catch (error) {
      // Handle sign-in errors
      console.error('Google sign-in error:', error.message);
    }
  };
  


  const handleSubmit = async (event) => {
    event.preventDefault();
     // Retrieve the values entered by the user
    const userData = {
    username: username,
    email: email,
    password: password,
    confirmPassword: confirmPassword
  };

  // Now you can use userData object to access the entered values
  console.log(userData);

  if(password ==confirmPassword){
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });
      const usersRef = ref(database, 'users');
      const newUserRef = push(usersRef);
      await set(newUserRef, {
        username: username,
        email: email,
        first: 0
      });
      // Here, you can handle the user registration success
      console.log('User registered:', user);
      // showToast('User registered successfully');
      await sendEmailVerification(user);
      //const redirectUrl = `/setup?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;
      gotosignin("A verification mail has been sent to your email, please follow the instructions to successfully register your account.");
    } catch (error) {
      // Handle registration errors
      console.error('Registration error:', error.message);
      if (error.code === 'auth/email-already-in-use') {
        showToast('Email is already in use.');
      } else if (error.code === 'auth/weak-password') {
        showToast('Password should be at least 6 characters.');
      } else {
        showToast('Registration failed. Please try again later.');
      }
    }
      console.log('Form submitted');
  }else{
      console.log('Password does not match, registration error');
      showToast('Password does not match, registration error');
    
  }
  };
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  return (
    <div className='hero' style={{overflow: "hidden"}}>
      <video autoPlay loop muted playsInline className='back-video' style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'fixed', top: 0, left: 0, zIndex: -1 }} onLoadedMetadata={handleVideoLoaded}>
          <source src={reg} type='video/mp4' />
        </video>
  
        {videoLoaded && (
          <>
        <div className='formdiv' style={{marginRight:"15vw", scale:"0.9", borderRadius:"40px", padding:"30px", animation: 'slideIn 1s ease forwards', backgroundColor:"#E5E5E5", display:"flex", alignItems:"center", flexDirection:"column"}} >
        
        <h1 className="sign-up-title">Create an account</h1>
        <form onSubmit={handleSubmit} className="sign-up-form">
          <div className="form-field">
            <label htmlFor="username" className="form-label">
            </label>
            <input
            
              type="text"
              id="username"
              value={username}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
              style={{width:"20vw", color:'#1B4375',}}
            />
          </div>
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              
            </label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder='Email Address'
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              style={{width:"20vw", color:'#1B4375'}}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password" className="form-label">
            </label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              style={{width:"20vw", color:'#1B4375'}}
            />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label"> 
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              placeholder=' Confirm Password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              style={{width:"20vw", color:'#1B4375'}}
            />
          </div>
          <div className='form-field'>
          <button type="submit" className={styles.button} style={{ marginLeft:"15px", width:"20vw" ,fontWeight:"bold", scale:"0.95",transition: "transform 0.3s ease", backgroundColor:"#1B4375", transform:"3s ease"}} onMouseEnter={(e)=>{
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
            }}
            onMouseUp={(e)=>{
              e.target.style.backgroundColor="#A6E4F6"
            }}>
              Create Account
            </button>
          <p></p>
          {/* <button onClick={handleGoogleSignIn} className="google-sign-in-button">Sign Up: Google</button> */}
          <h5 style={{color:"#1B4375", paddingLeft:"3.4vw"}}>
            Don't have an account? <Link to ="/SignIn">Sign In</Link>
          </h5>
          </div>
        </form>
          
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
  <div class="iconz"><a href="https://vimeo.com/724877299" target='_blank'><img src={vimeo} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 1"/></a></div>
    <div class="iconz"><a href="https://github.com/TheFirstPrototype" target='_blank'><img src={github} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 2"/></a></div>
    <div class="iconz"><a href="https://twitter.com/BeAware4Deaf" target='_blank'><img src={twitter} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 3"/></a></div>
    <div class="iconz"><a href="https://www.facebook.com/BeAware4Deaf" target='_blank'><img src={facebook} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 4"/></a></div>
    <div class="iconz"><a href="https://www.linkedin.com/showcase/BeAware4Deaf" target='_blank'><img src={linkedin} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 5"/></a></div>
    <div class="iconz"><a href="https://www.instagram.com/BeAware4Deaf/" target='_blank'><img src={instagram} onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(1.2)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.opacity = "1";
      e.target.style.transform = "scale(1)"; // Restore original scale
    }} alt="Icon 6"/></a></div>
    <div class="iconx"><a href="mailto:hi@deafassistant.com" target='_blank'><img src={email1} alt="Icon 7"/></a></div>
  </div>
</div>
        </>
        )}
        
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}