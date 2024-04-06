import React, { useEffect, useState } from 'react';
import '../css/ManageProfile.css';
import TxtImage from '../Assets/edit.png';
import userpic from '../Assets/user.png'; 
import Image from '../Assets/SignUp.png';
import vds from '../Assets/spb4.mp4';
import MenuItems from './MenuItems';
import UserProfile from './Userprofile';
import profileicon from '../Assets/profile.png';
import streamicon from '../Assets/stream.png'; 
import {database, app} from '../firebase/firebase';
import {useAuth} from '../contexts/authContext'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import dash from '../Assets/dashboard.png'; 
import eye from '../Assets/eye.png'; 
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import GetStreams from "./GetStreams";
import { updateUserStreamMain, resetStreamMainValue, deleteStream, CreateStreamInDatabase} from './updateUserStreamMain';
import { cstream, dstream } from '../services/apiservices';

import {getDatabase, ref, push, set, orderByChild, onChildAdded,equalTo, child, query, get } from 'firebase/database';



function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}


export const Setup = () => {
  const [streamname, setstreamname] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [colorhex, setcolorhex] = useState('');
  const [email, setEmail] = useState('');
  const {currentUser, userLoggedIn} = useAuth();
  const [username, setUsername] = useState('');
  const [streamNames, setStreamNames] = useState([]);
  const [selectedStream, setSelectedStream] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [mainstream, setmainstream] = useState('');
  const [selectedStreammain,setSelectedStreammain] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [islo, setislo] = useState(false);
   
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); // Hide the toast after 3 seconds
  };

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  useEffect(() => {
    
      setUsername(currentUser.displayName);
      setEmail(currentUser.email);
      //loadStreamNames(currentUser.email);
      fetchStreamsData(currentUser.email);

      
    
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

    } catch (error) {
      console.error("Error fetching streams data:", error);
    }
  };

  const loadStreamNames = async (userEmail) => {
    try {
        const userRef = ref(database, 'users');
        const userQuery = query(userRef, orderByChild('email'), equalTo(userEmail));
        const userSnapshot = await get(userQuery);

        if (userSnapshot.exists()) {
            const userId = Object.keys(userSnapshot.val())[0];
            const streamsRef = ref(database, `users/${userId}/streams`);
            const streamsSnapshot = await get(streamsRef);

            if (streamsSnapshot.exists()) {
                const streams = streamsSnapshot.val();
                const streamNames = Object.keys(streams);
                for (const streamName of streamNames) {
                    const mainValue = streams[streamName].main;
                    if (mainValue === 1) {
                        // console.log(streamName);
                        setmainstream(streamName); // Set the main stream
                        console.log(streamName);
                    } else {
                        setmainstream(""); // Clear the main stream
                    }
                }
                setStreamNames(streamNames);
            }
        }
    } catch (error) {
        console.error('Error fetching stream names:', error);
    }
};


  const handleImageChange = (event) => {
    const file = event.target.files[0];
  if (file) {
    setSelectedImageName(file.name);
  } else {
      setSelectedImageName('');
  }
  };

  const Imagedel = (event) => {
    setSelectedImageName('');
  }

  function generateRandomKey() {
    // Generate a random string of characters
    return Math.random().toString(36).substring(2, 10);
  }

