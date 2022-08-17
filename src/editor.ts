import {window, workspace, commands, Disposable, ExtensionContext, TextDocument} from 'vscode';
import * as vscode from 'vscode';
import {AudioPlay} from './extension';

export default class EditorObserver {
    private _disposable: Disposable;
    private _audioplayer: AudioPlay;
    private _lastText : any;
    private _lastLine: number;
    
    constructor(audioplayer: AudioPlay) {
        this._audioplayer = audioplayer;
        
        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        this._disposable = Disposable.from(...subscriptions);
    }
    
    private _getLetterCount(doc: TextDocument): number {
        return doc.getText().split("").length;
    }
    
    private _hasTextChanged(e: vscode.TextEditorSelectionChangeEvent) {
        let currentText = e.textEditor.document.getText();
        let hasChangd = (currentText !== this._lastText);
        this._lastText = currentText;
        
        return hasChangd;
    }
    
    private _onEvent(e: any) {
        if (!this._hasTextChanged(e)) return; 

        this._audioplayer.playKeystroke();
    }
}