import {window, workspace, commands, Disposable, ExtensionContext, TextDocument} from 'vscode';
import * as vscode from 'vscode';
import {AudioPlay} from './extension';

export default class EditorObserver {
    private _disposable: Disposable;
    private _audioplayer: AudioPlay;
    private _active: boolean = true;
    private _keyboardId: number = 0;
    private _volume: number = 7;
    
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
        this._volume = Number(vscode.workspace.getConfiguration('mktypesound').get('volume'));
    }
    
    private _onEvent(e: any) {
        this._getLatestConfig();
        if (this._active && this._volume > 0)
            this._audioplayer.playKeystroke(this._keyboardId, this._volume);
    }
}