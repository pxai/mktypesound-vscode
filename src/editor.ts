import {window, workspace, commands, Disposable, ExtensionContext, TextDocument} from 'vscode';
import * as vscode from 'vscode';
import {AudioPlay} from './extension';

export default class EditorObserver {
    private _disposable: Disposable;
    private _audioplayer: AudioPlay;
    private _active: boolean = true;
    private _keyboardId: number = 0;
    
    constructor(audioplayer: AudioPlay) {
        this._audioplayer = audioplayer;

        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        workspace.onDidChangeTextDocument(this._onEvent, this, subscriptions)
        this._disposable = Disposable.from(...subscriptions);
    }

    private _getLatestConfig() {
        this._active = Boolean(vscode.workspace.getConfiguration('mktypesound').get('enable'));
        this._keyboardId = Number(vscode.workspace.getConfiguration('mktypesound').get('sound'));
    }
    
    private _onEvent(e: any) {
        this._getLatestConfig();
        if (this._active)
            this._audioplayer.playKeystroke(this._keyboardId);
    }
}