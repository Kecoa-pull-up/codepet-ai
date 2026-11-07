
import * as vscode from "vscode";
import { PetBehavior } from "./petBehavior";
import type {
    PetAction,
    PetBehaviorState
} from "./petBehavior";

export type PetMood =
    | "happy"
    | "neutral"
    | "tired"
    | "sleeping";

export interface PetState extends PetBehaviorState {
    lastUpdatedAt: number;
}

const STORAGE_KEY = "codepet.petState";

const PASSIVE_INTERVAL = 5 * 60 * 1000;

// Maksimal simulasi offline: 24 jam
const MAX_OFFLINE_TICKS = 288;

const DEFAULT_STATE: PetState = {
    name: "CodePet",
    energy: 100,
    happiness: 100,
    mood: "happy",
    exp: 0,
    level: 1,
    message: "Hello! Ready to code today?",
    lastUpdatedAt: Date.now()
};

export class PetStateManager {
    private state: PetState;

    constructor(
        private readonly storage: vscode.Memento
    ) {
        this.state = this.loadState();

        // Hitung perubahan selama aplikasi tidak aktif
        this.applyOfflineDecay();
    }

    // ======================================
    // LOAD SAVED STATE
    // ======================================

    private loadState(): PetState {
        const savedState =
            this.storage.get<Partial<PetState>>(STORAGE_KEY);

        if (!savedState) {
            return { ...DEFAULT_STATE };
        }

        return {
            name:
                typeof savedState.name === "string"
                    ? savedState.name
                    : DEFAULT_STATE.name,

            energy: this.normalizeNumber(
                savedState.energy,
                DEFAULT_STATE.energy,
                0,
                100
            ),

            happiness: this.normalizeNumber(
                savedState.happiness,
                DEFAULT_STATE.happiness,
                0,
                100
            ),

            mood: this.isValidMood(savedState.mood)
                ? savedState.mood
                : DEFAULT_STATE.mood,

            exp: this.normalizeNumber(
                savedState.exp,
                DEFAULT_STATE.exp,
                0,
                99
            ),

            level: this.normalizeNumber(
                savedState.level,
                DEFAULT_STATE.level,
                1,
                Number.MAX_SAFE_INTEGER
            ),

            message:
                typeof savedState.message === "string"
                    ? savedState.message
                    : DEFAULT_STATE.message,

            lastUpdatedAt: this.normalizeNumber(
                savedState.lastUpdatedAt,
                Date.now(),
                0,
                Date.now()
            )
        };
    }

    // ======================================
    // VALIDATE DATA
    // ======================================

    private normalizeNumber(
        value: unknown,
        fallback: number,
        min: number,
        max: number
    ): number {
        if (
            typeof value !== "number" ||
            !Number.isFinite(value)
        ) {
            return fallback;
        }

        return Math.max(min, Math.min(max, value));
    }

    private isValidMood(
        mood: unknown
    ): mood is PetMood {
        return (
            mood === "happy" ||
            mood === "neutral" ||
            mood === "tired" ||
            mood === "sleeping"
        );
    }

    // ======================================
    // SAVE STATE
    // ======================================

    private saveState(): void {
        this.state.lastUpdatedAt = Date.now();

        void this.storage.update(
            STORAGE_KEY,
            this.state
        ).then(
            () => {
                console.log(
                    "[CodePet] State saved successfully."
                );
            },
            (error: unknown) => {
                console.error(
                    "[CodePet] Failed to save state:",
                    error
                );
            }
        );
    }

    // ======================================
    // OFFLINE TIME SIMULATION
    // ======================================

    private applyOfflineDecay(): void {
        const currentTime = Date.now();

        const elapsedTime =
            currentTime - this.state.lastUpdatedAt;

        const elapsedTicks = Math.floor(
            elapsedTime / PASSIVE_INTERVAL
        );

        if (elapsedTicks <= 0) {
            return;
        }

        const ticks = Math.min(
            elapsedTicks,
            MAX_OFFLINE_TICKS
        );

        console.log(
            `[CodePet] Offline duration: ${ticks} ticks`
        );

        for (let i = 0; i < ticks; i++) {
            this.state = {
                ...PetBehavior.passiveTick(this.state),
                lastUpdatedAt: this.state.lastUpdatedAt
            };
        }

        // Simpan waktu terbaru setelah simulasi
        this.saveState();

        console.log(
            "[CodePet] Offline simulation completed:",
            this.state
        );
    }

    // ======================================
    // GET STATE
    // ======================================

    getState(): PetState {
        return { ...this.state };
    }

    // ======================================
    // PERFORM PET ACTION
    // ======================================

    performAction(action: PetAction): PetState {
        this.state = {
            ...PetBehavior.performAction(
                this.state,
                action
            ),
            lastUpdatedAt: this.state.lastUpdatedAt
        };

        this.saveState();

        return this.getState();
    }

    // ======================================
    // PET ACTION METHODS
    // ======================================

    interact(): PetState {
        return this.performAction("interact");
    }

    feed(): PetState {
        return this.performAction("feed");
    }

    sleep(): PetState {
        return this.performAction("sleep");
    }

    play(): PetState {
        return this.performAction("play");
    }

    // ======================================
    // PASSIVE BEHAVIOR
    // ======================================

    passiveTick(): PetState {
        this.state = {
            ...PetBehavior.passiveTick(this.state),
            lastUpdatedAt: this.state.lastUpdatedAt
        };

        this.saveState();

        return this.getState();
    }
}
