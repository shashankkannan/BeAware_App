import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { database } from '../firebase/firebase';
import {set, query, ref, orderByChild, equalTo, get, update } from 'firebase/database';
import { rstream } from '../services/apiservices';

const RenameStream = ({ mn, name, showToast, setislo }) => {
  const [newName, setNewName] = useState('');
  const { currentUser } = useAuth();
  const [col,setcol]= useState('');
  const [log, setlog] = useState('');
  useEffect(() => {
    setNewName(name);
    loadstreamdata();
  }, [name]);

  const validateName = (name) => {
    return !/\s/.test(name); // Check if the trimmed name contains any spaces
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


  const renameStream = async () => {
    
    let nameExists = false;
    if(name === newName.toLowerCase()){
      nameExists = true;
      showToast(` The new name is same as the current name `);
      console.log(` The new name is same as the current name `);
    }
    if (!validateName(newName.toLowerCase())) {
      showToast('Name should not have any spaces.');
      return;
    }
    else if(validateName(newName.toLowerCase())){
      // showToast(`${newName}`);
    const streamsRef = ref(database, 'users');
    const queryRef = query(streamsRef, orderByChild('email'), equalTo(currentUser.email));
    const snapshot = await get(queryRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    for (const userId in userData) {
      const user = userData[userId];
      if (user.streams) {
        for(const n in user.streams){
          
          if(n === newName.toLowerCase()){
            nameExists = true;
            showToast(` The stream ${newName} already exists, please enter a different name`);
            
            break;
          }
        }
        if (nameExists) {
          const url = `/home?ssnm=${name}`;
            setTimeout(() => {
              window.location.href = url;
            }, 2000);
          // Exit the function if the name already exists
          return;
        }
        for (const streamName in user.streams) {
          if (streamName === name) {
            const streamData = user.streams[streamName];
            // Update stream name
            delete user.streams[streamName];
            user.streams[newName.toLowerCase()] = streamData;
            user.streams[newName.toLowerCase()].mainurl = `https://deafassistant.com/${newName.toLowerCase()}`;
            await set(ref(database, `users/${userId}/streams`), user.streams);
            showToast(`Stream name updated to ${newName.toLowerCase()}`);
            
            return;
          }
        }
      }
    }
  }
    }
    
  };

  const renameStreammain = async () => {
    let nameExists = false;
    let live = false;
    if(name === newName.toLowerCase()){
      nameExists = true;
      showToast(` The new name is same as the current name `);
      console.log(` The new name is same as the current name `);
    }
    if (!validateName(newName.toLowerCase())) {
      showToast('Name should not be empty.');
      const url = `/home?ssnm=${name}`;
            setTimeout(() => {
              window.location.href = url;
            }, 500);
    }
    else if(validateName(newName.toLowerCase())){
    // showToast(`${newName}`);
    const streamsRef = ref(database, 'users');
    const queryRef = query(streamsRef, orderByChild('email'), equalTo(currentUser.email));
    const snapshot = await get(queryRef);

  if (snapshot.exists()) {
    const userData = snapshot.val();
    for (const userId in userData) {
      const user = userData[userId];
      if (user.streams) {
        for(const n in user.streams){
          
          if(n === newName.toLowerCase()){
            nameExists = true;
            showToast(` The stream ${newName.toLowerCase()} already exists, please use different name`);
            
            break;
          }
        }
        if (nameExists) {
          const url = `/home?ssnm=${name}`;
            setTimeout(() => {
              window.location.href = url;
            }, 2000);
          // Exit the function if the name already exists
          return;
        }
        if(!nameExists){
          let renameRequest = {
            "oldName": name,
            "name": newName.toLowerCase(),
            "bannerColor": col,
            "logoUrl": log
           }
           try{
        const response = await rstream(renameRequest);
        console.log(response);
          if(response.data.filePath){
            showToast(`${newName.toLowerCase()} Stream is live!`);
            live = true;
          }
          else{
            showToast(`Stream already exists`);
          }
        }catch (error) {
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
        
          

        if(live){
          for (const streamName in user.streams) {
            if (streamName === name) {
              const streamData = user.streams[streamName];
              // Update stream name
              delete user.streams[streamName];
              user.streams[newName.toLowerCase()] = streamData;
              user.streams[newName.toLowerCase()].mainurl = `https://deafassistant.com/${newName.toLowerCase()}`;
              await set(ref(database, `users/${userId}/streams`), user.streams);
              showToast(`Stream name updated to ${newName.toLowerCase()}`);
              
              return;
            }
          }

          const url = `/home?ssnm=${newName.toLowerCase()}`;
          setTimeout(() => {
            window.location.href = url;
          }, 2000);
        }
          
        
          
        
        
        
      }
    }
  }
}
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setislo(true);
    if(mn==="0")
    {
      await renameStream();
      if(!validateName(newName.toLowerCase())){
        const url = `/home?ssnm=${name}`;
          setTimeout(() => {
            window.location.href = url;
          }, 2000);
      }else {
        const url = `/home?ssnm=${newName.toLowerCase()}`;
        setTimeout(() => {
          window.location.href = url;
        }, 2000);
      }
      
    }
    else if(mn==="1")
    {
      
        await loadstreamdata();
        await renameStreammain();
        if(validateName(newName.toLowerCase())){
        const url = `/home?ssnm=${newName.toLowerCase()}`;
            setTimeout(() => {
              window.location.href = url;
            }, 2000);
      }
      else{
        const url = `/home?ssnm=${name}`;
            setTimeout(() => {
              window.location.href = url;
            }, 2000);
      }
      
      // showToast(`For ${newName} color is: ${col} and logo is ${log}`)
    }
    
    
  };

  return (
    <div>
      <div style={{  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h4>Current name: {name}</h4>
      </div>
      <p></p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={name}
          required
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
  }}>Rename</button>
      </form>
      
    </div>
  );
};

export default RenameStream;
