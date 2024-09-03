 
 
 document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const slideMenu = document.getElementById('slide-menu');
    const closeMenu = document.getElementById('close-menu');

    hamburger.addEventListener('click', () => {
        slideMenu.classList.add('open');
    });

    closeMenu.addEventListener('click', () => {
        slideMenu.classList.remove('open');
    });


    // Event listener for the "Create a Session" button
    document.getElementById('create-session').addEventListener('click', function() {
        const url = new URL('/copy-paste', window.location.origin);
        window.location.href = url; // Redirects to the 'copy-paste' route
    });

    // Event listener for the join-session form
    document.getElementById('join-session').addEventListener('submit', function(event) {
        event.preventDefault();

        const sessionId = document.getElementById('session-input').value.trim(); // Get the session ID from input

        // Use URLSearchParams to build the URL with the session ID
        const url = new URL('/copy-paste', window.location.origin);
        const params = new URLSearchParams({ session: sessionId });
        url.search = params.toString(); // Add the session parameter to the URL

        window.location.href = url; // Redirect to the 'copy-paste' route with the session ID
    });
    const highlightTitles = document.querySelectorAll('.highlight-title');

    highlightTitles.forEach(title => {
        title.addEventListener('click', () => {
            const highlight = title.parentElement;

            // Close all highlights
            document.querySelectorAll('.highlight.open').forEach(openHighlight => {
                if (openHighlight !== highlight) {
                    openHighlight.classList.remove('open');
                }
            });

            // Toggle the clicked highlight
            highlight.classList.toggle('open');
        });
    });
});