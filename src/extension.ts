
import * as vscode from "vscode";

import { PetStateManager } from "./pet/petState";

import { PetViewProvider } from "./webview/petViewProvider";

import { CodingActivityTracker } from "./pet/codingActivity";

// ==========================================
// EXTENSION ACTIVATION
// ==========================================

export function activate(
    context: vscode.ExtensionContext
): void {

    console.log("[CodePet] Extension activated.");

    // ======================================
    // PET STATE MANAGER
    // ======================================

    const petStateManager = new PetStateManager(
        context.globalState
    );

    // ======================================
    // CODING ACTIVITY TRACKER
    // ======================================

    const codingActivityTracker =
        new CodingActivityTracker();

    context.subscriptions.push(
        codingActivityTracker
    );

    // ======================================
    // PET WEBVIEW PROVIDER
    // ======================================

    const petProvider = new PetViewProvider(
        context.extensionUri,
        petStateManager
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "codepet.sidebar",
            petProvider
        )
    );

    console.log(
        "[CodePet] All systems initialized."
    );
}

// ==========================================
// EXTENSION DEACTIVATION
// ==========================================

export function deactivate(): void {
    console.log("[CodePet] Extension deactivated.");
}
