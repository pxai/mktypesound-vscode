import {window, workspace, commands, Disposable, ExtensionContext, TextDocument} from 'vscode';
import * as vscode from 'vscode';
import {AudioPlay} from './extension';

export default class EditorObserver {
    private _disposable: Disposable;
    private _audioplayer: AudioPlay;
    private _lastText : any;
    private _lastLine: number;
    private _active: boolean = true;
    private _keyboardId: number = 0;
    
    constructor(audioplayer: AudioPlay) {
        this._audioplayer = audioplayer;

        this._getLatestConfig();
        //console.log("See option: sound ", this._active, this._keyboardId)

        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        workspace.onDidChangeTextDocument(this._onEvent, this, subscriptions)
        this._disposable = Disposable.from(...subscriptions);
    }

    private _getLatestConfig() {
        this._active = Boolean(vscode.workspace.getConfiguration('mktypesound').get('enable'));
        this._keyboardId = Number(vscode.workspace.getConfiguration('mktypesound').get('sound'));
    }
    
    private _hasTextChanged(e: vscode.TextEditorSelectionChangeEvent) {
        let currentText = e.textEditor.document.getText();
        let hasChangd = (currentText !== this._lastText);
        this._lastText = currentText;
        
        return hasChangd;
    }
    
    private _onEvent(e: any) {
        //if (!this._hasTextChanged(e)) return; 
        this._getLatestConfig();
        if (this._active)
            this._audioplayer.playKeystroke(this._keyboardId);
    }
}