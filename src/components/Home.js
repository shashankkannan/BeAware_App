import React, { useEffect, useState } from 'react';
import '../css/ManageProfile.css';
import TxtImage from '../Assets/edit.png';
import play from '../Assets/play.png'; 
import st from '../Assets/st.png'; 
import ct from '../Assets/ctrl.png'; 
import Image from '../Assets/SignUp.png'; 
import MenuItems from './MenuItems';
import UserProfile from './Userprofile';
import profileicon from '../Assets/profile.png';
import streamicon from '../Assets/stream.png'; 
import {database} from '../firebase/firebase';
import {useAuth} from '../contexts/authContext'
import dash from '../Assets/dashboard.png'; 
import eye from '../Assets/eye.png'; 
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import GetStreams from "./GetStreams";
import { dstream,cstream } from '../services/apiservices';
import { updateUserStreamMain, resetStreamMainValue, deleteStream, updateUserStreamMain1 } from './updateUserStreamMain';

import { useLocation } from 'react-router-dom';
import {getDatabase, ref, push, set, orderByChild, onChildAdded,equalTo, child, query, get } from 'firebase/database';

import RenameStream from './RenameStream';
import RecolorStream from './RecolorStream';
import RelogoStream from './RelogoStream';
import Loading from './Loading';


function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}


export const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ssnm = queryParams.get('ssnm');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const {currentUser, userLoggedIn} = useAuth();
  const [streamsData, setStreamsData] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedStreamain, setSelectedStreammain] = useState();
  const [selectedStreacolor, setSelectedStreamcolor] = useState();
  const [selectedStrealogo, setSelectedStreamlogo] = useState();
  const [selectedStreatime, setSelectedStreatime] = useState();
  const [mainurl, setmainurl] = useState();
  const [isBlockVisible, setIsBlockVisible] = useState(false);  
  const [iscontrol, setiscontrol] = useState(false);  
  const [ih, setih] = useState(false); 
  const [playhover,setplayhoveer] = useState(false)
  const [bckstr, setbckstr] = useState(null);
  const [bcklogo, setbcklogo] = useState(null);
  const [bckcol, setbckcol] = useState(null);
  const [ismain, setismain] = useState(false); 
  const [isconvis, setisconvis] = useState(true); 
  const [iscn, setiscn] = useState(false); 
  const [iscc, setiscc] = useState(false); 
  const [iscl, setiscl] = useState(false);
  const [islo, setislo] = useState(false);
  const [timeDifference, setTimeDifference] = useState('');
 

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // Hide the toast after 3 seconds
  };
  
  useEffect(() => {
    
    setUsername(currentUser.displayName);
    setEmail(currentUser.email);
    
    if (ssnm) {
      showToast(`you have selected ${ssnm}`);
      fetchStreamsData(currentUser.email, ssnm);
    } else {
      // Fetch default data if no stream name is provided
      fetchStreamsData(currentUser.email);
    }
    
      // showToast('User not signed in. Redirecting to sign-in page...');
      // setTimeout(() => {
      //   // Redirect to sign-in page
      //   window.location.href = '/signin'; 
      // }, 3000);
    
    
  }, []);

