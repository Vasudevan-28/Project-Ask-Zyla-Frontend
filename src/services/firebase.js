// src/services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// ✅ Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyB8W2XVgnbSThSwqOX3Y3z8uf8jGNu7OTY",
  // authDomain: "test-az-331c3.firebaseapp.com",
  // projectId: "test-az-331c3",
  // storageBucket: "test-az-331c3.firebasestorage.app",
  // messagingSenderId: "792129436523",
  // appId: "1:792129436523:web:1431d110a6ca2070a1aa2e",
  // measurementId: "G-T3HE2C4S58",

  // apiKey: "AIzaSyANlX1y79Gv45VyNUM5OVxAhnCMjBZcRfI",
  // authDomain: "ask-zyla-prototype.firebaseapp.com",
  // projectId: "ask-zyla-prototype",
  // storageBucket: "ask-zyla-prototype.firebasestorage.app",
  // messagingSenderId: "200458351621",
  // appId: "1:200458351621:web:980f687729ff7fd396986c"

  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};



// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 🌐 Social login providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// 📱 Setup ReCAPTCHA for phone number auth
export const setupRecaptcha = (containerId = "recaptcha-container") => {
  const verifier = new RecaptchaVerifier(
    containerId,
    {
      size: "invisible", // or 'normal' if you want to display the captcha box
      callback: (response) => {
        console.log("✅ ReCAPTCHA verified successfully!");
      },
    },
    auth
  );

  return verifier;
};

// 🔔 Firebase Cloud Messaging (Push Notifications)
export const messaging = getMessaging(app);

// 📡 Function to get FCM Token
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BJwE0gCY278U9YqOgeCP4LTkObWUAFoejVBcnyxOB6dopJ2O72vzDxsGfkfiKy5qV8KRScSC-ouk72W7NnU8W28", // from Firebase Console
    });

    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.log("⚠️ No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("❌ Error getting FCM token:", error);
  }
};

// 💬 Handle foreground notifications
onMessage(messaging, (payload) => {
  console.log("📩 Message received: ", payload);
  if (payload?.notification) {
    const { title, body } = payload.notification;
    alert(`${title}: ${body}`);
  }
});

export default app;
