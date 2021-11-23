// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "markdowntable" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json

    function registerCommandNice(commandId: string, run: (...args: any[]) => void): void {
        let command = vscode.commands.registerCommand(commandId, run);
        context.subscriptions.push(command);
    }

    registerCommandNice('spacetab.convert', () => {
        // エディタ取得
        const editor = vscode.window.activeTextEditor as vscode.TextEditor;
        // ドキュメント取得
        const doc = editor.document;
        // ドキュメント全てを取得する
        const all_selection = new vscode.Selection(
            new vscode.Position(0, 0),
            new vscode.Position(doc.lineCount - 1, 10000));

        let tabSize = editor.options.tabSize as number;
        editor.edit(edit => {
            for (let i = 0; i < doc.lineCount; i++) {
                let reString = `.{1,${tabSize}}`;
                let re = new RegExp(reString, 'g');
                let text = doc.lineAt(i).text;
                let textSplit = text.match(re);
                let textNew = "";

                while (textSplit !== null && textSplit.length > 0) {
                    let chars = textSplit.shift();
                    if (chars !== undefined) {
                        let charsTrim = chars.trim();
                        if (charsTrim.length < chars.length) {
                            if (charsTrim === "") {
                                textNew += "\t";
                            } else if (chars[0] === " ") {
                                textNew += charsTrim;
                            } else if (chars[3] === " ") {
                                textNew += charsTrim + '\t';
                            }
                        } else {
                            textNew += chars;
                        }
                    }
                }

                let selection = new vscode.Selection(new vscode.Position(i, 0), new vscode.Position(i, 10000));
                edit.replace(selection, textNew);
            }
        });
    });
}

// this method is called when your extension is deactivated
export function deactivate() { }
