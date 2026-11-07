
import * as vscode from "vscode";
import { PetStateManager } from "./petState";

interface PetMessage {
    type: string;
}

export class PetMessageHandler {

    constructor(
        private readonly stateManager: PetStateManager
    ) {}

    register(
        webview: vscode.Webview
    ): vscode.Disposable {

        return webview.onDidReceiveMessage(
            async (message: PetMessage) => {

                let state;

                switch (message.type) {

                    case "pet:ready":
                        state = this.stateManager.getState();
                        break;

                    case "pet:interact":
                        state = this.stateManager.interact();
                        break;

                    case "pet:feed":
                        state = this.stateManager.feed();
                        break;

                    case "pet:sleep":
                        state = this.stateManager.sleep();
                        break;

                    case "pet:play":
                        state = this.stateManager.play();
                        break;

                    default:
                        console.warn(
                            "[CodePet] Unknown message:",
                            message.type
                        );
                        return;
                }

                await webview.postMessage({
                    type: "pet:update",
                    state
                });

                console.log(
                    "[CodePet] State updated:",
                    state
                );
            }
        );
    }
}
