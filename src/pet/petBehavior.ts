
export interface PetBehaviorState {
    name: string;
    energy: number;
    happiness: number;
    mood: "happy" | "neutral" | "tired" | "sleeping";
    exp: number;
    level: number;
    message: string;
}

export type PetAction =
    | "interact"
    | "feed"
    | "sleep"
    | "play";

export class PetBehavior {

    // ======================================
    // RANDOM MESSAGE
    // ======================================

    private static randomMessage(
        messages: string[]
    ): string {
        const index = Math.floor(
            Math.random() * messages.length
        );

        return messages[index];
    }

    // ======================================
    // LIMIT STATISTICS
    // ======================================

    private static clamp(
        value: number,
        min = 0,
        max = 100
    ): number {
        return Math.max(
            min,
            Math.min(max, value)
        );
    }

    // ======================================
    // UPDATE MOOD
    // ======================================

    private static updateMood(
        state: PetBehaviorState,
        customMessage?: string
    ): PetBehaviorState {

        let mood: PetBehaviorState["mood"];
        let defaultMessage: string;

        if (state.energy <= 0) {
            mood = "sleeping";

            defaultMessage = "Zzz... I need some rest.";
        } else if (state.energy <= 20) {
            mood = "tired";

            defaultMessage = "I'm getting tired...";
        } else if (state.happiness <= 25) {
            mood = "neutral";

            defaultMessage = "I feel a little lonely...";
        } else if (
            state.energy <= 60 ||
            state.happiness <= 50
        ) {
            mood = "neutral";

            defaultMessage = "Let's take it easy.";
        } else {
            mood = "happy";

            defaultMessage = "I'm happy to be here!";
        }

        return {
            ...state,
            mood,
            message: customMessage ?? defaultMessage
        };
    }

    // ======================================
    // EXPERIENCE SYSTEM
    // ======================================

    private static addExp(
        state: PetBehaviorState,
        amount: number
    ): PetBehaviorState {

        let exp = state.exp + amount;
        let level = state.level;
        let leveledUp = false;

        while (exp >= 100) {
            exp -= 100;
            level++;
            leveledUp = true;
        }

        return {
            ...state,
            exp,
            level,
            message: leveledUp
                ? `Amazing! I reached Level ${level}!`
                : state.message
        };
    }

    // ======================================
    // PERFORM PET ACTION
    // ======================================

    static performAction(
        state: PetBehaviorState,
        action: PetAction
    ): PetBehaviorState {

        let updatedState = { ...state };
        let message = "";

        switch (action) {

            // ----------------------------------
            // INTERACT
            // ----------------------------------

            case "interact": {
                updatedState.energy -= 2;
                updatedState.happiness += 2;

                updatedState = this.addExp(
                    updatedState,
                    10
                );

                message = this.randomMessage([
                    "Hello! Nice to see you!",
                    "Are we coding today?",
                    "I enjoy spending time with you!",
                    "Let's build something amazing!",
                    "Hey! Don't forget to take breaks!"
                ]);

                break;
            }

            // ----------------------------------
            // FEED
            // ----------------------------------

            case "feed": {
                updatedState.energy += 20;
                updatedState.happiness += 5;

                message = this.randomMessage([
                    "Yummy! Thank you!",
                    "That was delicious!",
                    "I feel energized now!",
                    "Can I have another snack?",
                    "Food makes me happy!"
                ]);

                break;
            }

            // ----------------------------------
            // SLEEP
            // ----------------------------------

            case "sleep": {
                updatedState.energy += 25;
                updatedState.happiness += 8;

                message = this.randomMessage([
                    "That was a refreshing nap!",
                    "I feel much better now!",
                    "Ready for another coding session!",
                    "Rest is important!",
                    "Thank you for letting me rest!"
                ]);

                break;
            }

            // ----------------------------------
            // PLAY
            // ----------------------------------

            case "play": {

                if (updatedState.energy < 15) {
                    return {
                        ...updatedState,
                        message: "I'm too tired to play. Let me rest first."
                    };
                }

                updatedState.energy -= 15;
                updatedState.happiness += 15;

                updatedState = this.addExp(
                    updatedState,
                    15
                );

                message = this.randomMessage([
                    "That was so much fun!",
                    "Let's play again!",
                    "I love playing with you!",
                    "What a great activity!",
                    "You're a great companion!"
                ]);

                break;
            }
        }

        // ======================================
        // APPLY STATISTIC LIMITS
        // ======================================

        updatedState.energy = this.clamp(
            updatedState.energy
        );

        updatedState.happiness = this.clamp(
            updatedState.happiness
        );

        // ======================================
        // UPDATE MOOD AND MESSAGE
        // ======================================

        return this.updateMood(
            updatedState,
            message
        );
    }

    // ======================================
    // PASSIVE BEHAVIOR
    // ======================================

    static passiveTick(
        state: PetBehaviorState
    ): PetBehaviorState {

        const updatedState = {
            ...state,
            energy: this.clamp(state.energy - 1),
            happiness: this.clamp(state.happiness - 1)
        };

        return this.updateMood(
            updatedState,
            this.getPassiveMessage(updatedState)
        );
    }

    // ======================================
    // PASSIVE MESSAGES
    // ======================================

    private static getPassiveMessage(
        state: PetBehaviorState
    ): string {

        if (state.energy <= 0) {
            return "Zzz... I'm completely exhausted.";
        }

        if (state.energy <= 20) {
            return "I need some energy...";
        }

        if (state.happiness <= 25) {
            return "I miss spending time with you.";
        }

        if (state.happiness <= 50) {
            return "I hope we can play together soon.";
        }

        return this.randomMessage([
            "I'm waiting for you...",
            "What are we going to build today?",
            "I wonder what you're coding.",
            "Don't forget to save your work!",
            "Take a short break when you need one."
        ]);
    }
}
