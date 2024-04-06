import React, { useEffect, useState } from 'react';
import '../css/ManageProfile.css';
import MenuItems from './MenuItems';
import {doPasswordReset } from  '../firebase/auth';
import {ref, orderByChild,equalTo, query, get, update } from 'firebase/database';
import {database} from '../firebase/firebase';
import {useAuth} from '../contexts/authContext'
import { useNavigate } from 'react-router-dom';
import blImage from '../Assets/BeawareL.png';
import UserProfile from './Userprofile';
import Phonemenu from './Phonemenu'
import { ProfileForm, PasswordResetForm, DeleteAccountForm } from './Forms';
import CustomCaptcha from './CustomCaptcha';
import { getAuth, updateProfile } from 'firebase/auth';
function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}

export const ManageProfile = () => {
  const navigate = useNavigate();

  const {currentUser, userLoggedIn} = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [deleteText, setDeleteText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [iscapv, setiscapv] = useState(false);
  const [islo, setislo] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); 
  };

  const questions = [
    {
      question: "Identify the car",
      options: [
        { id: 1, label: "Car" },
        { id: 2, label: "Bike" },
        { id: 3, label: "Ship" },
        { id: 4, label: "Flight" }
      ],
      answer: 1 // The correct answer ID
    },
    {
      question: "Identify the bike",
      options: [
        { id: 1, label: "Car" },
        { id: 2, label: "Bike" },
        { id: 3, label: "Ship" },
        { id: 4, label: "Flight" }
      ],
      answer: 2 // The correct answer ID
    },
    {
      question: "Identify the ship",
      options: [
        { id: 1, label: "Car" },
        { id: 2, label: "Bike" },
        { id: 3, label: "Ship" },
        { id: 4, label: "Flight" }
      ],
      answer: 3 // The correct answer ID
    },
    {
      question: "Identify the flight",
      options: [
        { id: 1, label: "Car" },
        { id: 2, label: "Bike" },
        { id: 3, label: "Ship" },
        { id: 4, label: "Flight" }
      ],
      answer: 4 // The correct answer ID
    }
  ];
  


  useEffect(() => {
    if(!userLoggedIn){
      window.location.href = "/signin"
    }
    setUsername(currentUser.displayName);
    setEmail(currentUser.email);

    const user = currentUser;
    if (user) {
      const displayName = user.displayName;
      // showToast(`Logged in as ${displayName}`);
    } else {
      showToast('User not logged in');
    }

    const passForm = document.getElementById('passform');
    const delf = document.getElementById('deleteform');
    if(delf) { delf.style.display = 'none';}
    if (passForm) { passForm.style.display = 'none';}

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
       

      } else {
        setIsMobile(false);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call handleResize initially
    handleResize();

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
    
  }, []);

  
  
  const handleEditUsername = async () => {
    const newUsername = prompt('Enter new username:');
    if (newUsername) {
      try {
        // Find the user with the current email
        const userQuery = query(ref(database, 'users'), orderByChild('email'), equalTo(email));
        const snapshot = await get(userQuery);
        
        if (snapshot.exists()) {
          // Get the user ID
          const userId = Object.keys(snapshot.val())[0];
  
          // Update the user's username in the database
          const updates = {};
          updates[`users/${userId}/username`] = newUsername;
          await update(ref(database), updates);
          const auth = getAuth();
        const user = auth.currentUser;
        await updateProfile(user, {
          displayName: newUsername
        });
  
          // Update the username in the state
          setUsername(newUsername);
          showToast('Username updated successfully');
          window.location.href="/manage";
          sessionStorage.setItem('username', newUsername);
        } else {
          showToast('User not found');
        }
      } catch (error) {
        console.error('Error updating username:', error);
        showToast('Error updating username');
      }
    }
  };

  
  const handleChangePassword = () => {
    if (oldPassword !== email) {
      alert("Your Email is incorrect.");
      return;
    }

    doPasswordReset(email)
    .then(() => {
      alert("Password reset email sent successfully")
      showToast("Password reset email sent successfully")
      return;
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
    });
}

const runmob = () => {
  const proform = document.getElementById('profileform')
  const passForm = document.getElementById('passform');
  const delf = document.getElementById('deleteform');
  const fl =sessionStorage.getItem('fl')

  if(fl){
      if(fl=='cg'){
        if(delf) { delf.style.display = 'none';}
        if (passForm) { passForm.style.display = 'block';}
        if(proform) { proform.style.display = 'none'}
        showToast("Password reset email sent successfully");
      }
      if(fl=='dl'){
        if(delf) { delf.style.display = 'block';}
        if (passForm) { passForm.style.display = 'none';}
        if(proform) { proform.style.display = 'none'}
      }
  }
  else{
    
    if(delf) { delf.style.display = 'none';}
    if (passForm) { passForm.style.display = 'none';}
  }
  
}
useEffect(() => {
  if (isMobile) {
    runmob();
  }
  else{
    runmob();
  }
}, [isMobile]);


