document.addEventListener('DOMContentLoaded', () => {
    const infoBox = document.getElementById('info-box');

    // Object containing descriptive texts for each part
    const partDescriptions = {
        '1. Pegs': 'Description for Peg',
        '2. Nut': 'Description for Nut',
        '3. Fingerboard': 'Description for Fingerboard',
        '4. Strings': 'Description for Strings',
        '5. Bridge': 'Description for Bridge',
        '6. Tailpiece': 'Description for Tailpiece',
        '7. End button': 'Description for End Button',
        '8. Chin rest': 'Description for Chin rest',
        '9. Fine tuners': 'Description for Fine tuners',
        '10. F holes': 'Description for F holes',
        '11. Neck': 'Description for Neck',
        '12. Scroll': 'Description for Scroll',
        '13. Body': 'Description for Body',
       
    };

    // Function to handle part clicks
    function onPartClick(event) {
        const partId = event.target.id;
        const description = partDescriptions[partId];
        infoBox.innerHTML = description;
        infoBox.style.display = 'block';
        // Position the info box near the clicked part
        // Add animation if needed
    }

    // Add event listeners to each part
    Object.keys(partDescriptions).forEach(partId => {
        const part = document.getElementById(partId);
        part.addEventListener('click', onPartClick);
    });
});

// Show the info box with animation
infoBox.classList.add('show');


window.onload = function() {
    var svgHeight = document.querySelector('.svg-container').offsetHeight;
    var leftButtons = document.querySelector('.left-buttons');
    var rightButtons = document.querySelector('.right-buttons');

    leftButtons.style.height = svgHeight + 'px';
    rightButtons.style.height = svgHeight + 'px';
};
