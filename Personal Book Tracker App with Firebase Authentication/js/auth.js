// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWTadkOQOQaXz1XQXWeZgn1Vrfxpt09zs",
  authDomain: "book-tracker-dbe60.firebaseapp.com",
  projectId: "book-tracker-dbe60",
  storageBucket: "book-tracker-dbe60.appspot.com",
  messagingSenderId: "554100679059",
  appId: "1:554100679059:web:201fefdae341f5a5eb8866",
  measurementId: "G-GZFMJBCLHH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication functions
const AuthService = {
  // Check authentication state and redirect
  checkAuthState: function () {
    onAuthStateChanged(auth, (user) => {
      const currentPage = window.location.pathname.split("/").pop();

      if (user) {
        // User is logged in
        if (
          currentPage === "login.html" ||
          currentPage === "signup.html" ||
          currentPage === "index.html"
        ) {
          window.location.href = "books.html";
        }
      } else {
        // User is not logged in
        if (currentPage === "books.html") {
          window.location.href = "login.html";
        }
      }
    });
  },

  // Login function
  login: async function (email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  },

  // Signup function
  signup: async function (email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  },

  // Logout function
  logout: async function () {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Get user-friendly error messages
  getErrorMessage: function (error) {
    switch (error.code) {
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "Email is already in use.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return "Authentication failed. Please try again.";
    }
  },

  // Get current user
  getCurrentUser: function () {
    return auth.currentUser;
  },
};

// Initialize auth check when the script loads
AuthService.checkAuthState();

// Export the AuthService
window.AuthService = AuthService;
