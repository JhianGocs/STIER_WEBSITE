
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

//Firebase Config
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
const auth = getAuth();


async function fetchRequestCount() {
    try {
        const eventsCollection = collection(db, 'events'); 
        const eventsSnapshot = await getDocs(eventsCollection);
        const totalRequests = eventsSnapshot.size; 
        
        // Update the display with the total request count
        document.getElementById('total-requests').textContent = totalRequests; 
    } catch (error) {
        console.error("Error fetching request count:", error);
    }
}

function listenForRequestChanges() {
    const eventsCollection = collection(db, 'events');
    onSnapshot(eventsCollection, (snapshot) => {
        const totalRequests = snapshot.size;
        document.getElementById('total-requests').textContent = totalRequests; // Update count in the span
    });
}
async function fetchRecordCount() {
    try {
        const eventsCollection = collection(db, 'records'); 
        const eventsSnapshot = await getDocs(eventsCollection);
        const totalRecords = eventsSnapshot.size; 
        
        // Update the display with the total request count
        document.getElementById('total-records').textContent = totalRecords; 
    } catch (error) {
        console.error("Error fetching request count:", error);
    }
}
function listenForRecordChanges() {
    const recordsCollection = collection(db, 'records');
    onSnapshot(recordsCollection, (snapshot) => {
        const totalRecords = snapshot.size; // Change variable name to totalRecords
        document.getElementById('total-records').textContent = totalRecords; // Update count in the span
    });
}




onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user.email);
        listenForRequestChanges(); 
        fetchRecordCount();
        fetchRequestCount();
    } else {
        console.log("No user is signed in.");
        window.location.href = "LoginForm.html"; 
    }
});