const handlehome = (event)=> {
  window.location.href = "/manage";
}
const handleSubmit = async (event) => {
  event.preventDefault();
  setislo(true);
  if (!streamname.toLowerCase()) {
      showToast('Please enter a streamname');
      setislo(false);
      return;}
    if(!colorhex){
      showToast('Please choose a color code');
      setislo(false);
      return;
    }
    if(!selectedImageName){
      if(!selectedStream){
        showToast('Please choose a logo image');
        setislo(false);
        return;
      }
    }
    if(!validateName(streamname.toLowerCase())){
      showToast('No spaces should be there in the streamname');
        setislo(false);
        return;
    }

  if (!/^#[0-9A-F]{6}$/i.test(colorhex)) {
    showToast('Please enter a valid hexadecimal color code');
    setislo(false);
    return;
  }
  try {
    
    const usersRef = ref(database, 'users');
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
    const userSnapshot = await get(userQuery);
    
    if (!userSnapshot.exists()) {
      showToast('User does not exist with this email');
      setislo(false);
      // Handle error, show toast message, etc.
      return;
    }
    
    
    // Get the user ID
    const userId = Object.keys(userSnapshot.val())[0];

    // Upload the selected file to Firebase Storage
    const file = event.target.elements.imageUpload.files[0];
    const fileName = file.name;
    const randomKey = generateRandomKey(); // Generate a random key
    const uniqueFileName = `${randomKey}_${fileName}`;
    const storage = getStorage(app);
    const storageRef1 = storageRef(storage, `uploads/${uniqueFileName}`);
    await uploadBytes(storageRef1, file);
    const main =0;

    // Retrieve the download URL of the uploaded file
    const fileURL = await getDownloadURL(storageRef1);
    handlecreating(streamname.toLowerCase(), colorhex, fileURL);
    
  } catch (error) {
    console.error('Error storing stream data:', error);
    showToast(`Error with database`);
    setislo(false);
    // Handle error, show toast message, etc.
  }
};
  const handleHexChange = (e) => {
    const hex = e.target.value;
    setcolorhex(hex);
  };

  const handleStreamChange = async (e) => {
    const selectedStreamName = e.target.value;
    setSelectedStream(selectedStreamName);
    setstreamname(selectedStreamName); // Set stream name from dropdown
    try {
      const usersRef = ref(database, 'users');
      const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
      const userSnapshot = await get(userQuery);
      
      if (!userSnapshot.exists()) {
        console.log('User does not exist with this email');
        return;
      }
      
      const userId = Object.keys(userSnapshot.val())[0];
      const streamRef = ref(database, `users/${userId}/streams/${selectedStreamName}`);
      const streamSnapshot = await get(streamRef);

      if (streamSnapshot.exists()) {
        const streamData = streamSnapshot.val();
        setcolorhex(streamData.colorhex); // Set color hex from database
      }
    } catch (error) {
      console.error('Error fetching stream data:', error);
      showToast(`Error with database`);
      setislo(false);
    }
  };
  
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    // setTimeout(() => {
    //   setVideoLoaded(true); // Set video loaded state to true after 2 seconds delay
    // }, 800); // Set video loaded state to true when video metadata is loaded
  };

  const deloldstream = ()=>{
    let deleteRequest = {
      "oldName": selectedStreammain
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

  // const handlecreating =(str, coh, flu)=>{
  //   loadStreamNames(currentUser.email);
  //   let payload = {
  //       "name": str,
  //       "bannerColor": coh,
  //       "logoUrl": flu
  //      }
  //   cstream(payload).then((response)=>{
  //     console.log(response);
  //     if(response.data.filePath){
  //       const mainurl = response.data.filePath;
  //       const streamData = {
  //         colorhex: coh,
  //         logoURL: flu,
  //         main: 0,
  //         mainurl:mainurl
  //       };
  //       CreateStreamInDatabase(currentUser, str, streamData);
  //       console.log('Stream data stored successfully!');
  //       showToast(`Stream is now online, now going to delete ${selectedStreammain}`);
  //       setTimeout(deloldstream, 1500);

  //       //go to dashboard page
  //       //delete previous main=1
  //       // if(ms){
  //     //   deloldstream();
  //     // }
  //     }
  //     else{
  //       const responseData = response.data;
  //       // Extract the dynamic part from the message string
  //       const message = responseData.message;
  //       const dynamicPart = message.split('https://deafassistant.com/')[1].split(' ')[0];
  //       if (message.includes("exists")) {
  //         showToast(`Stream for ${dynamicPart} already exists`);
  //     } else {
  //       showToast(`Error occured while creating stream for ${dynamicPart}`);
  //     }

  //     }
      
      
  //   });

  // }

  const handlecreating = async (str, coh, flu) => {
    await loadStreamNames(currentUser.email);
    let payload = {
        "name": str,
        "bannerColor": coh,
        "logoUrl": flu
    };
    try {
        const response = await cstream(payload);
        console.log(response);
        const currentDate = new Date();
        const currentDateTimeString = currentDate.toString();
        
        if (response.data.filePath) {
            const mainurl = response.data.filePath;
            const streamData = {
                colorhex: coh,
                logoURL: flu,
                main: 0,
                mainurl: mainurl,
                cd:currentDateTimeString
            };
            await CreateStreamInDatabase(currentUser, str, streamData);
            console.log('Stream data stored successfully!');
            showToast(`Stream is now online, now directing to streams page`);
            setislo(false);
            setTimeout(() => {
              window.location.href="/streams";
            }, 1500);
            // setTimeout(deloldstream, 1500);
        } else {
            const responseData = response.data;
            showToast(`Stream already exists`);
            setislo(false);
            // Extract the dynamic part from the message string
            const message = responseData.message;
            const dynamicPart = message.split('https://deafassistant.com/')[1].split(' ')[0];
            if (message.includes("exists")) {
                showToast(`Stream for ${dynamicPart} already exists`);
            } else {
                showToast(`Error occurred while creating stream for ${dynamicPart}`);
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 500) {
            // Check if the error message indicates that the stream already exists
            if (error.response.data && error.response.data.message && error.response.data.message.includes("exists")) {
                showToast(`Stream name already taken`);
                const storage = getStorage();
               const logoRef = storageRef(storage, `${flu}`);
               await deleteObject(logoRef);
                setislo(false);
            } else {
                // Handle other types of errors
                showToast(`Error occurred while creating the stream`);
            }
        } else {
            // Handle other types of errors
            console.error('Error:', error);
        }
    }
}
const validateName = (name) => {
  return !/\s/.test(name); // Check if the trimmed name contains any spaces
};

  return (
    <div>
    <div className='hero' style={{overflow: "hidden"}}>
    <video autoPlay loop muted playsInline className='back-video' style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'fixed', top: 0, left: 0, zIndex: -1 }} onLoadedMetadata={handleVideoLoaded}>
        <source src={vds} type='video/mp4' />
      </video>

      {videoLoaded && (
      <div className='formdiv' style={{animation: 'slideIn 1s ease forwards'}}>
  <form onSubmit={handleSubmit} style={{borderRadius:"40px", backgroundColor:"#E5E5E5" ,  marginTop:"20px", marginRight:"74vw", padding: "30px",maxHeight: "100vh", overflowY: "hidden", display: 'flex', flexDirection: 'column', alignItems: 'center', scale: "0.9" }}>
    <div className="form-field" style={{ textAlign: 'center', marginBottom: '20px' }}>
      <label htmlFor="imageUpload" className="form-label" style={{color: "#1B4375", fontWeight:"bold"}}>Upload Image</label>
      <div className="file-input-container">
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        <button style={{ 
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
    }}  onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#1B4375";
      e.target.style.color="#E3ECF2";
      e.target.style.transform = "scale(1.07)"; 
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color="#1B4375";
      e.target.style.transform = "scale(1)"; 
    }} >Choose File</button>
      </div>
      {selectedImageName && (
        <div>
          <p className='si'>{selectedImageName}</p>
          <h5 className="delete" onClick={Imagedel}>delete</h5>
        </div>
      )}
    </div>
    <div className="form-field" style={{ textAlign: 'center' }}>
      {selectedStream ? (
        <p style={{color: "#E5E5E5"}}>{selectedStream}</p>
      ) : (
        <input
          type="text"
          id="streamname1"
          value={streamname}
          placeholder="Stream Name"
          onChange={(e) => setstreamname(e.target.value)}
          required
          className="form-input"
          style={{ textAlign:"center", width: '250px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' ,color: "#1B4375" }}
        />
      )}
    </div>
    {/* <div className="form-field" style={{ textAlign: 'center', marginBottom: '20px' }}>
      <label htmlFor="streamSelect" className="form-label" style={{ color: '#1B4375', fontWeight:"bold"}}>Edit Stream</label>
      <select id="streamSelect" value={selectedStream} onChange={handleStreamChange} className="form-input" style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
        <option value="" style={{color:"#1B4375"}}>New stream</option>
        {streamNames.map((name, index) => (
          <option style= {{color:"#1B4375"}} key={index} value={name}>{name}</option>
        ))}
      </select>
    </div> */}
    <div className="form-field" style={{ textAlign: 'center', marginBottom: '20px' }}>
      <label htmlFor="colorHex" className="form-label" style={{ color: '#1B4375', fontWeight:"bold"}}>Color for stream</label>
      <input
        type="text"
        id="colorHex"
        required
        value={colorhex}
        onChange={handleHexChange}
        placeholder='Color Hexcode'
        className="form-input"
        style={{ fontWeight:"bold", color: "#1B4375", textAlign:"center" , width: '250px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
    </div>
    <div className="form-field1" style={{ textAlign: 'center', marginBottom: '20px' }}>
      <label htmlFor="colorPicker" className="form-label" style={{ color: '#1B4375', fontWeight:"bold"}}>Choose Color&nbsp; </label>
      <input
        type="color"
        id="colorPicker"
        required
        value={colorhex}
        onChange={(e) => setcolorhex(e.target.value)}
        className="form-input"
        style={{ marginBottom: '10px' }}
      />
      <div className="color-options-container">
        <div className="color-option red" style={{ backgroundColor: '#ff0000' }} onClick={() => setcolorhex('#ff0000')}></div>
        <div className="color-option green" style={{ backgroundColor: '#00ff00' }} onClick={() => setcolorhex('#00ff00')}></div>
        <div className="color-option blue" style={{ backgroundColor: '#0000ff' }} onClick={() => setcolorhex('#0000ff')}></div>
      </div>
    </div>
  <button type="submit" className="sign-up-button"  style={{ 
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
    }}  onMouseEnter={(e) => {
      // showToast(`Remove the current main stream ${selectedStreammain} from live`);
      e.target.style.backgroundColor = "#1B4375";
      e.target.style.color="#E3ECF2";
      e.target.style.transform = "scale(1.07)"; 
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color="#1B4375";
      e.target.style.transform = "scale(1)"; 
    }} 
    onMouseDown={(e)=>{
      e.target.style.backgroundColor="transparent"
      e.target.style.color="#1B4375"
    }}
    onMouseUp={(e)=>{
      e.target.style.backgroundColor="#1B4375"
      e.target.style.color="#E3ECF2"
    }}
    >Setup Stream</button>
</form>
{/* <button onClick={handlecreating} className="sign-up-button"  style={{ 
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
    }}  onMouseEnter={(e) => {
      e.target.style.backgroundColor = "#1B4375";
      e.target.style.color="#E3ECF2";
      e.target.style.transform = "scale(1.07)"; 
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color="#1B4375";
      e.target.style.transform = "scale(1)"; 
    }} >Create Stream</button> */}
{islo &&(<><p></p>
  <h5 style={{paddingLeft:"6.5vw", color:"#E5E5E5", fontWeight:"bold"}}>Loading.. please hold on</h5></>)}
</div>
)}
{videoLoaded && (
<button onClick={()=>{
  window.location.href="/streams";
}} style={{
  animation:"slideout 1.5s ease forwards",
  border: "2px solid #E5E5E5",
  width: "15vw",
  padding: "10px",
  position: "absolute",
  right: "0",
  bottom: "0",
  marginBottom:"50px",
  color: "#E5E5E5",
  fontWeight: "bold",
  cursor: "pointer",
  outline: "none",
  backgroundColor: "transparent",
  borderRadius: "20px",
  transition: "transform 0.3s ease",
  marginRight:"15vw"
}}  onMouseEnter={(e) => {
      // showToast(`Remove the current main stream ${selectedStreammain} from live`);
      e.target.style.backgroundColor = "#E5E5E5";
      e.target.style.color="#1B4375";
      e.target.style.transform = "scale(1.07)"; 
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "transparent";
      e.target.style.color="#E5E5E5";
      e.target.style.transform = "scale(1)"; 
    }} 
    onMouseDown={(e)=>{
      e.target.style.backgroundColor="transparent"
      e.target.style.color="#1B4375"
    }}
    onMouseUp={(e)=>{
      e.target.style.backgroundColor="#1B4375"
      e.target.style.color="#E3ECF2"
    }}> Go to Streams</button>)}

{toastMessage && <Toast message={toastMessage} />}
 </div>  
 </div>
  );
}

export default Setup;
