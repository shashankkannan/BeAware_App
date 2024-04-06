import React, { useEffect, useState } from 'react';
import '../css/ManageProfile.css';
import TxtImage from '../Assets/edit.png';
import backst from '../Assets/backst.png';
import userpic from '../Assets/user.png'; 
import Image from '../Assets/SignUp.png'; 
import MenuItems from './MenuItems';
import UserProfile from './Userprofile';
import profileicon from '../Assets/profile.png';
import golive from '../Assets/Golive.mp4';
import streamicon from '../Assets/stream.png'; 
import {database} from '../firebase/firebase';
import {useAuth} from '../contexts/authContext'
import RenameStream from './RenameStream.js';
import dash from '../Assets/dashboard.png'; 
import eye from '../Assets/eye.png'; 
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import GetStreams from "./GetStreams";
import { updateUserStreamMain, resetStreamMainValue, deleteStream, filltime } from './updateUserStreamMain';
import { cstream, dstream } from '../services/apiservices';
import {getDatabase, ref, push, set, orderByChild, onChildAdded,equalTo, child, query, get } from 'firebase/database';



function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}


export const Streams = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const {currentUser, userLoggedIn} = useAuth();
  const [streamsData, setStreamsData] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedStreammain, setSelectedStreammain] = useState(null);
  const [isBlockVisible, setIsBlockVisible] = useState(false);  
  const [isL, setisL] = useState(false);  
  const [editst, setEditst] = useState(false);

 const settingedit= () =>{

  // const selectedStreamQueryParam = encodeURIComponent(JSON.stringify(selectedStream.name));
  const url = `/home?ssnm=${selectedStream.name}`;

  // Redirect to the home page with the selectedStream parameter
  window.location.href = url;
  
 }

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // Hide the toast after 3 seconds
  };

  useEffect(() => {
    
    setUsername(currentUser.displayName);
    setEmail(currentUser.email);
    fetchStreamsData(currentUser.email)
    
      // showToast('User not signed in. Redirecting to sign-in page...');
      // setTimeout(() => {
      //   // Redirect to sign-in page
      //   window.location.href = '/signin'; 
      // }, 3000);
    
      const delayRender = setTimeout(() => {
        setisL(true);
    }, 1000);

    return () => clearTimeout(delayRender);
  }, []);

  const fetchStreamsData = async (userEmail) => {
    const streamsRef = ref(database, 'users');
    
    try {
      const queryRef = query(streamsRef, orderByChild('email'), equalTo(userEmail));
      const snapshot = await get(queryRef);

      const userData = snapshot.val();
      const streamsArray = [];

      for (const userId in userData) {
        const user = userData[userId];
        if (user.streams) {
          for (const streamName in user.streams) {
            const stream = user.streams[streamName];
            const streamData = {
              name: streamName,
              color: stream.colorhex,
              logo: stream.logoURL,
              main:stream.main,
              mainurl:stream.mainurl
            };
            streamsArray.push(streamData);

            if (stream.main === 1) {
              setSelectedStreammain(streamName);
          }
          }
        }
      }

      setStreamsData(streamsArray);
    } catch (error) {
      console.error("Error fetching streams data:", error);
    }
  };

  const handleStreamClick = (stream) => {
    setSelectedStream(stream);
    setIsBlockVisible(true);
  };
  const handleCloseBlock = () => {
    setIsBlockVisible(false);
    setSelectedStream(null);
  };

  const handlestream = () => {
    window.location.href = '/streams';
  };
  const handleHome= () => {
    window.location.href = '/home';
  };
  
  const deloldstream = (streamNameToUpdate)=>{
    let deleteRequest = {
      "oldName": streamNameToUpdate
  }
  
  // Delete the stream
  dstream(deleteRequest).then((response) => {
      console.log(response);
      if (response.data.includes("deleted successfully") ){
          showToast(`${streamNameToUpdate} Stream has been removed from Live`);
          console.log(`Stream  deleted successfully.`);
      } else {
          console.log(`Error deleting stream: ${response}`);
      }
  });
  }
  
