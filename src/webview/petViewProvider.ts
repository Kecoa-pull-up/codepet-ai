
import * as vscode from "vscode";
import * as fs from "fs";

import { PetStateManager } from "../pet/petState";
import { PetMessageHandler } from "../pet/petMessageHandler";

export class PetViewProvider
    implements vscode.WebviewViewProvider {

    public static readonly viewType = "codepet.sidebar";

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly stateManager: PetStateManager
    ) {}

    resolveWebviewView(
        webviewView: vscode.WebviewView
    ): void {

        console.log(
            "[CodePet] Webview initialized!"
        );

        const webview = webviewView.webview;

        const uiDirectory = vscode.Uri.joinPath(
            this.extensionUri,
            "src",
            "webview",
            "ui"
        );

        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(
                    this.extensionUri,
                        "src",
                        "webview",
                        "ui"
                )
            ]
        };

        const htmlPath = vscode.Uri.joinPath(
            uiDirectory,
            "pet.html"
        );

        const cssPath = vscode.Uri.joinPath(
            uiDirectory,
            "style.css"
        );

        const jsPath = vscode.Uri.joinPath(
            uiDirectory,
            "pet.js"
        );

        try {

            const html = fs.readFileSync(
                htmlPath.fsPath,
                "utf8"
            );

            const styleUri = webview.asWebviewUri(
                cssPath
            );
            

            const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this.extensionUri,
                "src",
                "webview",
                "ui",
                "pet.js"
            )
            );

            webview.html = html
                .replace(
                    /\{\{CSP_SOURCE\}\}/g,
                    webview.cspSource
                )
                .replace(
                    "{{STYLE_URI}}",
                    styleUri.toString()
                )
                .replace(
                    "{{SCRIPT_URI}}",
                    scriptUri.toString()
                );

            // Mendaftarkan komunikasi Webview
            const messageHandler =
                new PetMessageHandler(
                    this.stateManager
                );

            const messageSubscription =
                messageHandler.register(webview);

            
// Passive behavior timer
const passiveTimer = setInterval(() => {

    const updatedState = this.stateManager.passiveTick();

    webview.postMessage({
        type: "pet:update",
        state: updatedState
    });

    console.log(
        "[CodePet] Passive behavior:",
        updatedState
    );

}, 5 * 60 * 1000);

// Membersihkan listener dan timer
webviewView.onDidDispose(() => {
    messageSubscription.dispose();
    clearInterval(passiveTimer);
});


            webviewView.onDidDispose(() => {
                messageSubscription.dispose();
            });

            console.log(
                "[CodePet] Interface successfully loaded!"
            );

        } catch (error) {

            console.error(
                "[CodePet] Webview error:",
                error
            );

            webview.html = `
                <!DOCTYPE html>
                <html>
                <body>
                    <h2>CodePet AI</h2>
                    <p>Failed to load interface.</p>
                    <p>Check Extension Host logs.</p>
                </body>
                </html>
            `;
        }
    }
}
