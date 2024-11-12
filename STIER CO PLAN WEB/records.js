// Firebase configuration and library imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBjAe5wtR15GBFlLNxhaw4JUUhxNsLQ3Iw",
    authDomain: "sticoplan.firebaseapp.com",
    projectId: "sticoplan",
    storageBucket: "sticoplan.appspot.com",
    messagingSenderId: "423625599138",
    appId: "1:423625599138:web:516df589dd73cb494dcffb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

async function loadRecords() {
    try {
        const recordsCollection = collection(db, "records");
        const recordsSnapshot = await getDocs(recordsCollection);
        const recordsTable = document.querySelector("tbody");

        console.log(recordsSnapshot); // To see the snapshot data

        recordsSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data); // To see the document data being fetched

            const row = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = data.transferredAt ? new Date(data.transferredAt.seconds * 1000).toLocaleDateString() : "N/A";
            row.appendChild(dateCell);

            const timeCell = document.createElement("td");
            timeCell.textContent = data.timeSlot || "N/A";
            row.appendChild(timeCell);

            const requestorCell = document.createElement("td");
            requestorCell.textContent = data.userId || "N/A";
            row.appendChild(requestorCell);

            const titleCell = document.createElement("td");
            titleCell.textContent = data.eventTitle || "N/A";
            row.appendChild(titleCell);

            const statusCell = document.createElement("td");
            statusCell.textContent = data.status || "N/A"; // Updated event status
            row.appendChild(statusCell);

            const detailsCell = document.createElement("td");
            const detailsButton = document.createElement("button");
            detailsButton.textContent = "Check";
            detailsButton.classList.add("check-button");
            
            detailsButton.onclick = () => openPopup(
                data.attendees,
                data.visitor,
                data.room,
                data.floor,
                data.camera,
                data.projector,
                data.soundSystem,
                data.tables,
                data.chairs,
                data.timeSlot
            );
            detailsCell.appendChild(detailsButton);
            row.appendChild(detailsCell);

            recordsTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching records: ", error);
    }
}

// Function to log out the user
function logout() {
    signOut(auth).then(() => {
        localStorage.removeItem('userEmail');
        window.location.href = "LoginForm.html";
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}

// Function to open and close the popup
function openPopup(attendees, visitor, room, floor, camera, projector, soundSystem, tables, chairs, timeSlot) {
    document.getElementById("attendees").textContent = attendees || "N/A";
    document.getElementById("visitor").textContent = visitor || "N/A";
    document.getElementById("room").textContent = room || "N/A";
    document.getElementById("floor").textContent = floor || "N/A";
    document.getElementById("camera").textContent = camera || "N/A";
    document.getElementById("projector").textContent = projector || "N/A";
    document.getElementById("soundSystem").textContent = soundSystem || "N/A";
    document.getElementById("tables").textContent = tables || "N/A";
    document.getElementById("chairs").textContent = chairs || "N/A";
    document.getElementById("timeSlot").textContent = timeSlot || "N/A";

    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Load the records when the page is loaded
window.addEventListener("DOMContentLoaded", loadRecords);
