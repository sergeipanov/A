

// Define the levels and their note ranges
const levels = {
    1: ["D/4", "E/4", "F/4", "G/4", "A/4", "B/4", "C/5", "D/5"], // Level 1: D4 to D5
    2: ["E/5", "F/5", "G/5", "A/5", "B/5"], // Level 2: E5 to B5
    3: ["G/3", "A/3", "B/3", "C/4"], // Level 3: G3 to C4
    4: ["G/3", "A/3", "B/3", "C/4", "D/4", "E/4", "F/4", "G/4", "A/4", "B/4", "C/5", "D/5", "E/5", "F/5", "G/5", "A/5", "B/5"] // Level 4: G3 to B5
};


// Define Possible Notes from G/3 to B/5
const notes = [
    "G/3", "A/3", "B/3",
    "C/4", "D/4", "E/4", "F/4", "G/4", "A/4", "B/4",
    "C/5", "D/5", "E/5", "F/5", "G/5", "A/5", "B/5"
];

// Map notes to corresponding violin finger numbers
const noteToFingerMapping = {
    "G/3": "0", "A/3": "1", "B/3": "2",
    "C/4": "3", "D/4": "0", "E/4": "1", "F/4": "2", "G/4": "3", "A/4": "0", "B/4": "1",
    "C/5": "2", "D/5": "3", "E/5": "0", "F/5": "1", "G/5": "2", "A/5": "3", "B/5": "4"
};

let audioContext;
let currentLevel = 1; // Start at Level 1

// Function to initialize AudioContext on user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}
let lastNote = null;

function getRandomNote() {
    let levelNotes = levels[currentLevel]; // Get the notes for the current level
    if (levelNotes.length <= 1) {
        return levelNotes[0]; // If there's only one note in the level, return it
    }

    // Filter out the lastNote if it exists
    if (lastNote) {
        levelNotes = levelNotes.filter(note => note !== lastNote);
    }

    // Get a random note from the array
    const randomIndex = Math.floor(Math.random() * levelNotes.length);
    const newNote = levelNotes[randomIndex];

    lastNote = newNote; // Update the lastNote
    return newNote;
}


// Function to load audio
function loadAudio(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

// Function to play audio
function playAudio(audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

// Function to create and render a note
function createAndRenderNote() {
    const VF = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "music-container".
    const div = document.getElementById("music-container");
    div.innerHTML = "";  // Clear the previous rendering
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Size our SVG:
    renderer.resize(500, 200); // Adjust as needed

    // And get a drawing context:
    const context = renderer.getContext();

    // Create a stave at position 10, 40 of width 400 on the canvas.
    const stave = new VF.Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    // Generate a new random note
    currentNote = getRandomNote();

    // Create the random note
    const note = new VF.StaveNote({ clef: "treble", keys: [currentNote], duration: "q" });

    // Create a voice in 4/4 and add the note
    const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables([note]);

    // Format and justify the notes to 400 pixels.
    new VF.Formatter().joinVoices([voice]).format([voice], 400);

    // Render voice
    voice.draw(context, stave);

    // Reset buttons for new note
    document.querySelectorAll("#buttons-container button, #finger-buttons-container button").forEach(button => {
        button.disabled = false; // Re-enable the button
        button.style.backgroundColor = ""; // Reset the color
    });
}

// Function to check if both note and finger are correct, then play sound and generate a new note
function checkAndGenerateNewNote() {
    const correctFinger = noteToFingerMapping[currentNote];
    const isNoteCorrect = document.querySelector(`#buttons-container button[data-note='${currentNote.charAt(0)}']`).style.backgroundColor === "green";
    const isFingerCorrect = document.querySelector(`#finger-buttons-container button[data-finger='${correctFinger}']`).style.backgroundColor === "green";

    if (isNoteCorrect && isFingerCorrect) {
        // Convert note format (e.g., "G/3" to "G3")
        const formattedNote = currentNote.replace('/', '');
        // Create the URL for the audio file
        const noteUrl = `./audio/${formattedNote}.mp3`;
        // Load and play the audio
        loadAudio(noteUrl).then(audioBuffer => {
            playAudio(audioBuffer);
        });

        setTimeout(() => {
            createAndRenderNote(); // Generate a new note
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach the start game function to the start button if it exists
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    // Attach event listeners to note buttons
    document.querySelectorAll("#buttons-container button").forEach(button => {
        button.addEventListener("click", function() {
            const selectedNote = this.getAttribute('data-note');
            this.style.backgroundColor = selectedNote === currentNote.charAt(0) ? "green" : "red";
            this.disabled = true;
            checkAndGenerateNewNote();
        });
    });

    // Attach event listeners to finger buttons
    document.querySelectorAll("#finger-buttons-container button").forEach(button => {
        button.addEventListener("click", function() {
            const selectedFinger = this.getAttribute('data-finger');
            const correctFinger = noteToFingerMapping[currentNote];
            this.style.backgroundColor = selectedFinger === correctFinger ? "green" : "red";
            this.disabled = true;
            checkAndGenerateNewNote();
        });
    });

    // Start with level 1 by default
    loadLevel(1);
});

// Function to start the game
function startGame() {
    initAudioContext();
    createAndRenderNote();

    // Hide the start button and explanatory text
    document.getElementById('start-button-container').style.display = 'none';
    document.getElementById('explanatory-text').style.display = 'none';

    // Show the music container
    document.getElementById('music-container').style.display = 'flex';

    // Optionally highlight the first level button
    document.querySelector('.game-button[data-level="1"]').classList.add('active-level');
}



// Load a new level
function loadLevel(level) {
    currentLevel = level; // Update the current level
    currentNote = getRandomNote(); // Get a new note for the current level
    createAndRenderNote(); // Render the note
    
    // Update the UI to reflect the current level
    // Highlight the active level button
    document.querySelectorAll('.game-button').forEach(btn => {
        btn.classList.remove('active-level');
        if (btn.textContent.includes(`Level ${currentLevel}`)) {
            btn.classList.add('active-level');
        }
    });
    
    // Reset any previous button states if necessary
    resetButtonStates();
}

// This function could be used to reset the button states (colors, disabled/enabled)
function resetButtonStates() {
    document.querySelectorAll("#buttons-container button, #finger-buttons-container button").forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = ""; // Reset the color
    });
}

// Initialize the game by loading level 1
loadLevel(1);

// Attach the start game function to the start button
document.getElementById('start-button').addEventListener('click', startGame);