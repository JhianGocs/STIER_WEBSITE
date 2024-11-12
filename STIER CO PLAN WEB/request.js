// Import the necessary Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, addDoc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your Firebase configuration
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

// Fetch events from Firestore and populate the table
async function fetchEvents() {
    const eventsCollection = collection(db, "events");
    const eventSnapshot = await getDocs(eventsCollection);
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; 

    eventSnapshot.forEach((doc) => {
        const data = doc.data();
        const equipmentDetails = [];
        if (data.camera) equipmentDetails.push(`Camera: ${data.camera}`);
        if (data.projectors) equipmentDetails.push(`Projector: ${data.projectors}`); 
        if (data.soundSystem) equipmentDetails.push(`Sound System: ${data.soundSystem}`); 
        if (data.tables) equipmentDetails.push(`Tables: ${data.tables}`); 
        if (data.chairs) equipmentDetails.push(`Chairs: ${data.chairs}`);
        const equipmentString = equipmentDetails.length > 0 ? equipmentDetails.join(', ') : 'None';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.userId || 'N/A'}</td>
            <td>${data.coordinatorName || 'N/A'}</td>
            <td>${data.room || 'N/A'}</td>
            <td>${data.floor || 'N/A'}</td>
            <td>${data.timeSlot || 'N/A'}</td>
            <td>${data.attendees || 'N/A'}</td>
            <td>${data.date || 'N/A'}</td>
            <td>
                <select class="status-select">
                    <option value="Pending" ${data.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option value="Accepted" ${data.status === "Accepted" ? "selected" : ""}>Accepted</option>
                    <option value="Rejected" ${data.status === "Rejected" ? "selected" : ""}>Rejected</option>
                </select>
            </td>
            <td>${data.eventTitle || 'N/A'}</td>
            <td>${equipmentString}</td>
            <td>${data.visitor || 'N/A'}</td>
            <td><button class="status-button" onclick="updateStatus('${doc.id}', this)">Update Status</button></td>
        `;

        // Attach an onchange event to the select element
        row.querySelector('.status-select').addEventListener('change', function() {
            updateEventStatus(doc.id, this.value);
        });

        tbody.appendChild(row);
    });
}

// Function to update the status locally and in Firestore, and add notification
async function updateStatus(eventId, button) {
    const select = button.closest('tr').querySelector('.status-select');
    const selectedValue = select.value;
    const row = button.closest('tr');

    // Update the status cell locally
    row.cells[7].textContent = selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);

    // Add notification based on the status
    await addNotification(eventId, selectedValue);

    // Feedback message
    alert("Status updated to: " + selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1));
}

// Function to add a notification to the "notifications" collection based on status
async function addNotification(eventId, status) {
    const eventSnapshot = await getDoc(doc(db, "events", eventId));
    const eventData = eventSnapshot.data();
    const message = status === "Accepted" ? 
        "Good Day/Good Afternoon Request for this event has been accepted Please for Further Question Contanct the Building Admin." : 
        "Good Day/Good Afternoon the Given Request for this event is unavailable For Further Question Please Contact the Building Admin.";

    const notificationData = {
        ...eventData,  // Spread all event details
        eventId: eventId,
        status: status,
        message: message,
        timestamp: new Date()
    };

    try {
        await addDoc(collection(db, "notifications"), notificationData);
        console.log("Notification added: ", notificationData);
    } catch (error) {
        console.error("Error adding notification: ", error);
    }
}

// Function to handle updating the event status
async function updateEventStatus(eventId, newStatus) {
    const eventRef = doc(db, "events", eventId);
    
    try {
        // Fetch the event data
        const eventSnapshot = await getDoc(eventRef);
        if (!eventSnapshot.exists()) {
            console.error("No such document!");
            return;
        }
        
        const eventData = eventSnapshot.data();
        console.log("Event Data: ", eventData); // Debugging log

        // Prepare record data to be stored in records collection
        const recordData = {
            ...eventData,
            status: newStatus,
            originalEventId: eventId,
            transferredAt: new Date(),
        };

        // Add a new document in the records collection
        const recordsRef = collection(db, "records");
        await addDoc(recordsRef, recordData);
        console.log("Record added to records collection: ", recordData);

        // Delete the original event
        await deleteDoc(eventRef);
        console.log("Original event deleted from events collection!");

    } catch (error) {
        console.error("Error updating event status: ", error);
    }
}

// Function to add a new event to the calendar
async function addEventToCalendar(eventName, eventDate, eventTime) {
    if (!eventName || !eventDate || !eventTime) {
        alert("All fields must be filled in.");
        return;
    }
    try {
        const newEventRef = await addDoc(collection(db, "calendar_events"), {
            eventTitle: eventName,
            date: eventDate,        
            timeSlot: eventTime     
        });
        console.log("Event added to calendar_events collection with ID: ", newEventRef.id);
        alert("Event added successfully!");
    } catch (error) {
        console.error("Error adding event to calendar_events collection: ", error);
        alert("There was an error adding the event. Please try again.");
    }
}

// Handle user logout
const logout = () => {
    signOut(auth).then(() => {
        alert("Logged out successfully");
        window.location.href = "LoginForm.html";
    }).catch((error) => {
        console.error("Error logging out: ", error);
    });
};

// Make functions globally accessible
window.updateEventStatus = updateEventStatus;
window.updateStatus = updateStatus;
window.addNotification = addNotification;
window.addEventToCalendar = addEventToCalendar;  // Make addEventToCalendar globally accessible

// Fetch events on page load
fetchEvents();
