import React, { useEffect, useState } from 'react';
import {getDatabase, ref, push, set, orderByChild, onChildAdded,equalTo, child, query, get } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import '../css/SignUp.css';
import Image from '../Assets/SignUp.png'; 
import TxtImage from '../Assets/Vector.png';
import {database, app} from '../firebase/firebase';
import {useAuth} from '../contexts/authContext'
function Toast({ message }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#333', color: '#fff', padding: '10px 20px', borderRadius: '5px', zIndex: '9999' }}>
      {message}
    </div>
  );
}


export default function Setup() {
  const [streamname, setstreamname] = useState('');
  const [colorhex, setcolorhex] = useState('');
  const [email, setEmail] = useState('');
  const {currentUser, userLoggedIn} = useAuth();
  const [username, setUsername] = useState('');
  const [streamNames, setStreamNames] = useState([]);
  const [selectedStream, setSelectedStream] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [toastMessage, setToastMessage] = useState('');
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
      loadStreamNames(currentUser.email);
    
    
  }, []);

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
          const streams = Object.keys(streamsSnapshot.val());
          setStreamNames(streams);
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

const handlehome = (event)=> {
  window.location.href = "/manage";
}
const handleSubmit = async (event) => {
  event.preventDefault();
  if (!streamname) {
      showToast('Please enter a streamname');
      return;}
    if(!colorhex){
      showToast('Please choose a color code');
      return;
    }
    if(!selectedImageName){
      if(!selectedStream){
        showToast('Please choose a logo image');
        return;
      }
    }

  if (!/^#[0-9A-F]{6}$/i.test(colorhex)) {
    showToast('Please enter a valid hexadecimal color code');
    return;
  }
  try {
    

    // Retrieve the user based on the provided email
    const usersRef = ref(database, 'users');
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
    const userSnapshot = await get(userQuery);
    
    if (!userSnapshot.exists()) {
      console.log('User does not exist with this email');
      // Handle error, show toast message, etc.
      return;
    }
    
    
    // Get the user ID
    const userId = Object.keys(userSnapshot.val())[0]; // Assuming there's only one user per email
    
    // Check if the streams node exists for the user, if not, create it
    const userStreamsRef = ref(database, `users/${userId}/streams`);
    const userStreamsSnapshot = await get(userStreamsRef);

    if (!userStreamsSnapshot.exists()) {
      // Streams node doesn't exist, create it
      await set(userStreamsRef, {});
    }

    // Store the stream name and color hex under the user's streams node
    const streamRef = ref(database, `users/${userId}/streams/${streamname}`);
    const streamSnapshot = await get(streamRef);

    if (streamSnapshot.exists()) {
      console.log('Stream name already exists');
      showToast('Stream name already exists, if you want to edit it please use the dropdown below to select it');
      if (selectedStream) {
        try {
          // Retrieve the user ID
          const userId = Object.keys(userSnapshot.val())[0]; // Assuming there's only one user per email
          
          // Get the stream reference
          const streamRef = ref(database, `users/${userId}/streams/${selectedStream}`);
          const streamSnapshot = await get(streamRef);
          
          if (streamSnapshot.exists()) {
            // Get the current stream data
            const streamData = streamSnapshot.val();
            
            if (colorhex) {
              // Update stream data with new colorhex
              const updatedStreamData = {
                ...streamData,
                colorhex: colorhex,
              };
    
              // Update the colorhex in the database
              await set(streamRef, updatedStreamData);
              showToast('Stream updated successfully!');
            }
    
            if (selectedImageName) {
              try {
                // Retrieve the current stream data
                const streamSnapshot = await get(streamRef);
                const streamData = streamSnapshot.val();
        
                // Delete the current logoURL from Firebase Storage
                const storage = getStorage(app);
                const storageRefToDelete = storageRef(storage, streamData.logoURL );
                await deleteObject(storageRefToDelete);
        
                // Upload the selected file to Firebase Storage
                const file = event.target.elements.imageUpload.files[0];
                const fileName = file.name;
                const storageRef1 = storageRef(storage, `uploads/${fileName}`);
                await uploadBytes(storageRef1, file);
        
                // Retrieve the download URL of the uploaded file
                const fileURL = await getDownloadURL(storageRef1);
        
                // Update stream data with new logoURL
                const updatedStreamData = {
                    ...streamData,
                    logoURL: fileURL,
                };
        
                // Update the logoURL in the database
                await set(streamRef, updatedStreamData);
                showToast('Stream updated successfully!');
            } catch (error) {
                console.error('Error updating stream data:', error);
                // Handle error, show toast message, etc.
            }
            }
          }
        } catch (error) {
          console.error('Error updating stream data:', error);
          // Handle error, show toast message, etc.
        }
      
      }
      return;
    }

    // Upload the selected file to Firebase Storage
    const file = event.target.elements.imageUpload.files[0];
    const fileName = file.name;
    const storage = getStorage(app);
    const storageRef1 = storageRef(storage, `uploads/${fileName}`);
    await uploadBytes(storageRef1, file);

    // Retrieve the download URL of the uploaded file
    const fileURL = await getDownloadURL(storageRef1);
    const streamData = {
      colorhex: colorhex,
      logoURL: fileURL
    };
    
    await set(streamRef, streamData);
    console.log('Stream data stored successfully!');
    showToast('Stream is online');
  } catch (error) {
    console.error('Error storing stream data:', error);
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
    }
  };

  return (
    <div className="sign-up-container">
      <div className="left-side">
        <div className="left-text">
        <img src={TxtImage} alt="Image" className="text-image"/>
          
          <p className='text'>BeAware assists hearing-impaired individuals with secure sign-up and stream URL generation via user inputs, fostering accessibility goals.</p>
        </div>
        <img src={Image} alt="Image" className="left-image" />
      </div>
      <div className="right-side">
        <div className='right-side-content'>
        <h3 className="sign-up-title">Welcome {username}</h3>  
        <h1 className="sign-up-title1">Setup your stream</h1>
        <form onSubmit={handleSubmit} className="sign-up-form">
        <div className="form-field">
  <label htmlFor="imageUpload" className="form-label">Upload Image</label>
  <div className="file-input-container">
    <input
      type="file"
      id="imageUpload"
      accept="image/*"
      onChange={handleImageChange}
      className="file-input"
    />
    <button className="custom-button">Choose File</button>
    
  </div>
  {selectedImageName && (
  <div>
    <p className='si'>{selectedImageName}</p>
    <h5 className="delete" onClick={Imagedel}>delete</h5>
  </div>
)}
</div>
<div className="form-field">
  <label htmlFor="streamname1" className="form-label">
  </label>
  {/* Render the input field if no stream is selected */}
  {selectedStream ? (
    <p>{selectedStream}</p>
  ) : (
    <input
      type="text"
      id="streamname1"
      value={streamname}
      placeholder="Stream Name"
      onChange={(e) => setstreamname(e.target.value)}
      required
      className="form-input"
    />
  )}
</div>
          <div className="form-field">
            {/* Select dropdown for streams */}
            <label htmlFor="streamSelect" className="form-label">Edit Stream </label>
            <select id="streamSelect" value={selectedStream} onChange={handleStreamChange} className="form-input">
              <option value="">New stream</option>
              {streamNames.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="colorHex" className="form-label">
            </label>
            <input
              type="text"
              id="colorHex"
              required
              value={colorhex}
              onChange={handleHexChange}
              placeholder='Hexcode'
              className="form-input"
            />  
          </div>
          <div className="form-field1">
                <label htmlFor="colorPicker" className="form-label">
                Choose Color 
                </label>
                    <input
                        type="color"
                        id="colorPicker"
                        required
                        value={colorhex}
                        onChange={(e) => setcolorhex(e.target.value)}
                        className="form-input"
                    />
            
              <div className="color-option red" style={{ backgroundColor: '#ff0000' }} onClick={() => setcolorhex('#ff0000')}></div>
              <div className="color-option green" style={{ backgroundColor: '#00ff00' }} onClick={() => setcolorhex('#00ff00')}></div>
              <div className="color-option blue" style={{ backgroundColor: '#0000ff' }} onClick={() => setcolorhex('#0000ff')}></div>
            </div>
            
          <button type="submit" className="sign-up-button">
          Setup Stream
          </button>
          
        </form>
        <p></p>
        <button onClick={handlehome} className="google-sign-in-button">
          Home
          </button>
      </div>
      </div>
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}