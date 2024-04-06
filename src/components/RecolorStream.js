import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { database } from '../firebase/firebase';
import {set, query, ref, orderByChild, equalTo, get, update } from 'firebase/database';
import { dstream, cstream } from '../services/apiservices';
const RecolorStream = ({ mn, name,color, showToast, setislo }) => {
  const [newColor, setnewColor] = useState('');
  const { currentUser } = useAuth();
  const [col,setcol]= useState('');
  const [log, setlog] = useState('');
  let colorch = false;

  useEffect(() => {
    setnewColor(color);
    loadstreamdata();
  }, [color]);

  const validateHexColor = (color) => {
    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
      return true;
    }
    return false;
  };

  const loadstreamdata = async () =>{
    const streamsRef = ref(database, 'users');
    const queryRef = query(streamsRef, orderByChild('email'), equalTo(currentUser.email));
    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      for (const userId in userData) {
        const user = userData[userId];
        if (user.streams) {
          for (const streamName in user.streams) {
            if (streamName === name) {
              const streamData = user.streams[streamName];
              // Update stream name
              setcol(user.streams[streamName].colorhex);
              setlog(user.streams[streamName].logoURL);
              
              return;
            }
          }
        }
      }
    }
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
          colorch = true;
      } else {
          console.log(`Error deleting stream: ${response}`);
      }
  });
  }


  const recolorStream = async () => {
    if(color === newColor){
      showToast("new color is same as the old color");
      return;
    }
    if (!validateHexColor(newColor)) {
      showToast('color should not be empty and be proper hex value.');
    }
    else if(validateHexColor(newColor)){

        const streamsRef = ref(database, 'users');
    const queryRef = query(streamsRef, orderByChild('email'), equalTo(currentUser.email));
    const snapshot = await get(queryRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    for (const userId in userData) {
      const user = userData[userId];
      if (user.streams) {
        const streamData = user.streams[name];
        const streamPath = `users/${userId}/streams/${name}`;
  const updates = { colorhex: newColor };
  await update(ref(database, streamPath), updates);
      }
    }
}

    }
    
    
  };

  const recolorStreammain = async () => {
    if (color === newColor) {
      showToast("New color is same as the old color");
      return;
    }
  
    if (!validateHexColor(newColor)) {
      showToast('Color should not be empty and should be a proper hex value.');
      return;
    }
  
    const streamsRef = ref(database, 'users');
    const queryRef = query(streamsRef, orderByChild('email'), equalTo(currentUser.email));
    const snapshot = await get(queryRef);
  
    if (snapshot.exists()) {
      const userData = snapshot.val();
      for (const userId in userData) {
        const user = userData[userId];
        if (user.streams) {
          const streamData = user.streams[name];
          const streamPath = `users/${userId}/streams/${name}`;
          const updates = { colorhex: newColor };
          await update(ref(database, streamPath), updates);
          let deleteRequest = {
            "oldName": name
        }
          // Delete the old stream
          const response = await dstream(deleteRequest);
          console.log(response);
          if (response.data.includes("deleted successfully")) {
            showToast(`${name} Stream has been removed from Live`);
            console.log(`Stream deleted successfully.`);
  
            // Set colorch to true
            colorch = true;
  
            // Wait for 2 seconds before creating the stream
            setTimeout(async () => {
              if (colorch) {
                let payload = {
                  "name": name,
                  "bannerColor": newColor,
                  "logoUrl": log
                };
                try {
                  const response = await cstream(payload);
                  console.log(response);
                  if (response.data.filePath) {
                   showToast('Stream color updated!');
                  } else {
                    const responseData = response.data;
                    showToast(`Stream already exists`);
                  }
                } catch (error) {
                  if (error.response && error.response.status === 500) {
                    // Check if the error message indicates that the stream already exists
                    if (error.response.data && error.response.data.message && error.response.data.message.includes("exists")) {
                      showToast(`Stream already exists`);
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
            }, 5000);
          } else {
            console.log(`Error deleting stream: ${response}`);
          }
        }
      }
    }
  };
  

  const handleSubmit1 = async(e) => {
    e.preventDefault();
    setislo(true);
    if(mn==="0"){
      await recolorStream();
    }
    else if(mn==="1"){
      await recolorStreammain();
    }
    
    const url = `/home?ssnm=${name}`;

  // Redirect to the home page with the selectedStream parameter
  setTimeout(()=>{window.location.href = url},10000);
  };

  return (
    <div>
        <div style={{  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h4>Current color: {color}</h4>
      </div>
      <p></p>
      <form onSubmit={handleSubmit1}>
        <div style={{display:"flex", alignItems:"center", flexDirection:"row", justifyContent:"center"}}>
      <input
  type="color"
  id="colorPicker"
  required
  value={newColor}
  onChange={(e) => setnewColor(e.target.value)}
  className="form-input"
  style={{ marginBottom: '10px' }}
/>
</div>
        <input
          type="text"
          value={newColor}
          onChange={(e) => setnewColor(e.target.value)}
          required
          placeholder={color}
        />
        <button type="submit" style={{ 
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
    
   onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#1B4375";
    e.target.style.color="#E3ECF2";
    e.target.style.transform = "scale(1.07)"; 
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color="#1B4375";
    e.target.style.transform = "scale(1)"; 
  }}>Recolor</button>
      </form>
      
    </div>
  );
};

export default RecolorStream;
