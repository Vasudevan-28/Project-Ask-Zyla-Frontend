import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "./firebase";
import { updatePassword } from "firebase/auth";
import { checkGoogleUser, deleteAccountAPI } from "../services/backendAPI";




// ------------------- Email/Password Auth -------------------

// Signup (Email)
export const signupUser = async (email, password) => {  // paxx  //registration page
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    //  const firebaseUser = userCredential.user;

            // Send email verification
    await sendEmailVerification(userCred.user);
    
    return 
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};



// Login (Email)
export const loginUser = async (email, password) => {   // paxx   //login page
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};


export async function logout() {
  await signOut(auth);
  localStorage.clear();
}



export const reauthAndDeleteFirebaseUser = async (password) => {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("No authenticated user found");
  }

  
  const credential = EmailAuthProvider.credential(
    user.email,
    password
  );
  
  await reauthenticateWithCredential(user, credential);
  await deleteAccountAPI()
  // await deleteUser(user);
  await signOut(auth)
};


// ------------------- Google Auth -------------------


export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};




// Setup ReCAPTCHA (make invisible)
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA verified!");
        },
      }
    );
  }
};
