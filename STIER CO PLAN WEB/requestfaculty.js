
// Calendar Variables
const calendarGrid = document.getElementById('calendar-grid');
const calendarMonth = document.getElementById('calendar-month');
let events = [];

// Define available slots as an array of date strings
const availableSlots = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize the selected date and room variables
let selectedDate = '';
let selectedRoom = '';

function renderCalendar() {
    calendarGrid.innerHTML = "";
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const monthName = firstDay.toLocaleString('default', { month: 'long' });
    calendarMonth.textContent = `${monthName} ${currentYear}`;

    // Padding for the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day', 'unavailable');
        calendarGrid.appendChild(emptyCell);
    }

    // Generate days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toISOString().split('T')[0];
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.textContent = day;

        if (availableSlots.includes(dateString)) {
            dayCell.classList.add('available');
            dayCell.onclick = () => selectDate(dateString);
        } else {
            dayCell.classList.add('unavailable');
        }

        calendarGrid.appendChild(dayCell);
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function selectDate(date) {
    selectedDate = date; // Store the selected date
    document.getElementById('reservationDate').value = date;
    alert(`Date selected: ${date}`);
    
    // Call the function to display available times
    displayAvailableTimes(date, selectedRoom);
}

document.addEventListener('DOMContentLoaded', renderCalendar);

// Show the selected section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => {
        section.classList.remove('active'); // Hide all sections
    });
    document.getElementById(sectionId).classList.add('active'); // Show the selected section
}

// Populate chairs
const chairSelect = document.getElementById('chair');
for (let i = 0; i <= 60; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    chairSelect.appendChild(option);
}

// Populate tables
const tableSelect = document.getElementById('table');
for (let h = 0; h <= 10; h++) {
    const option = document.createElement('option');
    option.value = h;
    option.textContent = h;
    tableSelect.appendChild(option);
}

// Populate sound systems
const soundsystemSelect = document.getElementById('soundsystem');
for (let k = 0; k <= 2; k++) {
    const option = document.createElement('option');
    option.value = k;
    option.textContent = k;
    soundsystemSelect.appendChild(option);
}

// Populate cameras
const cameraSelect = document.getElementById('camera');
for (let l = 0; l <= 2; l++) {
    const option = document.createElement('option');
    option.value = l;
    option.textContent = l;
    cameraSelect.appendChild(option);
}

// Populate projectors
const projectorSelect = document.getElementById('projector');
for (let g = 0; g <= 2; g++) {
    const option = document.createElement('option');
    option.value = g;
    option.textContent = g;
    projectorSelect.appendChild(option);
}

// Room selection logic
const roomsbyFloor = {
    "Ground": ["Room 101", "Room 102", "Room 103"],
    "Second": ["Room 201", "Room 202", "Room 203", "Room 204", "Room 205", "Room 206", "Room 207", "Room 208"],
    "Third": ["Room 301", "Room 302", "Room 303", "Room 304", "Room 305", "Room 306", "Room 307", "Room 308", "Room 309", "Room 310", "Room 311"],
    "Fourth": ["Room 401", "Room 402", "Room 403", "Room 404", "Room 405", "Room 406", "Room 407", "Room 408"],
    "Fifth": ["Room 501", "Room 502", "Room 503", "Room 504", "Room 505", "Room 506", "Room 507", "Room 508"],
    "Sixth": ["Room 601", "Room 602", "Room 603", "Room 604", "Room 605", "Room 606", "Room 607", "Room 608", "Room 609", "Room 610", "Room 611"]
};

function updateRooms() {
    const floorSelect = document.getElementById('floor');
    const roomSelect = document.getElementById('room');
    roomSelect.innerHTML = '<option value="">Select Room</option>';
    
    const selectedFloor = floorSelect.value;
    const rooms = roomsbyFloor[selectedFloor] || [];
    
    rooms.forEach(room => {
        const option = document.createElement("option");
        option.value = room;
        option.text = room;
        roomSelect.appendChild(option);
    });

    // Reset selected room and available times when floor changes
    selectedRoom = '';
    displayAvailableTimes(selectedDate, selectedRoom);
}

// Handle room selection change
document.getElementById('room').addEventListener('change', (event) => {
    selectedRoom = event.target.value; // Update the selected room
    displayAvailableTimes(selectedDate, selectedRoom); // Update available times based on selected room
});

// Function to display available times in a table format
function displayAvailableTimes(date, room) {
    const availableTimesDiv = document.getElementById('availableTimes');
    availableTimesDiv.innerHTML = '';

    if (!date || !room) {
        // If either date or room is not selected, return early
        return;
    }

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Available Times';
    headerRow.appendChild(timeHeader);
    table.appendChild(headerRow);

    availableTimes.forEach(slot => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = slot.time;
        timeCell.style.color = slot.available ? 'green' : 'red';
        timeCell.style.cursor = slot.available ? 'pointer' : 'not-allowed';

        if (slot.available) {
            timeCell.addEventListener('click', () => {
                alert(`You selected ${slot.time} on ${date} for ${room}.`);
            });
        }
        
        row.appendChild(timeCell);
        table.appendChild(row);
    });

    availableTimesDiv.appendChild(table);
}

// Handle form submission
document.getElementById('requestForm').addEventListener('submit', function(event) {
    event.preventDefault();
    displayAvailableTimes(selectedDate, selectedRoom);
});

// Proceed to the next section
function nextSection(nextSectionId) {
    showSection(nextSectionId);
}

// Placeholder for equipment response handling
function handleEquipmentResponse(response) {
    if (response === 'yes') {
        nextSection('equipments');
    } else {
        nextSection('date-time');
    }
}
function updateDetails(){
    const eventTitle = document.getElementById("eventTitle").value;
    const coordinatorName = document.getElementById("name").value;
    const includeVisitors = document.getElementById("options").value;
    const selectedFloor = document.getElementById("floor").value;
    const chairs = document.getElementById("chair").value;
    const table = document.getElementById("table").value;
    const camera = document.getElementById("camera").value;
    const projectors = document.getElementById("projector").value;
    const soundSystem = document.getElementById("soundsystem").value;

    document.getElementById('detail-event-title').textContent = eventTitle;
    document.getElementById('detail-coordinator-name').textContent = coordinatorName;
    document.getElementById('detail-include-visitors').textContent = includeVisitors;
    document.getElementById('detail-floor').textContent = selectedFloor;
    document.getElementById('detail-chairs').textContent = chairs;
    document.getElementById('detail-table').textContent = table;
    document.getElementById('detail-camera').textContent = camera;
    document.getElementById('detail-projector').textContent = projectors;
    document.getElementById('detail-soundsystem').textContent = soundSystem;

}
function nextSection(nextId) {
    // Update details before navigating
    updateDetails();
    
    // Hide all sections
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('active'));

    // Show the next section
    document.getElementById(nextId).classList.add('active');
}


// Initialize to show the first section
showSection('date-time');
