import React, { useState, useEffect } from 'react';
import '../css/CustomCaptcha.css';
import { auth } from "../firebase/firebase";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import {remove } from "firebase/database";
import image1 from '../Assets/captcha/image-1.png';
import image2 from '../Assets/captcha/image-2.png';
import image3 from '../Assets/captcha/image-3.png';
import image4 from '../Assets/captcha/image-4.png';
import {getDatabase, ref, push, set, orderByChild, onChildAdded,equalTo, child, query, get } from 'firebase/database';
import {database} from '../firebase/firebase';
import {useAuth} from '../contexts/authContext'
import { dstream } from '../services/apiservices';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';


const CustomCaptcha = ({setislo, currentUser, setiscapv, deletetext, questions, onImageClick, showToast }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    Math.floor(Math.random() * questions.length)
  );
  const [ streamestodelete, setstreamstodeldata] = useState([]);
      const [streamslogotodelete, setstreamslogotodel] = useState([]);
      const [userIdsToDelete, setuserIdsToDelete] = useState([]);
      const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reauthenticationError, setReauthenticationError] = useState('');

  useEffect(() => {
    fetchStreamsData(currentUser.email);
    console.log(currentUser.email);
    console.log(currentUser.password);
    }, []);



  const fetchStreamsData = async (userEmail) => {
    const streamsRef = ref(database, 'users');
    
    try {
      const queryRef = query(streamsRef, orderByChild('email'), equalTo(userEmail));
      const snapshot = await get(queryRef);
      

      const userData = snapshot.val();
      const streamstodel = [];
      const stremeslogostodel = [];
      const ids = [];

      for (const userId in userData) {
        const user = userData[userId];
        console.log(userId);
        ids.push(userId);
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
            

            if (stream.main === 1) {
            streamstodel.push(streamName);
            
          }
          stremeslogostodel.push(stream.logoURL);
          }
        }
       
      }

    //   setStreamsData(streamsArray);
    setstreamstodeldata(streamstodel);
    setstreamslogotodel(stremeslogostodel);
    setuserIdsToDelete(ids);
    } catch (error) {
      console.error("Error fetching streams data:", error);
    }
  };

//   const handledelete = async () => {
//     console.log(streamestodelete);
//     console.log(streamslogotodelete);
    
//     setiscapv(false);
//     setislo(true);
//     if (deletetext === "DELETE") {
//         showToast("Account deleted");
        
//         let isStreamDeleteFinished = false;

//         // Delete streams one by one
//         for (const stream of streamestodelete) {
//             console.log(stream);
//             let deleteRequest = {
//                 "oldName": stream
//             }
//             console.log(deleteRequest);
//             setTimeout(async()=>{ await dstream(deleteRequest)},5000);
            
//             // Add a delay of 2 seconds between each stream del
//         }


//         // After deleting streams, delete logo URLs
//         for (const logoUrl of streamslogotodelete) {
//             await deleteLogo(logoUrl);
//             setislo(false);
//         }
        
//         showToast("Deletion successful");
//     } else {
//         showToast('Enter DELETE');
//     }
// }

const handleReauthentication = async (email, password) => {
    try {
        // Get the current user
        const currentUser = auth.currentUser;

        // Create credentials using the provided email and password
        const credentials = EmailAuthProvider.credential(email, password);

        // Reauthenticate the current user with the provided credentials
        await reauthenticateWithCredential(currentUser, credentials);

        // If reauthentication is successful, return the reauthenticated user
        return currentUser;
    } catch (error) {
        // If reauthentication fails, throw an error
        throw error;
    }
};


const reauthenticateUser = async (currentUser, email, password) => {
    try {
        // Create credentials using the provided email and password
        const credentials = EmailAuthProvider.credential(email, password);

        // Reauthenticate the current user with the provided credentials
        await reauthenticateWithCredential(currentUser, credentials);

        // If reauthentication is successful, return the reauthenticated user
        return currentUser;
    } catch (error) {
        // If reauthentication fails, throw an error
        throw error;
    }
};

