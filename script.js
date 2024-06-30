document.addEventListener('DOMContentLoaded', function() {
    var cursorTrails = [];
    var cursorTimer; // Timer for cursor size adjustment

    document.addEventListener('mousemove', function (e) {
        var cursor = document.querySelector('.custom-cursor');

        // Reset cursor size and position
        cursor.style.display = 'block'; // Ensure cursor is visible
        clearTimeout(cursorTimer);

        // Set the position of the custom cursor to match the mouse position
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Create a new cursor trail
        var trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);
        cursorTrails.push(trail);

        // Remove old trails if there are too many
        if (cursorTrails.length > 10) {
            var oldTrail = cursorTrails.shift();
            document.body.removeChild(oldTrail);
        }

        // Fade out the trail after a delay
        setTimeout(function() {
            trail.style.opacity = '0';
            // Remove the trail from the DOM after fading out
            setTimeout(function() {
                document.body.removeChild(trail);
                cursorTrails.splice(cursorTrails.indexOf(trail), 1);
            }, 100); // Adjust this value to control the fade-out duration
        }, 10); // Adjust this value to control the delay before fading out
    });

    // Timer function to adjust cursor size and eventually hide it
    function adjustCursorSize(targetSize) {
        var cursorInner = document.querySelector('.cursor-inner');
        var currentSize = parseFloat(cursorInner.style.width);
        var diff = targetSize - currentSize;
        var step = diff * 0.1; // Adjust the multiplier for smoother lerping

        // Update cursor size
        cursorInner.style.width = (currentSize + step) + 'px';
        cursorInner.style.height = (currentSize + step) + 'px';

        // Continue lerping until the size is close to the target size
        if (Math.abs(step) > 0.5) { // Adjust this threshold for a smoother transition
            cursorTimer = setTimeout(function() {
                adjustCursorSize(targetSize);
            }, 10); // Adjust this value to control the interval between size adjustments
        } else {
            // If the cursor is shrinking, hide it when it becomes too small
            if (targetSize === 0) {
                var cursor = document.querySelector('.custom-cursor');
                cursor.style.display = 'none';
            }
        }
    }

    // Start timer to adjust cursor size if the cursor doesn't move for half a second
    document.addEventListener('mousemove', function() {
        clearTimeout(cursorTimer); // Reset timer
        adjustCursorSize(20); // Reset cursor size to default
        cursorTimer = setTimeout(function() {
            adjustCursorSize(0); // Shrink cursor to 0 size if there's no movement for half a second
        }, 1000); // Half a second delay
    });

    // Clear trails on mouse leave
    document.addEventListener('mouseleave', function() {
        cursorTrails.forEach(function(trail) {
            document.body.removeChild(trail);
        });
        cursorTrails = [];
        clearTimeout(cursorTimer); // Reset timer
    });
});