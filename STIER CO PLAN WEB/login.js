import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBjAe5wtR15GBFlLNxhaw4JUUhxNsLQ3Iw",
  authDomain: "sticoplan.firebaseapp.com",
  projectId: "sticoplan",
  storageBucket: "sticoplan.appspot.com",
  messagingSenderId: "423625599138",
  appId: "1:423625599138:web:516df589dd73cb494dcffb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById('button');
  
  button.addEventListener("click", function(event) {
    const email = document.getElementById('username').value; 
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("Login Successful");
        localStorage.setItem('userEmail', user.email);

        // Fetch user's role from Firestore
        const userDocRef = doc(db, "users", user.uid);  // Assuming 'user.uid' matches Firestore doc ID
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              const userRole = userData.role;

              // Redirect based on role
              if (userRole === 'admin') {
                window.location.href = "Dashboard.html";
              } else if (userRole === 'faculty') {
                window.location.href = "DashboardFaculty.html";
              } else {
                alert("Unknown user role");
              }
            } else {
              alert("No user data found!");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
  });
})