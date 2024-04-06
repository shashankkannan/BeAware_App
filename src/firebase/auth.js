import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";


export const doCreateUserWithEmailAndPassword = async (email,password) => {
    return createUserWithEmailAndPassword(auth,email,password);
};

export const doSignInWithEmailAndPassword = async (email,password)=>{
    return signInWithEmailAndPassword(auth,email,password);
};

export const doSignOut =() => {
    return auth.signOut();
};

export const doPasswordReset = (email)=>{
    return sendPasswordResetEmail(auth,email);
};

// export const doPasswordChange = (password) =>{
//     return updatePassword(auth.currentUser,password);
// };

// export const doSendEmailVerification = ()=>{
//     return sendEmailVerification(zuth.currentUser, {url:`${window.location.origin}/manage`});
// };