// const handledelete = ()=>{
//   setiscapv(false);
//   if(isCaptchaVerified){
//     showToast("captcha verified successfully");
//     setTimeout(() => {
//       window.location.href="/manage"
//     }, 1000);
//   }
//   else if(!isCaptchaVerified){
//     showToast("caption incorrect");
//     setTimeout(() => {
//       window.location.href="/manage"
//     }, 1000);
//   }
// }
  // HTMLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

  return (
    <div className="custom-cursor">
    {isMobile ? (
      // Content for mobile view
      <div>
        {/* Your mobile content here */}
        <div style={{backgroundColor:"#1B4375", width: "100vw", height:"200px"}}>
          <tr><Phonemenu /></tr>
          <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img src={blImage} alt="Beaware Logo" style={{ width: "50vw", height: "10vh", paddingTop:"30px"}} />
          </div>
        </div>
        <table>
        <td>
          <tr>
          <div style={{display: "flex", flexDirection: "row", width: "100vw", justifyContent: "space-between", marginTop:"10px"}}>
            <button 
       className="profile-button"
        style={{ border: "2px solid grey", width: "100%", padding: "10px",  cursor: "url('../Assets/bclick.png'), pointer", outline: "none",backgroundColor: "transparent",borderRadius: "20px",transition: "transform 0.3s ease", marginRight: "10px"}} 
        onClick={() =>
        {
            sessionStorage.clear();
            console.log("Change password clicked")
            const profileForm = document.getElementById("profileform");
            const passForm = document.getElementById('passform');
            const delForm = document.getElementById('deleteform');
            if(delForm) { delForm.style.display = 'none';}
            if (passForm) {passForm.style.display = 'none';}
            if (profileForm) {profileForm.style.display = "block";}
        }
        }
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}
      >
        Edit Profile
      </button>
      <button 
       className="profile-button"
        style={{ border: "2px solid grey", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none",backgroundColor: "transparent",borderRadius: "20px",transition: "transform 0.3s ease", marginRight: "10px"}} 
        onClick={() => 
          {
          sessionStorage.setItem('fl','cg');
          const profileForm = document.getElementById("profileform");
          const passForm = document.getElementById('passform');
          const delForm = document.getElementById('deleteform');
          if(delForm) {delForm.style.display = 'none';}
          if (passForm) {passForm.style.display = 'block';}
          if (profileForm) {profileForm.style.display = "none";}
        }
       }
       onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#1B4375";
        e.target.style.transform = "scale(1.07)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }}
      >
        Change Password
      </button>
      <button 
       className="profile-button"
        style={{ border: "2px solid grey", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none",backgroundColor: "transparent",borderRadius: "20px",transition: "transform 0.3s ease", marginRight: "10px"
        }} 
        onClick={() => 
          {
            sessionStorage.setItem('fl','dl');
            const profileForm = document.getElementById("profileform");
            const delForm = document.getElementById('deleteform');
            const passForm = document.getElementById('passform');
            if(delForm) {
              delForm.style.display = 'block';
            }
            
            if (profileForm) 
            {
              profileForm.style.display = "none";
            }
            if (passForm) {
              passForm.style.display = 'none';
          }
          }
    
        }
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}
      >
        Delete Account
      </button>
            
            </div>
          </tr>
          <div style={{width:"100vw", justifyContent: "center"}}>
          <div class="card">
          <ProfileForm
            username={username}
            email={email}
            handleEditUsername={handleEditUsername}
          />
          <p></p>
          </div>
          <div class="card">
          <PasswordResetForm
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            handleChangePassword={handleChangePassword}
            email={email}
          /><p></p></div>
          <div class="card">
          <DeleteAccountForm
            deleteText={deleteText}
            setDeleteText={setDeleteText}
          /></div></div>
           
          

        </td>
          
          
        </table>
        
      </div>
    ) : (
      // Content for desktop view
      <div>
        {/* Your desktop content here */}

        <table style={{ width: "100%", height: "100%"}}>
      
      <tr>
        <td className="signupd" style={{ width: "20%"}}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ marginBottom: "auto" }}> {/* Pushes the image to the top */}

      <MenuItems initialActiveItem="profile" />
      </div>
  </div>
        </td>
        <td className="rtab" colspan="2">
          <div class="rtab">
          <table style={{ width: "100%", height: "100%" }}>
            <tr>
              <td style={{ width: "50%", verticalAlign: "top"}}>
    
                {/* Left of the right */}
                <p></p>
                <UserProfile/>
                <p></p>
    
    
    
                {/* formsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss are hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */}
                <div style={{paddingTop: "45px"}}></div>
                <div class="card">
          <ProfileForm 
            username={username}
            email={email}
            handleEditUsername={handleEditUsername}
          />
          </div>
          <div class="card">
          <PasswordResetForm
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            handleChangePassword={handleChangePassword}
            email={email}
          /></div>
          <div class="card">
          <DeleteAccountForm
            deleteText={deleteText}
            setDeleteText={setDeleteText}
            setiscapv={setiscapv}
            showToast={showToast}
          />
          {iscapv && (<CustomCaptcha setislo={setislo} currentUser={currentUser} setiscapv= {setiscapv} deletetext={deleteText} questions={questions} onImageClick={setIsCaptchaVerified} showToast={showToast} />)}
          
          
      </div>
      {islo &&(<><p></p><h5 style={{paddingLeft:"2.5vw", color:"#1B4375", fontWeight:"bold"}}>Loading.. please hold on</h5></>)}
              </td>
    
              <td style={{ width: "20%", height: "100%", paddingRight:"40px", verticalAlign: "top"}}>
    
                {/* Right of Right */}
                
                <div className="button-container">
                <p></p>
                <div style={{ marginRight: "50px" }}></div>
      <div style={{ marginRight: "30px" }}></div>
      <button 
       className="profile-button"
        style={{ animation: 'slideIn1 2s ease forwards',border: "2px solid #1B4375", width: "100%", padding: "10px",  cursor: "url('../Assets/bclick.png'), pointer", outline: "none",backgroundColor: "transparent",borderRadius: "20px",transition: "transform 0.3s ease", color:"#1B4375", fontWeight:"bold"}} 
        onClick={() =>
        {
            sessionStorage.clear();
            console.log("Change password clicked")
            const profileForm = document.getElementById("profileform");
            const passForm = document.getElementById('passform');
            const delForm = document.getElementById('deleteform');
            if(delForm) { delForm.style.display = 'none';}
            if (passForm) {passForm.style.display = 'none';}
            if (profileForm) {profileForm.style.display = "block";}
        }
        }
        onMouseEnter={(e) => {
          e.target.style.border= "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color="#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border= "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color="#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}
      >
        Edit Profile
      </button>
      <p></p>
      <button 
       className="profile-button"
        style={{animation: 'slideIn1 2s ease forwards', border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none",backgroundColor: "transparent",borderRadius: "20px",transition: "transform 0.3s ease", color:"#1B4375", fontWeight:"bold"
        }} 
        onClick={() => 
          {
            sessionStorage.setItem('fl','cg');
          const profileForm = document.getElementById("profileform");
          const passForm = document.getElementById('passform');
          const delForm = document.getElementById('deleteform');
          if(delForm) {delForm.style.display = 'none';}
          if (passForm) {passForm.style.display = 'block';}
          if (profileForm) {profileForm.style.display = "none";}
        }
       }
       onMouseEnter={(e) => {
        e.target.style.border= "2px solid #E3ECF2";
        e.target.style.backgroundColor = "#1B4375";
        e.target.style.color="#E3ECF2";
        e.target.style.transform = "scale(1.07)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.border= "2px solid #1B4375";
        e.target.style.backgroundColor = "transparent";
        e.target.style.color="#1B4375";
        e.target.style.transform = "scale(1)"; // Restore original scale
      }}
      >
        Change Password
      </button>
      <p></p>
      <button 
       className="profile-button"
        style={{ animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none",backgroundColor: "transparent",borderRadius: "20px",transition: "transform 0.3s ease", color:"#1B4375", fontWeight:"bold"
        }} 
        onClick={() => 
          {
            sessionStorage.setItem('fl','dl');
          
            console.log("Change password clicked")
            const profileForm = document.getElementById("profileform");
            const delForm = document.getElementById('deleteform');
            const passForm = document.getElementById('passform');
            if(delForm) {
              delForm.style.display = 'block';
            }
            
            if (profileForm) 
            {
              profileForm.style.display = "none";
            }
            if (passForm) {
              passForm.style.display = 'none';
          }
          }
    
        }
        onMouseEnter={(e) => {
          e.target.style.border= "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color="#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border= "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color="#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}
      >
        Delete Account
      </button>
      </div>
    </td>
            </tr>
          </table>
          </div>
        </td>
      </tr>
      
    </table>

      </div>
    )}
    
    {toastMessage && <Toast message={toastMessage} />}
   
</div>
  );
}

export default ManageProfile;
