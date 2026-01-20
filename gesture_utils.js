import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas"); // We might need to add this for debugging, or just work blindly
const gestureBtn = document.getElementById("gesture-btn");
let handLandmarker = undefined;
let webcamRunning = false;
let lastVideoTime = -1;
let results = undefined;

// VOLUME CONTROL VARIABLES
const volumeBar = document.querySelector(".sound-bar");
const audio = document.getElementById("audio");
const MAX_DIST = 0.18; // Slightly reduced to make 100% volume easier to reach
const MIN_DIST = 0.025; // Slightly increased to make 0% volume easier (don't need perfect pinch)



// Initialize MediaPipe HandLandmarker
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
    });
    console.log("HandLandmarker loaded");

    // Enable button once loaded
    if (gestureBtn) {
        gestureBtn.addEventListener("click", enableCam);
        gestureBtn.innerText = "Start Gesture";
        gestureBtn.classList.remove("hide"); // Ensure it's visible
    }
};

createHandLandmarker();

// Enable Webcam and Start Prediction
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! landmarker not loaded yet.");
        return;
    }

    if (webcamRunning === true) {
        webcamRunning = false;
        gestureBtn.innerText = "Start Gesture";

        // Stop stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
        video.srcObject = null;
        return;
    }

    webcamRunning = true;
    gestureBtn.innerText = "Stop Gesture";

    const constraints = {
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}

// Main Prediction Loop
async function predictWebcam() {
    if (webcamRunning === false) return;

    // Now let's start detecting the stream.
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }

    if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];

        // Thumb Tip (4)
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];

        // Calculate Distances
        const distIndex = getDistance(thumbTip, indexTip);
        const distMiddle = getDistance(thumbTip, middleTip);
        const distRing = getDistance(thumbTip, ringTip);
        const distPinky = getDistance(thumbTip, pinkyTip);

        // --- GESTURE PRIORITY & LOCKING ---
        // If any non-index finger is close to thumb, we are in "Action Mode" (Next/Prev/Play)
        // We LOCK volume control to prevent accidental changes while trying to touch other fingers.

        const ACTION_THRESHOLD = 0.07; // Distance to trigger action readiness
        const TOUCH_THRESHOLD = 0.035; // Stricter: Requires closer contact (was 0.045)

        const isActionActive = (distMiddle < ACTION_THRESHOLD) || (distRing < ACTION_THRESHOLD) || (distPinky < ACTION_THRESHOLD);

        if (isActionActive) {
            // --- ACTION MODE (Volume Locked) ---

            let detectedAction = null;

            if (distMiddle < TOUCH_THRESHOLD) {
                detectedAction = "prev";
            } else if (distRing < TOUCH_THRESHOLD) {
                detectedAction = "next";
            } else if (distPinky < TOUCH_THRESHOLD) {
                detectedAction = "playpause";
            }

            if (detectedAction) {
                // A gesture is being held
                if (pendingGesture !== detectedAction) {
                    // New gesture started
                    pendingGesture = detectedAction;
                    gestureStartTime = Date.now();
                    gestureBtn.style.color = "orange"; // Charging color
                    gestureBtn.innerText = "Hold .";
                } else {
                    // Continuing same gesture
                    const holdTime = Date.now() - gestureStartTime;

                    // Visual Progress
                    if (holdTime > 200) gestureBtn.innerText = "Hold ...";
                    else if (holdTime > 100) gestureBtn.innerText = "Hold ..";

                    if (holdTime > 300) { // Increased to 300ms for extra safety
                        triggerAction(detectedAction);
                        // Reset pending so we don't fire repeatedly
                        pendingGesture = null;
                    }
                }
            } else {
                // Near, but not touching
                pendingGesture = null;
                gestureBtn.style.color = "#FFD700"; // Gold (Ready)
                if (gestureBtn.innerText.startsWith("Hold")) gestureBtn.innerText = "Stop Gesture";
            }

        } else {
            // --- VOLUME MODE ---
            pendingGesture = null;
            gestureBtn.style.color = "#1db954"; // Green for Volume Mode
            if (gestureBtn.innerText.startsWith("Hold")) gestureBtn.innerText = "Stop Gesture";

            // Map Distance to Volume (0 to 1)
            let vol = (distIndex - MIN_DIST) / (MAX_DIST - MIN_DIST);
            if (vol < 0) vol = 0;
            if (vol > 1) vol = 1;

            // --- ADAPTIVE SMOOTHING ---
            let diff = Math.abs(vol - currentSmoothedVol);
            let alpha = 0.03; // Base (Extremely smooth/slow)

            if (diff > 0.15) {
                alpha = 0.3; // Fast movement (Dampened from 0.4)
            } else if (diff > 0.05) {
                alpha = 0.1; // Medium movement (Dampened from 0.2)
            }

            let newSmoothedVol = (vol * alpha) + (currentSmoothedVol * (1 - alpha));

            // Tiny Dead Zone for micro-jitters
            if (Math.abs(newSmoothedVol - currentSmoothedVol) > 0.002) {
                currentSmoothedVol = newSmoothedVol;
                setVolume(currentSmoothedVol);
            }
        }

    } else {
        // Hand lost
        gestureBtn.style.color = "";
        pendingGesture = null;
    }

    window.requestAnimationFrame(predictWebcam);
}

// Helper for euclidean distance
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

let currentSmoothedVol = audio.volume;
let lastActionTime = 0;

// State for Hold-to-Trigger
let pendingGesture = null;
let gestureStartTime = 0;

function triggerAction(action) {
    const now = Date.now();
    // Debounce: 1 second between actions
    if (now - lastActionTime > 1000) {
        lastActionTime = now;

        if (action === "playpause") {
            const btn = document.getElementById("play");
            if (btn) btn.click();
            showFeedback("Play/Pause");
        } else if (action === "next") {
            // Check for next button (fa-forward-step)
            // The HTML structure has the icon inside a div usually, let's find the nearest clickable or simulate function
            // scriptt1.js defines nextSong() but it's not global. We need to click the UI element.
            // Based on scriptt1.js:  const forwardBtn = document.querySelector(".fa-forward-step");
            const btn = document.querySelector(".fa-forward-step");
            if (btn) btn.click();
            showFeedback("Next Song");

        } else if (action === "prev") {
            const btn = document.querySelector(".fa-backward-step");
            if (btn) btn.click();
            showFeedback("Prev Song");
        }
    }
}

function showFeedback(text) {
    const originalText = "Stop Gesture";
    gestureBtn.innerText = text;
    gestureBtn.style.color = "#ffffff";
    gestureBtn.style.backgroundColor = "rgba(29, 185, 84, 0.8)"; // Premium green feedback
    gestureBtn.style.boxShadow = "0 0 20px var(--spotify-green)";

    setTimeout(() => {
        gestureBtn.innerText = originalText;
        gestureBtn.style.backgroundColor = "";
        gestureBtn.style.boxShadow = "";
    }, 800);
}

function setVolume(val) {
    // Clamp
    if (val < 0.01) val = 0;
    if (val > 0.99) val = 1;

    // Update Audio element
    audio.volume = val;

    // Update UI (Slider and CSS var)
    // Only update DOM if value changes significantly to save resources
    const displayVal = Math.round(val * 100);
    if (volumeBar.value != displayVal) {
        volumeBar.value = displayVal;
        volumeBar.style.setProperty("--volume", `${displayVal}%`);
    }
}
