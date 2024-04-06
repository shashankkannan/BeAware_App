// import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';
import { getDatabase, ref, set, orderByChild, equalTo, query, get, update } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage';

export const removetime = async(currentUser, stn)=>{
    const email = currentUser.email;
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];

        // Check if the user data contains streams
        if (userData[userId].streams) {
            // Iterate through each stream in the user's streams
            for (const streamName in userData[userId].streams) {
                //userData[userId].streams[streamName].main = 0; 
                //await set(ref(database, `users/${userId}/streams/${streamName}/main`), 0);// Set main to 0 for all streams
                if (streamName === stn) {
                    delete userData[userId].streams[streamName].cd;
                    await update(ref(database, `users/${userId}/streams/${stn}`), { cd: null }); // Set main to 1 for the specified stream
                }
            }
            // Update the user's data in the database
            
            console.log(`Main property updated for user ${userId}`);
        } else {
            console.log('No streams found for this user.');
        }
    } else {
        console.log(`User with email ${email} not found.`);
    }
}

export const filltime = async(currentUser, stn) =>{
    const email = currentUser.email;
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];

        // Check if the user data contains streams
        if (userData[userId].streams) {
            // Iterate through each stream in the user's streams
            for (const streamName in userData[userId].streams) {
                //userData[userId].streams[streamName].main = 0; 
                //await set(ref(database, `users/${userId}/streams/${streamName}/main`), 0);// Set main to 0 for all streams
                if (streamName === stn) {
                    const currentDate = new Date();
                    const currentDateTimeString = currentDate.toString();
                    userData[userId].streams[streamName].cd = currentDateTimeString;
                    await set(ref(database, `users/${userId}/streams/${stn}/cd`), currentDateTimeString); // Set main to 1 for the specified stream
                }
            }
            // Update the user's data in the database
            
            console.log(`Main property updated for user ${userId}`);
        } else {
            console.log('No streams found for this user.');
        }
    } else {
        console.log(`User with email ${email} not found.`);
    }
}
export const updateUserStreamMain1 = async (currentUser, streamNameToUpdate, setSelectedStreatime) => {
    const email = currentUser.email;
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];

        // Check if the user data contains streams
        if (userData[userId].streams) {
            // Iterate through each stream in the user's streams
            for (const streamName in userData[userId].streams) {
                //userData[userId].streams[streamName].main = 0; 
                //await set(ref(database, `users/${userId}/streams/${streamName}/main`), 0);// Set main to 0 for all streams
                if (streamName === streamNameToUpdate) {
                    const currentDate = new Date();
                    const currentDateTimeString = currentDate.toString();
                    setSelectedStreatime(currentDateTimeString);
                    userData[userId].streams[streamName].main = 1;
                    userData[userId].streams[streamName].cd = currentDateTimeString;

                    // Create Stream Here.........................

                    await set(ref(database, `users/${userId}/streams/${streamNameToUpdate}/main`), 1);
                    await set(ref(database, `users/${userId}/streams/${streamNameToUpdate}/cd`), currentDateTimeString); // Set main to 1 for the specified stream
                }
            }
            // Update the user's data in the database
            
            console.log(`Main property updated for user ${userId}`);
        } else {
            console.log('No streams found for this user.');
        }
    } else {
        console.log(`User with email ${email} not found.`);
    }
};

export const updateUserStreamMain = async (currentUser, streamNameToUpdate) => {
    const email = currentUser.email;
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];

        // Check if the user data contains streams
        if (userData[userId].streams) {
            // Iterate through each stream in the user's streams
            for (const streamName in userData[userId].streams) {
                //userData[userId].streams[streamName].main = 0; 
                //await set(ref(database, `users/${userId}/streams/${streamName}/main`), 0);// Set main to 0 for all streams
                if (streamName === streamNameToUpdate) {
                    userData[userId].streams[streamName].main = 1;

                    // Create Stream Here.........................

                    await set(ref(database, `users/${userId}/streams/${streamNameToUpdate}/main`), 1);// Set main to 1 for the specified stream
                }
            }
            // Update the user's data in the database
            
            console.log(`Main property updated for user ${userId}`);
        } else {
            console.log('No streams found for this user.');
        }
    } else {
        console.log(`User with email ${email} not found.`);
    }
};

export const resetStreamMainValue = async (currentUser, streamName) => {
    const email = currentUser.email;
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);
  
    if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];
  
        if (userData[userId].streams && userData[userId].streams[streamName]) {
            userData[userId].streams[streamName].main = 0;
            await set(ref(database, `users/${userId}/streams/${streamName}/main`), 0);
            if (userData[userId]?.streams[streamName]?.cd !== undefined) {
                delete userData[userId].streams[streamName].cd;
              }
            
            console.log(`Main property reset to 0 for stream ${streamName}`);
        } else {
            console.log(`Stream ${streamName} not found for user ${email}`);
        }
    } else {
        console.log(`User with email ${email} not found.`);
    }
};

export const deleteStream = async (currentUser, streamNameToDelete, logodel) => {
    const email = currentUser.email;
    const usersRef = ref(database, 'users');
    const queryRef = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        const userId = Object.keys(userData)[0];

        if (userData[userId].streams && userData[userId].streams[streamNameToDelete]) {
            // Remove the stream from the user's data
            delete userData[userId].streams[streamNameToDelete];
            await set(ref(database, `users/${userId}/streams`), userData[userId].streams);
            console.log(`Stream "${streamNameToDelete}" deleted for user ${email}`);

            const storage = getStorage();
            const logoRef = storageRef(storage, `${logodel}`);
            await deleteObject(logoRef);
            console.log(`Logo "${logodel}" deleted from Firebase Storage.`);

        } else {
            console.log(`Stream "${streamNameToDelete}" not found for user ${email}`);
        }
    } else {
        console.log(`User with email ${email} not found.`);
    }
};


export const CreateStreamInDatabase = async (currentUser, streamname, streamData)=>{
    try {
    

        // Retrieve the user based on the provided email
        const usersRef = ref(database, 'users');
        const userQuery = query(usersRef, orderByChild('email'), equalTo(currentUser.email));
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
    
        // Storing the stream name and color hex under the user's streams node process
        const streamRef = ref(database, `users/${userId}/streams/${streamname}`);
        const streamSnapshot = await get(streamRef);
        if (streamSnapshot.exists()) {
            // const storage = getStorage();
            // const logoURL = streamSnapshot.data().logoURL;
            // const logoRef = storageRef(storage, `${logoURL}`);
            // await deleteObject(logoRef);
            console.log('This stream already exists in your account, It is updated with the current values');
            await set(streamRef, streamData);
            updateUserStreamMain(currentUser,streamname);

            //create stream for existing stream in firebase database here
            // updateUserStreamMain(currentUser, streamname)
        }else{
              
              await set(streamRef, streamData);
              updateUserStreamMain(currentUser,streamname);
        }
    }catch{

    }

}