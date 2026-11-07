
import * as vscode from "vscode";

export class CodingActivityTracker implements vscode.Disposable {
    private readonly output: vscode.OutputChannel;
    private readonly subscriptions: vscode.Disposable[] = [];

    private readonly lastEditTime = new Map<string, number>();

    private readonly editCooldown = 30 * 1000;

    constructor() {
        this.output = vscode.window.createOutputChannel(
            "CodePet Coding Activity"
        );

        this.subscriptions.push(
            this.output
        );

        this.registerEvents();

        this.output.appendLine(
            "[CodePet] Coding Activity Tracker initialized."
        );
    }

    // ======================================
    // REGISTER VS CODE EVENTS
    // ======================================

    private registerEvents(): void {

        // Detect active editor
        this.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(
                (editor) => {
                    if (editor) {
                        this.detectFileOpened(
                            editor.document
                        );
                    }
                }
            )
        );

        // Detect document changes
        this.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(
                (event) => {
                    this.detectCodeChanges(
                        event.document
                    );
                }
            )
        );

        // Detect file save
        this.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument(
                (document) => {
                    this.detectFileSaved(document);
                }
            )
        );

        // Detect document closed
        this.subscriptions.push(
            vscode.workspace.onDidCloseTextDocument(
                (document) => {
                    this.output.appendLine(
                        `[CLOSED] ${document.fileName}`
                    );

                    this.lastEditTime.delete(
                        document.uri.toString()
                    );
                }
            )
        );

        // Detect currently active file
        const activeEditor =
            vscode.window.activeTextEditor;

        if (activeEditor) {
            this.detectFileOpened(
                activeEditor.document
            );
        }
    }

    // ======================================
    // FILE OPENED
    // ======================================

    private detectFileOpened(
        document: vscode.TextDocument
    ): void {
        if (!this.isTrackable(document)) {
            return;
        }

        this.output.appendLine(
            `[OPENED] File: ${document.fileName}`
        );

        this.output.appendLine(
            `[LANGUAGE] ${document.languageId}`
        );
    }

    // ======================================
    // CODE CHANGES
    // ======================================

    private detectCodeChanges(
        document: vscode.TextDocument
    ): void {
        if (!this.isTrackable(document)) {
            return;
        }

        const documentId =
            document.uri.toString();

        const currentTime = Date.now();

        const previousTime =
            this.lastEditTime.get(documentId) ?? 0;

        if (
            currentTime - previousTime <
            this.editCooldown
        ) {
            return;
        }

        this.lastEditTime.set(
            documentId,
            currentTime
        );

        this.output.appendLine(
            `[EDITED] File: ${document.fileName}`
        );

        this.output.appendLine(
            `[LANGUAGE] ${document.languageId}`
        );
    }

    // ======================================
    // FILE SAVED
    // ======================================

    private detectFileSaved(
        document: vscode.TextDocument
    ): void {
        if (!this.isTrackable(document)) {
            return;
        }

        this.output.appendLine(
            `[SAVED] File: ${document.fileName}`
        );

        this.output.appendLine(
            `[LANGUAGE] ${document.languageId}`
        );
    }

    // ======================================
    // DOCUMENT VALIDATION
    // ======================================

    private isTrackable(
        document: vscode.TextDocument
    ): boolean {

        // Ignore non-file documents
        if (document.uri.scheme !== "file") {
            return false;
        }

        // Ignore plaintext documents
        if (document.languageId === "plaintext") {
            return false;
        }

        return true;
    }

    // ======================================
    // DISPOSE
    // ======================================

    dispose(): void {
        for (const subscription of this.subscriptions) {
            subscription.dispose();
        }

        this.lastEditTime.clear();

        this.output.dispose();
    }
}
