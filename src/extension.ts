// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import EditorObserver from './editor';
import cp = require('child_process');
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

var path = require("path");
var player = require('play-sound')({});

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json

var audioPlayer, controller;

export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    window.showInformationMessage('Congratulations, your extension "mktype" is now active!');
    
    audioPlayer = audioPlayer || new AudioPlay();
    controller = controller || new EditorObserver(audioPlayer);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
}

export class AudioPlay {
    private keyboard: number = 8;
    private _playExe_path:string = path.join(__dirname, '..', '..', 'audio', 'play.exe');    
    private _keypress_path:string = path.join(__dirname, '..', '..', 'audio', 'mk' + this.keyboard + '.mp3');
    private _isWindows:boolean;
    
    public playKeystroke (keyboard: number = 5, volume: number = 7) {
        this._keypress_path = path.join(__dirname, '..', '..', 'audio', 'mk' + keyboard + '.mp3');
        if (this._isWindows) {
            cp.execFile(this._playExe_path, [this._keypress_path]);
        } else {
            player.play(this._keypress_path, { 
                afplay: ['-v', volume + this.random(1, 10), '-r', this.random(9, 11)/10 ], 
                mplayer: ['-volume', (volume * 10) + this.random(10, 30), '-speed', this.random(9, 10)/10], 
            });
        }
    }

    private random(min: number, max: number) {
        const value = Math.round((Math.random() * (max - min)) + min)
        return value
    }
    
    constructor(){
        this._isWindows = (process.platform === 'win32');
    }
}