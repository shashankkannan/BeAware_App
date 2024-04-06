import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { database } from '../firebase/firebase';
import {set, query, ref, orderByChild, equalTo, get, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { cstream, dstream } from '../services/apiservices';
const RelogoStream = ({ mn,name,logo, showToast, setislo }) => {
  const [newLogo, setnewLogo] = useState('');
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [col,setcol]= useState('');
  const [log, setlog] = useState('');
  let logoch = false;

  useEffect(() => {
    setnewLogo(logo);
    loadstreamdata();
  }, [logo]);

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

function generateRandomKey() {
  // Generate a random string of characters
  return Math.random().toString(36).substring(2, 10);
}

  const relogoStream = async () => {
    if (!selectedImage) {
      showToast('Choose an image to replace current logo');
    }
    else if(selectedImage){
// Remove the current logo from storage
const storage = getStorage();
const logoRef = storageRef(storage, logo);
try {
  await deleteObject(logoRef);
  console.log(`Logo "${logo}" deleted from Firebase Storage.`);
} catch (error) {
  console.error('Error deleting logo from Firebase Storage:', error);
  showToast('Error deleting logo from Firebase Storage');
  return;
}

 // Upload the selected image to Firebase Storage
 const file = selectedImage;
 const fileName = file.name;
 const randomKey = generateRandomKey(); // Generate a random key
 const uniqueFileName = `${randomKey}_${fileName}`;
 const uploadStorageRef = storageRef(storage, `uploads/${uniqueFileName}`);
 try {
   await uploadBytes(uploadStorageRef, file);
   console.log(`File "${fileName}" uploaded to Firebase Storage.`);
 } catch (error) {
   console.error('Error uploading file to Firebase Storage:', error);
   showToast('Error uploading file to Firebase Storage');
   return;
 }

 // Get the download URL of the uploaded image
 try {
    const downloadURL = await getDownloadURL(uploadStorageRef);
    console.log('Download URL:', downloadURL);

    // Update the logoUrl field in the database
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
          const updates = { logoURL: downloadURL };
          await update(ref(database, streamPath), updates);
          showToast('Logo updated successfully');
          return;
        }
      }
    }
  } catch (error) {
    console.error('Error updating database with new logo URL:', error);
    showToast('Error updating database with new logo URL');
  }
    }
    
    
  };

  const relogoStreammain = async () => {
    if (!selectedImage) {
      showToast('Choose an image to replace current logo');
    }
    else if(selectedImage){
// Remove the current logo from storage
const storage = getStorage();
const logoRef = storageRef(storage, logo);
try {
  await deleteObject(logoRef);
  console.log(`Logo "${logo}" deleted from Firebase Storage.`);
} catch (error) {
  console.error('Error deleting logo from Firebase Storage:', error);
  showToast('Error deleting logo from Firebase Storage');
  return;
}

 // Upload the selected image to Firebase Storage
 const file = selectedImage;
 const fileName = file.name;
 const randomKey = generateRandomKey(); // Generate a random key
 const uniqueFileName = `${randomKey}_${fileName}`;
 const uploadStorageRef = storageRef(storage, `uploads/${uniqueFileName}`);
 try {
   await uploadBytes(uploadStorageRef, file);
   console.log(`File "${fileName}" uploaded to Firebase Storage.`);
 } catch (error) {
   console.error('Error uploading file to Firebase Storage:', error);
   showToast('Error uploading file to Firebase Storage');
   return;
 }

 // Get the download URL of the uploaded image
 try {
    const downloadURL = await getDownloadURL(uploadStorageRef);
    console.log('Download URL:', downloadURL);

    // Update the logoUrl field in the database
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
          const updates = { logoURL: downloadURL };
          await update(ref(database, streamPath), updates);
          showToast('Logo updated successfully');

          let deleteRequest = {
            "oldName": name
        }
          // Delete the old stream
          const response = await dstream(deleteRequest);
          console.log(response);
          if (response.data.includes("deleted successfully")) {
            showToast(`${name} Stream has been removed from Live`);
            console.log(`Stream deleted successfully.`);
  
            // Set logoch to true
            logoch = true;
  
            // Wait for 2 seconds before creating the stream
            setTimeout(async () => {
              if (logoch) {
                let payload = {
                  "name": name,
                  "bannerColor": col,
                  "logoUrl": downloadURL
                };
                try {
                  const response = await cstream(payload);
                  console.log(response);
                  if (response.data.filePath) {
                   showToast('Stream logo updated!');
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

          return;
        }
      }
    }
  } catch (error) {
    console.error('Error updating database with new logo URL:', error);
    showToast('Error updating database with new logo URL');
  }
    }
    
    
  };

  const handleSubmit2 = async(e) => {
    e.preventDefault();
    setislo(true);

    if(mn===0){
      await relogoStream();
    }else if(mn==="1"){
      await relogoStreammain();
    }
    
    const url = `/home?ssnm=${name}`;
    setSelectedImage(null);
  // Redirect to the home page with the selectedStream parameter
  setTimeout(()=>{window.location.href = url},10000);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  if (file) {
    setSelectedImage(file);
  } else {
      setSelectedImage('');
  }
  };

  const Imagedel = (event) => {
    setSelectedImage('');
  }

  return (
    <div>
        <div style={{  width: "100%",display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src={logo} alt="logo" style={{ width: '50px', height: '50px', borderRadius: '5px', color: "#1B4375" }} />
      </div>
      <p></p>
      <form onSubmit={handleSubmit2}>
      <input
      type="file"
      id="imageUpload"
      accept="image/*"
      onChange={handleImageChange}
      className="file-input"
    />
    <button
      style={{
        border: "2px solid #1B4375",
        width: "100%",
        padding: "10px",
        color: "#1B4375",
        fontWeight: "bold",
        cursor: "pointer",
        outline: "none",
        backgroundColor: "transparent",
        borderRadius: "20px",
        transition: "transform 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#1B4375";
        e.target.style.color = "#E3ECF2";
        e.target.style.transform = "scale(1.07)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = "#1B4375";
        e.target.style.transform = "scale(1)";
      }}
    >
      Choose File
    </button>
    {selectedImage && (
  <div>
    <p>{selectedImage.name}</p>
    <button onClick={Imagedel}>Delete</button>
  </div>
)}
    
      <p></p>
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
  }}>Change logo</button>
      </form>
      
    </div>
  );
};

export default RelogoStream;
