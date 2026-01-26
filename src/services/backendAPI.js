import { apiClient, publicClient } from "./apiClient";

const API_URL = import.meta.env.VITE_API_URL;

// ---------------------- SAVE USER ----------------------
export const saveUserToDB = async (userData) => {
  try {
    const { data } = await apiClient.post(`/auth/signup`, userData); // paxx
    return data;
  } catch (error) {
    const err = error.response?.data;
    throw new Error(err?.detail || "Failed to save user in DB");
  }
};

export const saveGoogleSignup = async (userData) => {  // paxx    // registration page
  const { data } = await apiClient.post(`/auth/save-user`, userData);
  return data;
};


// ---------------------- LOGIN ----------------------
export const loginWithBackend = async (identifier, password) => {
  const { data } = await publicClient.post(`/auth/login`, {
    identifier,
    password,
  });
  console.log(data)
  return data;
};



export const getEmailForPhone = async (phone) => {          // paxx     // ForgotPhonePassword page
  try {
    const { data } = await publicClient.post(`/auth/getemailforphone`, { phone });
    return data;
  } catch (error) {
    const err = error.response?.data;
    throw new Error(err?.detail || "Failed to retrieve email");
  }
};

// ---------------------- EMAIL OTP ----------------------
export const sendEmailOtp = async (email) => {          // paxx     // ForgotPassword & ForgotPhonePassword & VerificationPage
  try {
    const { data } = await publicClient.post(`/auth/send-email-otp`, { email });
    return data;
  } catch (error) {
    const err = error.response?.data;
    throw new Error(err?.detail || "Failed to send OTP");
  }
};


export const verifyEmailOtp = async (email, otp) => {       // paxx     // VerificationPage
  try {
    const { data } = await publicClient.post(`/auth/verify-email-otp`, {
      email,
      otp,
    });
    return data;
  } catch (error) {
    const err = error.response?.data;
    const message =
      err?.detail || err?.message || "OTP verification failed";
    throw new Error(message);
  }
};



// ---------------------- RESET PASSWORD ----------------------
export const resetEmailPassword = async (new_password) => {
  try {
    const { data } = await apiClient.post(     // paxx       // NewPassword & ResetPassword & RegistrationPage
      `/auth/resetpassemail`,
      // { email, new_password }
      { new_password}
    );
    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { error: error.message };
    }
  }
};

export const setNewPassword = async (new_password) => {
  try {
    const { data } = await apiClient.post(     // paxx       // NewPassword 
      `/auth/set-new-pass`,
      { new_password }
    );
    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { error: error.message };
    }
  }
};


// ---------------------- PHONE OTP ----------------------
export const sendOtpToPhone = async (phone) => {
  try {
    const { data } = await publicClient.post(   // paxx     // VerificationPage
      `/auth/send-otp`,
      { phone }
    );
    return data;
  } catch (error) {
    const err = error.response?.data;
    throw new Error(err?.detail || "Failed to send phone OTP");
  }
};




export const deleteAccountAPI = async () => {   // paxx      // setting
  const { data } = await apiClient.post(`/auth/delete-account`);
  return data;
};

export const clearCacheAPI = async () => {      // paxx      // setting
  const { data } = await apiClient.post(`/sensitive/clear_cache`);
  return data;
};



// ---------------------- CHECK IF USER EXISTS ----------------------
export const checkGoogleUser = async (email) => {
  const { data } = await publicClient.post(   // paxx    // Signup & authservice
    `/auth/check-google-user`,
    { email }
  );
  return data;
};
