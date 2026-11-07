
"use strict";

// ==========================================
// 1. VS CODE API
// ==========================================

const vscode = acquireVsCodeApi();

// ==========================================
// 2. DOM ELEMENTS
// ==========================================

// Pet information
const petCharacter = document.getElementById("petCharacter");
const petName = document.getElementById("petName");
const petMessage = document.getElementById("petMessage");
const moodText = document.getElementById("moodText");

// Energy statistics
const energyValue = document.getElementById("energyValue");
const energyBar = document.getElementById("energyBar");

// Happiness statistics
const happinessValue = document.getElementById("happinessValue");
const happinessBar = document.getElementById("happinessBar");

// Level and EXP statistics
const levelValue = document.getElementById("levelValue");
const expValue = document.getElementById("expValue");
const expBar = document.getElementById("expBar");

// Action buttons
const feedButton = document.getElementById("feedButton");
const sleepButton = document.getElementById("sleepButton");
const playButton = document.getElementById("playButton");

// ==========================================
// 3. SEND MESSAGE TO EXTENSION HOST
// ==========================================

function sendPetAction(action) {
    vscode.postMessage({
        type: `pet:${action}`
    });
}

// ==========================================
// 4. PET INTERACTIONS
// ==========================================

if (petCharacter) {
    petCharacter.addEventListener("click", () => {
        sendPetAction("interact");
    });
}

if (feedButton) {
    feedButton.addEventListener("click", () => {
        sendPetAction("feed");
    });
}

if (sleepButton) {
    sleepButton.addEventListener("click", () => {
        sendPetAction("sleep");
    });
}

if (playButton) {
    playButton.addEventListener("click", () => {
        sendPetAction("play");
    });
}

// ==========================================
// 5. RECEIVE MESSAGE FROM EXTENSION HOST
// ==========================================

window.addEventListener("message", (event) => {
    const message = event.data;

    if (!message || typeof message !== "object") {
        return;
    }

    switch (message.type) {
        case "pet:update":
            if (message.state) {
                updatePetUI(message.state);
            }
            break;

        default:
            console.warn(
                "[CodePet] Unknown message:",
                message.type
            );
    }
});

// ==========================================
// 6. UPDATE PET UI
// ==========================================

function updatePetUI(state) {
    if (!state || typeof state !== "object") {
        return;
    }

    // Pet information
    if (petName) {
        petName.textContent = state.name ?? "CodePet";
    }

    if (petMessage) {
        petMessage.textContent =
            state.message ?? "Hello! Ready to code today?";
    }

    // Mood
    if (moodText) {
        moodText.textContent = formatMood(state.mood);
    }

    if (petCharacter && state.mood) {
        petCharacter.dataset.mood = state.mood;
    }

    // Energy
    updateStat(
        energyValue,
        energyBar,
        state.energy
    );

    // Happiness
    updateStat(
        happinessValue,
        happinessBar,
        state.happiness
    );

    // Level
    if (levelValue) {
        levelValue.textContent = state.level ?? 1;
    }

    // EXP
    if (expValue) {
        expValue.textContent = state.exp ?? 0;
    }

    if (expBar) {
        const currentExp = Number(state.exp) || 0;
        const expProgress = currentExp % 100;

        expBar.style.width = `${expProgress}%`;
    }

    console.log("[CodePet] UI updated:", state);
}

// ==========================================
// 7. UPDATE STATISTICS
// ==========================================

function updateStat(valueElement, barElement, value) {
    if (typeof value !== "number") {
        return;
    }

    const safeValue = Math.max(
        0,
        Math.min(100, value)
    );

    if (valueElement) {
        valueElement.textContent = `${safeValue}%`;
    }

    if (barElement) {
        barElement.style.width = `${safeValue}%`;
    }
}

// ==========================================
// 8. FORMAT PET MOOD
// ==========================================

function formatMood(mood) {
    const moods = {
        happy: "Happy",
        neutral: "Neutral",
        tired: "Tired",
        sleeping: "Sleeping"
    };

    return moods[mood] ?? "Unknown";
}

// ==========================================
// 9. INITIALIZE PET
// ==========================================

function initializePet() {
    console.log("[CodePet] Webview initialized.");

    vscode.postMessage({
        type: "pet:ready"
    });
}

initializePet();