const handledelete = async () => {
    console.log(streamestodelete);
    console.log(streamslogotodelete);
    
    setiscapv(false);
    setislo(true);
    if (deletetext === "DELETE") {
        const userEmail = prompt('Enter your email:');
        const userPassword = prompt('Enter your password:');

        if (userEmail && userPassword) {
            try{
            // Set email and password states
            setEmail(userEmail);
            setPassword(userPassword);

            // Attempt reauthentication
            const reauthenticatedUser = await handleReauthentication(userEmail, userPassword);
            if (reauthenticatedUser) {

                //showToast("Account deleted");

        // Use setTimeout to delay the start of the loop
        setTimeout(async () => {
            // Loop through each stream and delete it
            for (const stream of streamestodelete) {
                console.log(stream);
                let deleteRequest = {
                    "oldName": stream
                };
                console.log(deleteRequest);
                
                // Await the deletion of each stream
                await dstream(deleteRequest);

                // Add a delay of 5 seconds between each stream deletion
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            // After all streams are deleted, delete logo URLs
            for (const logoUrl of streamslogotodelete) {
                await deleteLogo(logoUrl);
            }
            console.log(userIdsToDelete);
            for (const userId of userIdsToDelete) {
                await deleteUserNode(userId);
              }

            showToast("Deletion successful");
            setislo(false); // Set islo to false after all operations are complete
        }, 2000); // Delay the start of the loop by 2 seconds

                // Other deletion logic...
            } else {
                console.error('Reauthentication failed');
                    showToast('Reauthentication failed. Deletion aborted.');
                setislo(false);
            }
        } catch (error) {
            // Handle reauthentication error
            console.error('Error during reauthentication:', error);
            showToast('Reauthentication failed. Deletion aborted.');
            setislo(false);
        }
        } 
        
    } else {
        showToast('Enter DELETE');
        setislo(false);
    }
};

// const deleteUserNode = async (userId) => {
//     const userRef = ref(database, `users/${userId}`);
//     try {
//       await remove(userRef);
//       console.log(`User data for userId ${userId} has been deleted successfully.`);
//       if (currentUser) {
//         auth.currentUser.delete()
//             .then(() => {
//                 // User deleted successfully
//                 console.log('User deleted successfully');
//                 setTimeout(() => {
//                     window.location.href="/signin";
//                 }, 1500);
//             })
//             .catch((error) => {
//                 // An error occurred
//                 console.error('Error deleting user:', error);
//             });
//     } else {
//         // No user is signed in
//         console.error('No user is currently signed in');
//     }
//     } catch (error) {
//       console.error(`Error deleting user data for userId ${userId}:`, error);
//     }
//   };

const deleteUserNode = async (userId) => {
    const userRef = ref(database, `users/${userId}`);
    try {
        // Remove the user data from the database
        await remove(userRef);
        console.log(`User data for userId ${userId} has been deleted successfully.`);
        
        // Delete the user from Firebase Authentication
        const currentUser = auth.currentUser;
        if (currentUser) {
            await currentUser.delete();
            console.log('User deleted successfully');
            // Redirect to the sign-in page after a delay
            setTimeout(() => {
                window.location.href = "/signin";
            }, 1000);
        } else {
            console.error('No user is currently signed in');
        }
    } catch (error) {
        console.error(`Error deleting user data for userId ${userId}:`, error);
        throw error; // Re-throw the error to handle it in the calling function if necessary
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
        //   showToast(`${streamNameToUpdate} Stream has been removed from Live`);
          console.log(`Stream ${streamNameToUpdate} has been deleted successfully.`);
      } else {
          console.log(`Error deleting stream: ${response}`);
      }
  });
  }

  const deleteLogo = async (logoUrl) => {
    try {
        const storage = getStorage();
        const logoRef = storageRef(storage, `${logoUrl}`);
        await deleteObject(logoRef);
        console.log(`Logo URL ${logoUrl} has been deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting logo URL ${logoUrl}: ${error}`);
    }
};

  const currentQuestion = questions[currentQuestionIndex];

  const handleClick = (id) => {
    const isCorrect = id === currentQuestion.answer;
    onImageClick(isCorrect);
if(isCorrect)
{
    showToast('correct option');
    handledelete();
}
else{
    showToast('incorrect option, please try again');
    setTimeout(() => {
        window.location.href = "/manage";
    }, 1000);
}
  };

  return (
    <div className="captcha-container">
      <h3 className="question">{currentQuestion.question}</h3>
      <div className="image-grid">
        <img
          className="captcha-image"
          src={image1}
          alt="Image 1"
          onClick={() => handleClick(1)}
          onMouseEnter={(e) => {
            e.target.style.opacity = 0.8;
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = 1;
            e.target.style.transform = 'scale(1)';
          }}
        />
        <img
          className="captcha-image"
          src={image2}
          alt="Image 2"
          onClick={() => handleClick(2)}
          onMouseEnter={(e) => {
            e.target.style.opacity = 0.8;
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = 1;
            e.target.style.transform = 'scale(1)';
          }}
        />
        <img
          className="captcha-image"
          src={image3}
          alt="Image 3"
          onClick={() => handleClick(3)}
          onMouseEnter={(e) => {
            e.target.style.opacity = 0.8;
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = 1;
            e.target.style.transform = 'scale(1)';
          }}
        />
        <img
          className="captcha-image"
          src={image4}
          alt="Image 4"
          onClick={() => handleClick(4)}
          onMouseEnter={(e) => {
            e.target.style.opacity = 0.8;
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = 1;
            e.target.style.transform = 'scale(1)';
          }}
        />
      </div>
    </div>
  );
};

export default CustomCaptcha;