const nameavailable = ()=>
{
  
  if(!iscn){setiscc(false);setiscl(false);setiscn(true);if(ismain){ setisconvis(false);setiscontrol(false);}}
  else if(iscn){setiscn(false); if(ismain){ ictrlin();setisconvis(true);}}
}
const coloravailable = ()=>
{
  if(!iscc){setiscn(false);setiscl(false);setiscc(true);if(ismain){setisconvis(false);setiscontrol(false);}}
  else if(iscc){setiscc(false);if(ismain){setisconvis(true);} }
}
const logoavailable = ()=>
{
  if(!iscl){setiscc(false);setiscn(false);setiscl(true);if(ismain){setisconvis(false);setiscontrol(false);}}
  else if(iscl){setiscl(false); if(ismain){setisconvis(true);}}
}
  // const fetchStreamsData = async (userEmail) => {
  //   const streamsRef = ref(database, 'users');
  
  //   try {
  //     const queryRef = query(streamsRef, orderByChild('email'), equalTo(userEmail));
  //     const snapshot = await get(queryRef);
  
  //     const userData = snapshot.val();
  
  //     for (const userId in userData) {
  //       const user = userData[userId];
  //       if (user.streams) {
  //         for (const streamName in user.streams) {
  //           const stream = user.streams[streamName];
  //           if (stream.main === 1) { // Filter streams with main = 1
  //             setSelectedStreammain(streamName);
  //             setSelectedStreamcolor(stream.colorhex);
  //             setSelectedStreamlogo(stream.logoURL)
  //             setmainurl(stream.mainurl);
  //             console.log(streamName);
  //             return; // Exit loop after setting selected stream
  //           }
  //         }
  //       }
  //     }
  
  //   } catch (error) {
  //     console.error("Error fetching streams data:", error);
  //   }
  // };

  const fetchStreamsData = async (userEmail, ssnm) => {
    const streamsRef = ref(database, 'users');
  
    try {
      const queryRef = query(streamsRef, orderByChild('email'), equalTo(userEmail));
      const snapshot = await get(queryRef);
  
      const userData = snapshot.val();
  
      for (const userId in userData) {
        const user = userData[userId];
        if (user.streams) {
          for (const streamName in user.streams) {
            console.log(`${streamName} === ${ssnm}`);
            if (streamName === ssnm) {
              console.log(streamName);
              const stream = user.streams[streamName];
              setSelectedStreammain(streamName);
              setSelectedStreamcolor(stream.colorhex);
              setSelectedStreamlogo(stream.logoURL);
              setmainurl(stream.mainurl);
              setSelectedStreatime(stream.cd);
              if(stream.main===1){
                setismain(true);
              }
              return; // Exit loop after setting selected stream
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching streams data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const selectedTime = new Date(selectedStreatime);
      const difference = currentTime - selectedTime;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeDifference(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedStreatime]);
  

  
  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
    setIsBlockVisible(true);
  };
  const handleCloseBlock = () => {
    setIsBlockVisible(false);
    setiscontrol(false);
  };

  const handlestream = () => {
    window.location.href = '/streams';
  };
  const handleHome= () => {
    window.location.href = '/home';
  };
  

  
const handleRemovemain = async (streamNameToUpdate) =>{
showToast("Removing from Main");
await resetStreamMainValue(currentUser, streamNameToUpdate);
await fetchStreamsData(currentUser.email);
setTimeout(deloldstream(streamNameToUpdate), 1500);
setTimeDifference('');
setSelectedStream('');

}

const playremove = () =>{
setbckstr(selectedStreamain);
setbcklogo(selectedStrealogo);
setbckcol(selectedStreacolor);
handleRemovemain(selectedStreamain)
setSelectedStreammain('');
setSelectedStreamlogo('');
setSelectedStreamcolor('');
setSelectedStreatime('');

}

const deloldstream = (streamNameToUpdate)=>{
  let deleteRequest = {
    "oldName": streamNameToUpdate
}

// Delete the stream
dstream(deleteRequest).then((response) => {
    console.log(response);
    if (response.data.includes("deleted successfully") ){
        console.log(`Stream  deleted successfully.`);
    } else {
        console.log(`Error deleting stream: ${response}`);
    }
});
}

const handlecreating =(str, coh, flu)=>{
  let payload = {
      "name": str,
      "bannerColor": coh,
      "logoUrl": flu
     }
  cstream(payload).then((response)=>{
    console.log(response);
    if(response.data.filePath){
      console.log('Stream is live again!');
    }
    else{
      const responseData = response.data;
      const message = responseData.message;
      const dynamicPart = message.split('https://deafassistant.com/')[1].split(' ')[0];
      if (message.includes("exists")) {
        showToast(`Stream for ${dynamicPart} already exists`);
    } else {
      showToast(`Error occured while creating stream for ${dynamicPart}`);
    }

    }
    
    
  });

}

const handlemakeMain = async (streamNameToUpdate) => {
  if(bckstr){setSelectedStreammain(bckstr);}
  if(bckcol){setSelectedStreamcolor(bckcol);}
  showToast(`${streamNameToUpdate} is now Live`);
  await updateUserStreamMain1(currentUser, streamNameToUpdate, setSelectedStreatime);
  handlecreating(bckstr,bckcol,bcklogo);
  await fetchStreamsData(currentUser.email);
  setSelectedStreammain(bckstr);
}
  
const handleDelete = async (streamNameToDelete) => {
  showToast(`${streamNameToDelete} is now deleted`);
  await deleteStream(currentUser, streamNameToDelete);
  await fetchStreamsData(currentUser.email);
  setSelectedStreammain('');
}

const ihoverin = () =>{setih(true)}
const ihoverout =() =>{setih(false)}
const ictrlin = () =>{setiscontrol(true); setiscn(false); setiscl(false); setiscc(false);setisconvis(false);}
const ictrlout =() =>{setiscontrol(false);setisconvis(true);}
  
  return (
    <div className="custom-cursor">
    <Link rel='preconnect' href="https://fonts.gstatic.com" crossorigin />
    <meta name='view_transition' content='same-origin'/>
    <div>
    
    <table style={{ width: "100%", height: "100%"}}>
  <tr>
    <td className="signupd" style={{ width: "20%"}}>
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "auto" }}>
    <MenuItems initialActiveItem="" />
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


            {/* All the streamssssssssssssssssssssssss are displayed hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */}
            {/* <GetStreams streamsData={streamsData} handleStreamClick={handleStreamClick} /> */}
            {ismain && (
              <>
  <div class="container">
    <div
      class="circle circle1"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column",
        boxShadow: selectedStreamain ? "0 4px 14px 8px rgba(0, 128, 0, 106)" : "0 4px 14px 8px rgba(255, 0, 0, 106)"
      }}
      onMouseEnter={() => {
        document.querySelector('.circle1 h3').style.display = 'none';
        document.querySelector('.circle1 h2').style.display = 'block';
      }}
      onMouseLeave={() => {
        document.querySelector('.circle1 h3').style.display = 'block';
        document.querySelector('.circle1 h2').style.display = 'none';
      }}
    >
      <h3 style={{ color: "#E3ECF2" }}>{selectedStreamain}</h3>
      <h2 style={{ color: selectedStreacolor ? selectedStreacolor : 'transparent', display: "none" }}>{selectedStreacolor}</h2>
    </div>

    <div
      className="circle circle2"
      style={{
        boxShadow: selectedStreamain ? "0 4px 14px 8px rgba(0, 128, 0, 106)" : "0 4px 14px 8px rgba(255, 0, 0, 106)",
        backgroundColor: selectedStreacolor ? selectedStreacolor : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column"
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#E3ECF2";
        ihoverin();
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = selectedStreacolor ? selectedStreacolor : 'transparent';
        ihoverout();
      }}
    >
      <div>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mainurl)}`}
          alt={selectedStreamain}
          style={{ width: '100px', height: '100px', display: ih ? "block" : "none" }}
          onMouseEnter={(e) => {
            e.target.style.cursor = "pointer";
          }}
        />
        <div class="scan" style={{ display: ih ? "none" : "block" }}>
          <div class="qrcode"></div>
          <h4>Hover Me to Scan</h4>
          <div className='border'></div>
        </div>
      </div>
      <h3 style={{ color: selectedStreacolor ? selectedStreacolor : 'transparent' }}>{selectedStreacolor}</h3>
    </div>

    {/* <button onClick={() => iscontrol ? `${ictrlout()}` : `${ictrlin()}`}>control</button> */}

   
  </div>
  
   <img
   src={ct}
   onMouseEnter={(e) => {
     e.target.style.cursor = "pointer"
     e.target.style.transform = "scale(1.00)";
   }}
   onMouseLeave={(e) => {
     e.target.style.transform = "scale(0.8)";
   }}
   style={{
     animation: 'slideInAnimation1 1s ease-in forwards',
     transition: "transform 0.3s ease",
     shapeRendering: "0 4px 8px 0 rgba(0,0,0,0.2)",
     marginLeft: "290px",
     marginTop: "30px",
     width: "50px",
     height: "50px",
     transform: "scale(0.8)"
   }}
   onClick={() => iscontrol ? ictrlout() : ictrlin()}
 />
 </>
)}
{!ismain && (
  <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
     <button onClick={nameavailable} style={{
        animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none", backgroundColor: "transparent", borderRadius: "20px", transition: "transform 0.3s ease", color: "#1B4375", fontWeight: "bold"
      }}
        onMouseEnter={(e) => {
          e.target.style.border = "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color = "#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border = "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}>Change Name</button>
        <p></p>
         <button onClick={coloravailable} style={{
        animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none", backgroundColor: "transparent", borderRadius: "20px", transition: "transform 0.3s ease", color: "#1B4375", fontWeight: "bold"
      }}
        onMouseEnter={(e) => {
          e.target.style.border = "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color = "#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border = "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}>Update Color of stream</button>
        <p></p>
         <button onClick={logoavailable} style={{
        animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none", backgroundColor: "transparent", borderRadius: "20px", transition: "transform 0.3s ease", color: "#1B4375", fontWeight: "bold"
      }}
        onMouseEnter={(e) => {
          e.target.style.border = "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color = "#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border = "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}>Update logo of the stream</button>
    <p></p>
  </div>
)}
         

          </td>

          <td style={{ width: "20%", height: "100%", paddingRight:"40px", verticalAlign: "top"}}>

            {/* Right of Right */}
            
            
            <div className="button-container">
                <p></p>
                <div style={{ marginRight: "50px" }}></div>
      <div style={{ marginRight: "30px" }}></div>
  <button 
    style={{ 
      animation: 'slideIn1 2s ease forwards',
      border: "2px solid #1B4375", 
      width: "100%", 
      padding: "10px", 
      color:"#1B4375",
      fontWeight:"bold", 
      cursor: "pointer", 
      outline: "none",
      backgroundColor: "transparent",
      borderRadius: "20px",
      transition: "transform 0.3s ease"
    }} 
    onClick={() => 
      {
      
      console.log("Manage Streams clicked")
      window.location.href = "/setup"
    }
   }
   onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#1B4375";
    e.target.style.color="#E3ECF2";
    e.target.style.transform = "scale(1.07)"; 
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color="#1B4375";
    e.target.style.transform = "scale(1)"; 
  }}
  >
    Create Stream
  </button>
{/* </div> */}
  <p></p>
  {/* <div style={{ marginRight: "50px" }}></div>
  <div style={{ marginRight: "30px" }}> */}
  <button 
    style={{ 
      animation: 'slideIn1 2s ease forwards',
      border: "2px solid #1B4375", 
      width: "100%", 
      padding: "10px", 
      color:"#1B4375",
      fontWeight:"bold", 
      cursor: "pointer", 
      outline: "none",
      backgroundColor: "transparent",
      borderRadius: "20px",
      transition: "transform 0.3s ease"
    }} 
    onClick={() => 
      {
          // Assuming the PDF files are stored in the public directory
          const filePath = `/pdfs/ConferenceCaptioning-Instructions.pdf`; // Adjust the file path accordingly
          const link = document.createElement("a");
          link.href = filePath;
          link.download = `ConferenceCaptioning-Instructions.pdf`;
          link.click();
        

    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#1B4375";
      e.target.style.color="#E3ECF2";
      e.target.style.transform = "scale(1.07)"; 
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color="#1B4375";
      e.target.style.transform = "scale(1)"; 
    }}
  >
    Download Instruction Sheet
  </button>
  
  </div>

  {/* </div> */}
  {ismain && (
  <div style={{animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscontrol ? 'block' : 'none' }}>
  {iscontrol && (
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <p ></p>
      
      <div onClick={()=>{
        alert("you clicked")
        if(selectedStreamain)playremove();
        else if(!selectedStreamain && bckstr) handlemakeMain(bckstr);
        else if(!selectedStreamain && !bckstr)showToast("No stream is chosen, go to streams page to activate.")


      }} style={{ background: selectedStreamain? "red" : "green"}} className='play-btn' onMouseEnter={(e)=>{setplayhoveer(true); e.target.style.cursor="pointer";showToast(`the logo is ${bcklogo} and the color is ${bckcol}`)}} onMouseLeave={()=>{setplayhoveer(false)}}>
      <img 
    src={
      selectedStreamain ? st :
      bckstr ? play : play
      // (() => {
      //   showToast('No stream is live, directing to manage streams page');
      //   return st; // or specify a default image URL if needed
      // })()
    }

    style={{ animation: 'zoomIn 0.6s ease forwards', width: "50px", height: "50px", transform: "scale(0.8)"}} 
    alt="Play" 
  />


</div>
<p></p>
<p style={{color:"#1B4375", fontWeight:"bold", fontSize:"1em"}}>{timeDifference}</p>
      <p ></p>
     
      <p></p>
      <button style={{
      animation: 'zoomIn 0.6s ease forwards', 
      border: "2px solid #1B4375", 
      width: "100%", 
      padding: "10px", 
      cursor: "pointer", 
      outline: "none",
      backgroundColor: "transparent",
      color: "#1B4375",
      fontWeight:"bold",
      borderRadius: "20px",
      transition: "transform 0.3s ease"
    }}  onClick={handleCloseBlock}  onMouseEnter={(e) => {
        e.target.style.color="#E3ECF2"
        e.target.style.backgroundColor = "#1B4375";
        e.target.style.transform = "scale(1.01)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color="#1B4375"
        e.target.style.transform = "scale(1)"; // Restore original scale
      }}>Close</button>
      
      {/* <button style={{ 
      animation: 'zoomIn 0.6s ease forwards', 
      border: "2px solid #ff6961", 
      width: "100%", 
      padding: "10px", 
      marginTop:"5px",
      cursor: "pointer", 
      outline: "none",
      backgroundColor: "transparent",
      color: "#ff6961",
      fontWeight:"bold",
      borderRadius: "20px",
      transition: "transform 0.3s ease"
    }}  onClick={()=> handleDelete(selectedStreamain)}  onMouseEnter={(e) => {
        e.target.style.color="#E3ECF2"
        e.target.style.backgroundColor = "#ff6961";
        e.target.style.transform = "scale(1.01)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color="#ff6961"
        e.target.style.transform = "scale(1)"; // Restore original scale
      }}>Delete stream</button> */}
      
    </div>
  )}
</div>
  )}

{ismain && (
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: isconvis ? 'block' : 'none' }}>
  {isconvis && (
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>More information</h3>
      <p ></p>
      <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p>
      <p></p>
      <div style={{ display:  selectedStreamain ?'flex':'none', flexDirection: 'column' }}>
     <button onClick={nameavailable} style={{
        animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none", backgroundColor: "transparent", borderRadius: "20px", transition: "transform 0.3s ease", color: "#1B4375", fontWeight: "bold"
      }}
        onMouseEnter={(e) => {
          e.target.style.border = "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color = "#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border = "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}>Change Name</button>
        <p></p>
         <button onClick={coloravailable} style={{
        animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none", backgroundColor: "transparent", borderRadius: "20px", transition: "transform 0.3s ease", color: "#1B4375", fontWeight: "bold"
      }}
        onMouseEnter={(e) => {
          e.target.style.border = "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color = "#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border = "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}>Update Color of stream</button>
        <p></p>
         <button onClick={logoavailable} style={{
        animation: 'slideIn1 2s ease forwards', fontWeight: "bold", border: "2px solid #1B4375", width: "100%", padding: "10px", cursor: "url('../Assets/bclick.png'), pointer", outline: "none", backgroundColor: "transparent", borderRadius: "20px", transition: "transform 0.3s ease", color: "#1B4375", fontWeight: "bold"
      }}
        onMouseEnter={(e) => {
          e.target.style.border = "2px solid #E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
          e.target.style.color = "#E3ECF2";
          e.target.style.transform = "scale(1.07)"; // Increase scale
        }}
        onMouseLeave={(e) => {
          e.target.style.border = "2px solid #1B4375";
          e.target.style.backgroundColor = "transparent";
          e.target.style.color = "#1B4375";
          e.target.style.transform = "scale(1)"; // Restore original scale
        }}>Update logo of the stream</button>
    <p></p>
  </div>
      <p></p>
      
    </div>
  )}
</div>
)}
{!ismain && (
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscc || iscn || iscl? 'none' : 'block' }}>
  
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>More information</h3>
      <p ></p>
      <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p>
      <p></p>
      
    </div>
  
</div>
)}
{!ismain && (
  <>
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscn ? 'block' : 'none' }}>
  
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Edit name</h3>
      <p ></p>
      {/* <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p> */}
      <p></p>
      <RenameStream 
      mn="0"
      name={selectedStreamain}
      showToast={showToast}
      setislo = {setislo}
      />
    </div>
  
</div>
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscc ? 'block' : 'none' }}>
  
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Edit color</h3>
      <p ></p>
      {/* <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p> */}
      <RecolorStream 
      mn="0"
      name={selectedStreamain}
      color={selectedStreacolor}
      showToast={showToast}
      setislo = {setislo}
      />
      <p></p>
      
    </div>

</div>
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscl ? 'block' : 'none' }}>
 
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Edit logo</h3>
      <p ></p>
      {/* <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p> */}
      <RelogoStream
      mn="0"
      name={selectedStreamain}
      logo={selectedStrealogo}
      showToast={showToast}
      setislo = {setislo}
      />
      <p></p>
      
    </div>

</div>
</>
)}

{ismain && (
  <>
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscn ? 'block' : 'none' }}>
  
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Edit name</h3>
      <p ></p>
      {/* <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p> */}
      <p></p>
      <RenameStream 
      mn="1"
      name={selectedStreamain}
      showToast={showToast}
      setislo = {setislo}
      />
    </div>
  
</div>
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscc ? 'block' : 'none' }}>
  
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Edit color</h3>
      <p ></p>
      {/* <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p> */}
      <RecolorStream 
      mn="1"
      name={selectedStreamain}
      color={selectedStreacolor}
      showToast={showToast}
      setislo = {setislo}
      />
      <p></p>
      
    </div>

</div>
<div style={{ animation:"slideInAnimation 1s ease-in-out forwards", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: iscl ? 'block' : 'none' }}>
 
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Edit logo</h3>
      <p ></p>
      {/* <p style={{color:"#1B4375"}}>To control the stream click on the hamburger icon</p> */}
      <RelogoStream
      mn="1"
      name={selectedStreamain}
      logo={selectedStrealogo}
      showToast={showToast}
      setislo = {setislo}
      />
      <p></p>
      
    </div>

</div>
</>
)}
{islo &&(<><p></p>
  <h5>Loading.. please hold on</h5></>)}

</td>
        </tr>
      </table>
      </div>
    </td>
  </tr>
</table>


{toastMessage && <Toast message={toastMessage} />}
 </div> 
 </div>
  );
}

export default Home;
