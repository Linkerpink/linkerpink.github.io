// Get references to the custom cursor element
const customCursor = document.getElementById('custom-cursor');

// Variables to track the cursor state
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

// Function to update the cursor position
function updateCursor(event) {
    // Calculate the position relative to the scrolled window
    const adjustedX = event.clientX + window.scrollX;
    const adjustedY = event.clientY + window.scrollY;
    
    customCursor.style.left = `${adjustedX}px`;
    customCursor.style.top = `${adjustedY}px`;
}

// Add event listeners for mouse events
document.addEventListener('mousedown', (event) => {
    isDragging = true;
    customCursor.style.display = 'block';
    updateCursor(event);

    // Record the initial position and scroll offset
    startX = event.clientX;
    startY = event.clientY;
    scrollLeft = window.scrollX;
    scrollTop = window.scrollY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        updateCursor(event);
        // Calculate the distance moved
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        // Scroll the window
        window.scrollTo(scrollLeft - x, scrollTop - y);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    customCursor.style.display = 'none';
});

// Prevent the image from being dragged
document.querySelector('.large-image').addEventListener('dragstart', (event) => {
    event.preventDefault();
});
