// --- CONFIGURATION ---
// Replace this with your actual Backboard.io API Key when ready.
// If you leave it as is, the app will run in "Mock Mode" and simulate AI responses.
const BACKBOARD_API_KEY = "YOUR_BACKBOARD_API_KEY_HERE";
const BACKBOARD_API_URL = "https://api.backboard.io/v1/chat/completions";

// --- DOM ELEMENTS ---
const videoElement = document.getElementById('video');
const messageDisplay = document.getElementById('message-display');
const statusDisplay = document.getElementById('status');
const testBtn = document.getElementById('test-btn');

// --- STATE VARIABLES ---
let blinkCounter = 0;
let lastBlinkTime = 0;
let blinkTimer = null;
let eyeClosed = false;
let longBlinkTimer = null;
let longBlinkCount = 0;

// --- MEDIAPIPE FACE MESH SETUP ---
const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

// --- EYE ASPECT RATIO (EAR) CALCULATION ---
// This measures how open the eye is. A lower number means the eye is closing.
function calculateEAR(landmarks, top, bottom, left, right) {
    const verticalDist = Math.abs(landmarks[top].y - landmarks[bottom].y);
    const horizontalDist = Math.abs(landmarks[left].x - landmarks[right].x);
    return verticalDist / horizontalDist;
}

// --- MAIN DETECTION LOOP ---
function onResults(results) {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

    const landmarks = results.multiFaceLandmarks[0];

    // Left Eye Landmarks (Indexes from MediaPipe)
    const leftEAR = calculateEAR(landmarks, 159, 145, 33, 133);
    // Right Eye Landmarks
    const rightEAR = calculateEAR(landmarks, 386, 374, 362, 263);

    const avgEAR = (leftEAR + rightEAR) / 2;

    // Threshold for blink detection. 
    // Lower = harder to trigger. Higher = easier to trigger. Adjust for patient.
    const BLINK_THRESHOLD = 0.22; 

    if (avgEAR < BLINK_THRESHOLD && !eyeClosed) {
        // Eye just closed
        eyeClosed = true;
        longBlinkTimer = setTimeout(() => {
            // If eye stays closed for 600ms, it's a "Long Blink"
            triggerBlinkPattern('long');
        }, 600);
    } else if (avgEAR >= BLINK_THRESHOLD && eyeClosed) {
        // Eye just opened
        eyeClosed = false;
        clearTimeout(longBlinkTimer);
        if (avgEAR >= BLINK_THRESHOLD) {
            // It was a short blink
            triggerBlinkPattern('short');
        }
    }
}

// --- BLINK DECODING LOGIC ---
function triggerBlinkPattern(type) {
    const now = Date.now();
    const timeSinceLastBlink = now - lastBlinkTime;

    // Reset counter if too much time has passed (1.5 seconds) between blinks
    if (timeSinceLastBlink > 1500) {
        blinkCounter = 0;
        longBlinkCount = 0;
    }

    if (type === 'long') {
        longBlinkCount++;
        if (longBlinkCount === 1) {
            handleLongBlink();
        } else if (longBlinkCount === 2) {
            sendToBackend("I am in pain.");
        }
        blinkCounter = 0; 
        lastBlinkTime = now;
        
        // Reset long blink count after a delay
        setTimeout(() => { longBlinkCount = 0; }, 2000);
        return;
    }

    blinkCounter++;
    lastBlinkTime = now;

    // Wait 600ms to see if user blinks again (distinguishes single vs double vs triple)
    clearTimeout(blinkTimer);
    blinkTimer = setTimeout(() => {
        executePattern(blinkCounter);
        blinkCounter = 0;
    }, 600);
}

function handleLongBlink() {
    sendToBackend("I need water.");
}

function executePattern(count) {
    let message = "";
    switch(count) {
        case 1: message = "Hello dear."; break;
        case 2: message = "What do you want?"; break;
        case 3: message = "Yes, please."; break;
        case 4: message = "No, thank you."; break;
        default: 
            messageDisplay.innerText = "Unknown pattern. Please try again.";
            return;
    }

    if (message) {
        sendToBackend(message);
    }
}

// --- BACKBOARD.IO API INTEGRATION ---
async function sendToBackend(userMessage) {
    messageDisplay.innerText = "Processing...";
    statusDisplay.innerText = "Sending to AI...";

    // MOCK MODE: If no API key is provided, simulate a response for testing.
    if (BACKBOARD_API_KEY === "YOUR_BACKBOARD_API_KEY_HERE") {
        setTimeout(() => {
            const mockReply = `"${userMessage}" You're in safe hands Assistance is on the way, I have alerted your caregiver`;
            displayAndSpeak(mockReply);
            statusDisplay.innerText = "Mock Mode Active";
        }, 1000);
        return;
    }

    try {
        const response = await fetch(BACKBOARD_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BACKBOARD_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o", 
                messages: [
                    { 
                        role: "system", 
                        content: "You are a compassionate assistant for a patient with locked-in syndrome. The patient communicates via eye blinks. Respond empathetically, confirm their request, and keep responses under 20 words." 
                    },
                    { role: "user", content: `Patient blinked: ${userMessage}` }
                ]
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        displayAndSpeak(aiResponse);
        statusDisplay.innerText = "Message sent to caregiver.";

    } catch (error) {
        console.error("Backboard Error:", error);
        displayAndSpeak(userMessage); // Fallback to raw message
        statusDisplay.innerText = "AI unavailable. Displaying raw message.";
    }
}

// --- HELPER TO DISPLAY AND SPEAK ---
function displayAndSpeak(text) {
    messageDisplay.innerText = text;
    
    // Use Web Speech API to speak the response out loud
    // (This is crucial for a patient who cannot read the screen easily)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
}

// --- INITIALIZE CAMERA ---
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await faceMesh.send({image: videoElement});
    },
    width: 640,
    height: 480
});

camera.start().then(() => {
    statusDisplay.innerText = "Camera active. Start blinking to communicate.";
}).catch(err => {
    statusDisplay.innerText = "Error accessing camera. Please allow permissions.";
    console.error(err);
});

// --- TEST BUTTON LOGIC ---
testBtn.addEventListener('click', () => {
    sendToBackend("Hello dear");
});
// Inside app.js, inside the executePattern function, before sendToBackend(message);

// Trigger a visual pulse on the GIF
const heroGif = document.querySelector('.hero-gif');
if (heroGif) {
    heroGif.style.transform = 'scale(1.1)';
    setTimeout(() => {
        heroGif.style.transform = 'scale(1)';
    }, 300);
}