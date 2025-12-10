// src/services/authservice.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "./firebase";
import { updatePassword } from "firebase/auth";
import { checkGoogleUser } from "../services/backendAPI";



//
// ------------------- Email/Password Auth -------------------
//

// Signup (Email)
export const signupUser = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
};

// Login (Email)
export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

//
// ------------------- Google Auth -------------------
//
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // 1️⃣ Check if user exists in MongoDB
    const googleCheck = await checkGoogleUser(firebaseUser.email);

    if (googleCheck.exists) {
      // 👉 Already registered → go to dashboard
      return {
        status: "existing",
        skin_profile: googleCheck.skin_profile === true,
        firebaseUser,
      };
    } else {
      // 👉 New Google user → must finish signup
      return {
        status: "new",
        skin_profile: false,
        firebaseUser,
      };
    }



    
};


//
// ------------------- Apple Auth -------------------
//
export const loginWithApple = async () => {
  const provider = new OAuthProvider("apple.com");
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Apple login error:", error.message);
    throw error;
  }
};

//
// ------------------- Phone Number Auth -------------------
//
export const updateFirebasePassword = async (newPassword) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No Firebase user logged in");
  }

  await updatePassword(user, newPassword);
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
          console.log("✅ reCAPTCHA verified!");
        },
      }
    );
  }
};

// Send OTP
export const sendOTP = async (phoneNumber) => {
  try {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    console.log("📲 OTP sent successfully!");
    return confirmationResult;
  } catch (error) {
    console.error("❌ Error sending OTP:", error.message);
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    console.log("✅ OTP verified successfully!");
    return result.user;
  } catch (error) {
    console.error("❌ Invalid OTP:", error.message);
    throw error;
  }
};

export const resetFirebasePassword = async (email, newPassword) => {
  // const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  const apiKey = "AIzaSyB8W2XVgnbSThSwqOX3Y3z8uf8jGNu7OTY";

  // STEP 1 — Generate OOB reset code (WITHOUT sending email)
  const oobURL = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;

  const oobRes = await fetch(oobURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requestType: "PASSWORD_RESET",
      email: email,
    }),
  });

  const oobData = await oobRes.json();

  if (!oobData.oobCode) {
    console.error("Firebase OOB Error:", oobData);
    throw new Error("Failed to generate Firebase reset code");
  }

  const oobCode = oobData.oobCode;

  // STEP 2 — Use oobCode to set new password
  const resetURL = `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`;

  const resetRes = await fetch(resetURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      oobCode,
      newPassword,
    }),
  });

  const resetData = await resetRes.json();

  if (!resetData.email) {
    console.error("Firebase Password Update Error:", resetData);
    throw new Error("Failed to update Firebase password");
  }

  return resetData;
};


// Update Firebase password
export const updatePasswordInFirebase = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No logged in user");

    await updatePassword(user, newPassword);
    console.log("Firebase password updated");
  } catch (error) {
    console.error("Firebase password update error:", error.message);
    throw error;
  }
};


//
// ------------------- Logout -------------------
export const logoutUser = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
};

//
// ------------------- Delete Account -------------------
export const deleteUserAccount = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await deleteUser(user);
      console.log("🗑️ User account deleted successfully");
    } else {
      console.warn("⚠️ No user currently logged in to delete");
    }
  } catch (error) {
    console.error("Delete account error:", error.message);
    throw error;
  }
};

// Validate password using Firebase rules
export const validateFirebasePassword = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);

    // If account exists, this will throw "email-already-in-use"
    // which means password is valid (strong)
    return true;
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      return true; // Password is valid
    }

    // This contains Firebase's full password rule message
    alert(err.message);
    return false;
  }
};
