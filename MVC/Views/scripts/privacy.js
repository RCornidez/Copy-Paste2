 
 
 document.addEventListener('DOMContentLoaded', function() {
    const arrow = document.getElementById('arrow');
    const hamburger = document.getElementById('hamburger');
    const slideMenu = document.getElementById('slide-menu');
    const closeMenu = document.getElementById('close-menu');

    arrow.addEventListener('click', () => {
        window.location.href = "/"
    })

    hamburger.addEventListener('click', () => {
        slideMenu.classList.add('open');
    });

    closeMenu.addEventListener('click', () => {
        slideMenu.classList.remove('open');
    });
});