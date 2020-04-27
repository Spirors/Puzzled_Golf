import * as Phaser from 'phaser';
import {SplashScreen} from './scenes/SplashScreen';
import {MainMenu} from './scenes/MainMenu';
import { Level1 } from './scenes/Level1';
import { Hud } from './scenes/Hud';

var config = {
    width: 1400,
    height: 800,
    type: Phaser.AUTO,
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
    backgroundColor: 0x000000,
    scene: [SplashScreen, MainMenu, Level1, Hud],
    preload: preload,
    create: create,
    update: update
}

var game = new Phaser.Game(config);

function preload() {}
function create() {}
function update() {}