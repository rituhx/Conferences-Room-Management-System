let currentRate = 0;

function showBookingForm() {
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
    showRoomSelection();
}

function hideBookingForm() {
    document.getElementById('bookingForm').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
    showRoomSelection(); // Reset to room selection view
}

function showRoomForm(roomType, rate, location) {
    document.querySelector('.room-container').style.display = 'none';
    document.getElementById('roomBookingForm').style.display = 'block';
    
    // Update form details
    document.getElementById('selectedRoomName').textContent = 
        roomType.charAt(0).toUpperCase() + roomType.slice(1) + ' Meeting Room';
    document.getElementById('selectedLocation').textContent = location;
    document.getElementById('selectedRate').textContent = rate;
    currentRate = rate;
    
    updateTotalPrice();
}

function showRoomSelection() {
    document.querySelector('.room-container').style.display = 'grid';
    document.getElementById('roomBookingForm').style.display = 'none';
}

function updateTotalPrice() {
    const hours = parseInt(document.getElementById('duration').value);
    const total = hours * currentRate;
    document.getElementById('totalPrice').textContent = total;
    document.getElementById('durationSummary').textContent = hours;
}

// Initialize date inputs
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });
});

function saveBookingToCSV(event) {
event.preventDefault();

// Validate required fields
if (!document.querySelector('.room-booking-form').checkValidity()) {
    alert('Please fill in all required fields marked with *');
    return;
}

try {
    // Get all form values
    const bookingData = {
        bookingId: generateBookingId(),
        bookingDate: new Date().toLocaleString(),
        roomName: document.getElementById('selectedRoomName').textContent,
        location: document.getElementById('selectedLocation').textContent,
        ratePerHour: document.getElementById('selectedRate').textContent,
        fullName: document.getElementById('booker-name').value,
        email: document.getElementById('booker-email').value,
        phone: document.getElementById('booker-phone').value,
        company: document.getElementById('company').value || 'N/A',
        eventDate: document.getElementById('booking-date').value,
        startTime: document.getElementById('start-time').value,
        duration: document.getElementById('duration').value,
        attendees: document.getElementById('attendees').value,
        additionalServices: Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(cb => cb.value).join(', ') || 'None',
        specialRequests: document.getElementById('special-requests').value || 'None',
        totalPrice: document.getElementById('totalPrice').textContent
    };

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Create CSV content
    const headers = Object.keys(bookingData);
    const values = Object.values(bookingData).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    );
    
    const csvContent = [
        headers.join(','),
        values.join(',')
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `booking_${bookingData.bookingId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show confirmation message
    const confirmationMessage = `
        Booking Confirmed!

        Booking ID: ${bookingData.bookingId}
        Room: ${bookingData.roomName}
        Date: ${bookingData.eventDate}
        Time: ${bookingData.startTime}
        Duration: ${bookingData.duration} hours
        Total Price: $${bookingData.totalPrice}

        Your booking details have been downloaded as a CSV file.
        Thank you for your booking!
    `;

    alert(confirmationMessage);

    // Reset form and close booking window
    document.querySelector('.room-booking-form').reset();
    hideBookingForm();

} catch (error) {
    console.error('Error details:', error);
    alert('An error occurred while processing your booking. Please try again.');
}
}

// Add this helper function if not already present
function generateBookingId() {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BK${timestamp}${random}`;
}

// Update the contact link to use onclick instead of href
document.querySelector('a[href="Contect.html"]').setAttribute('onclick', 'showContactPopup()');
document.querySelector('a[href="Contect.html"]').removeAttribute('href');

function showContactPopup() {
    document.getElementById('contactPopup').style.display = 'block';
}

function closeContactPopup() {
    document.getElementById('contactPopup').style.display = 'none';
}

// Close popup when clicking outside
window.onclick = function(event) {
    const popup = document.getElementById('contactPopup');
    if (event.target == popup) {
        popup.style.display = 'none';
    }
}

function submitFeedback(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const feedback = document.getElementById('feedback').value;
    const date = new Date().toLocaleDateString();
    
    // Create feedback HTML
    const feedbackItem = `
        <div class="feedback-item">
            <div class="feedback-header">
                <span class="feedback-name">${name}</span>
                <span class="feedback-rating">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span>
            </div>
            <p class="feedback-text">${feedback}</p>
            <div class="feedback-date">${date}</div>
        </div>
    `;
    
    // Add to display
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.insertAdjacentHTML('afterbegin', feedbackItem);
    
    // Store in localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.unshift({
        name,
        rating,
        feedback,
        date
    });
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Reset form
    event.target.reset();
    
    // Show success message
    alert('Thank you for your feedback!');
}

// Load saved feedbacks on page load
document.addEventListener('DOMContentLoaded', function() {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const feedbackList = document.getElementById('feedbackList');
    
    feedbacks.forEach(item => {
        const feedbackItem = `
            <div class="feedback-item">
                <div class="feedback-header">
                    <span class="feedback-name">${item.name}</span>
                    <span class="feedback-rating">${'★'.repeat(item.rating)}${'☆'.repeat(5-item.rating)}</span>
                </div>
                <p class="feedback-text">${item.feedback}</p>
                <div class="feedback-date">${item.date}</div>
            </div>
        `;
        feedbackList.insertAdjacentHTML('beforeend', feedbackItem);
    });
});


       