const handleRemovemain = async (streamNameToUpdate) =>{
showToast("Removing from Main");
await resetStreamMainValue(currentUser, streamNameToUpdate);
await fetchStreamsData(currentUser.email);
setTimeout(deloldstream(streamNameToUpdate), 1500);
setSelectedStream('');

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
      console.log('Stream is live!');
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
  try {
    showToast(`${streamNameToUpdate} is now Live`);
    await handlecreating(selectedStream.name, selectedStream.color, selectedStream.logo);
    await updateUserStreamMain(currentUser, streamNameToUpdate);
    await filltime(currentUser, streamNameToUpdate);
    await fetchStreamsData(currentUser.email);
    setSelectedStream('');

    // Delay execution of deloldstream by 5 seconds
    // await new Promise((resolve) => {
    //     setTimeout(() => {
    //         deloldstream(selectedStreammain);
    //         resolve();
    //     }, 3000);
    // });
} catch (error) {
    console.error('Error in handlemakeMain:', error);
}}
  
const handleDelete = async (streamNameToDelete) => {
  showToast(`${streamNameToDelete} is now deleted`);
  await deleteStream(currentUser, streamNameToDelete, selectedStream.logo);
  await fetchStreamsData(currentUser.email);
  setSelectedStream('');
}

  
  
  return (
    <div className="custom-cursor">
<Link rel='preconnect' href="https://fonts.gstatic.com" crossorigin />
    <meta name='view_transition' content='same-origin'/>
    <table style={{ width: "100%", height: "100%"}}>
  <tr>
    <td className="signupd" style={{ width: "20%"}}>
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: "auto" }}>
    <MenuItems initialActiveItem="streams" />
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

                
            <GetStreams streamsData={streamsData} handleStreamClick={handleStreamClick} /> {/* All the streamssssssssssssssssssssssss are displayed hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */}
            
            
           
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
    onClick={()=>{
      // Assuming the PDF files are stored in the public directory
      const filePath = `/pdfs/ConferenceCaptioning-Instructions.pdf`; // Adjust the file path accordingly
      const link = document.createElement("a");
      link.href = filePath;
      link.download = `ConferenceCaptioning-Instructions.pdf`;
      link.click();
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
    Download Instruction Sheet
  </button>
  </div>
  {/* </div> */}
  <div style={{ animation:"slideInAnimation 1s ease-in-out forwards",boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", display: "flex", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: selectedStream? 'block' : 'none' }}>
  {selectedStream && (
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
    <h3 style={{ color: "#1B4375" }}>{selectedStream.name}</h3>
    <img style={{ width: "50px", height: "50px", transform: "scale(0.3)", cursor:"pointer", transition: "transform 0.3s ease"  }}  onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(0.4)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.transform = "scale(0.3)"; // Restore original scale
    }} src={TxtImage} alt="Edit Icon" onClick={settingedit} />
</div>
      <p ></p>
      
      {/* <img src={selectedStream && selectedStream.main === 1 ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedStream.mainurl)}` : {golive}
  }  alt={selectedStream.name} style={{ width: '100px', height: '100px' }} onMouseEnter={(e)=>{
        e.target.style.cursor="pointer";
      }} /> */}
      
      {selectedStream && selectedStream.main === 1 ? (
    <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedStream.mainurl)}`}
        alt={selectedStream.name}
        style={{ width: '100px', height: '100px' }}
        onMouseEnter={(e) => {
            // e.target.style.cursor = "pointer";
        }}
    />
) : (
    <video
        src={golive}
        style={{ width: '100px', height: '100px' }}
        loop
        autoPlay
        onMouseEnter={(e) => {
            // e.target.style.cursor = "pointer";
        }}
    />
)}

      <p style={{color:"#1B4375"}}>{selectedStream.color}</p>
      <p></p>
      <button style={{ 
      animation: 'slideIn1 2s ease forwards',
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
      <button style={{ 
      animation: 'slideIn1 2s ease forwards',
      border: "2px solid #1B4375", 
      marginTop:"5px",
      width: "100%", 
      padding: "10px", 
      cursor: "pointer", 
      outline: "none",
      backgroundColor: selectedStream && selectedStream.main === 1 ? "green" : "#1B4375",
      color: "#E3ECF2",
      fontWeight:"bold",
      borderRadius: "20px",
      transition: "transform 0.3s ease",
      display: selectedStream && selectedStream.main === 1 ? "block" : "block",
    }}  onClick={() => selectedStream && selectedStream.main === 1 ? handleRemovemain(selectedStream.name) : handlemakeMain(selectedStream.name)}
    onMouseEnter={(e) => {
        
        if(selectedStream.main===1){
          e.target.style.backgroundColor = "#E3ECF2";
          e.target.style.color = "green";
          e.target.innerText = "Remove from Live";
        }
        else{
          e.target.innerText = "Make Stream Live";
          e.target.style.color="#1B4375";
          e.target.style.backgroundColor = "#E3ECF2";
          showToast(`The Main is ${selectedStreammain} andddd ${selectedStream.name} ${selectedStream.logo} and ${selectedStream.color}`);
        }
        
        e.target.style.transform = "scale(1.01)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        if(selectedStream.main===1){
          e.target.style.backgroundColor = "green";
          e.target.style.color = "#E3ECF2";
          e.target.innerText = "Stream is Live";
        }
        else{
          e.target.innerText = "Make Stream Live";
          e.target.style.color="#E3ECF2";
          e.target.style.backgroundColor = "#1B4375";
        }
        e.target.style.transform = "scale(1)"; // Restore original scale
      }}>{selectedStream && selectedStream.main ===1? "Stream is Live":"Make Stream Live"}</button>
      <button style={{ 
      animation: 'slideIn1 2s ease forwards',
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
      transition: "transform 0.3s ease",
      display: selectedStream && selectedStream.main === 1 ? "none" : "block"
    }}  onClick={()=> handleDelete(selectedStream.name)}  onMouseEnter={(e) => {
        e.target.style.color="#E3ECF2"
        e.target.style.backgroundColor = "#ff6961";
        e.target.style.transform = "scale(1.01)"; // Increase scale
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color="#ff6961"
        e.target.style.transform = "scale(1)"; // Restore original scale
      }}>Delete stream</button>
      
    </div>
  )}
</div>

<div style={{ animation:"slideInAnimation 1s ease-in-out forwards",boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", display: "flex", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: selectedStream? 'none' : 'block' }}>
  {!selectedStream && (
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <h3 style={{color:"#1B4375"}}>Select a stream</h3>
      <p ></p>
      <p style={{color:"#1B4375"}}>To see its properties</p>
      <p></p>
      
    </div>
    
  )}
</div>
{/* <div style={{ animation:"slideInAnimation 1s ease-in-out forwards",boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)", display: "flex", justifyContent:"center", alignItems: "center", marginTop: '90px',  border: '1px solid #1B4375', padding: '10px', borderRadius: '5px', display: editst ? 'block' : 'none' }}>
    
    <div style={{marginBottom: '10px',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', flexDirection: "column"}}>
      <img style={{ width: "50px", height: "50px", transform: "scale(0.3)", cursor:"pointer", transition: "transform 0.3s ease"  }}  onMouseEnter={(e) => {
      e.target.style.opacity = "0.6";
      e.target.style.transform = "scale(0.4)"; // Increase scale
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.transform = "scale(0.3)"; // Restore original scale
    }} src={backst} alt="Edit Icon" onClick={settingedit} />
    {selectedStream && (
  <>
    {selectedStream.name === selectedStreammain ? (
      <>
      <h3 style={{ color: "#1B4375" }}>
        Current name: {selectedStream.name}
      </h3>
      <p></p>
      <RenameStream
      name={selectedStream.name}
      color={selectedStream.color}
      logo={selectedStream.logo}
      settingedit={settingedit}
    />
    </>
    ) : (
      <h3 style={{ color: "#1B4375" }}>
        Now you are editing your stream {selectedStream.name}, which is not live
      </h3>
    )}
  </>
)}
<p></p>
      
    </div>
    
 
</div> */}
  
  
</td>
        </tr>
      </table>
      </div>
    </td>
  </tr>
</table>

{toastMessage && <Toast message={toastMessage} />}
 </div>   
  );
}

export default Streams;
