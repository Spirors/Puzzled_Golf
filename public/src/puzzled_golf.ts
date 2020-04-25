import * as Phaser from 'phaser';

var config = {
    width: 100,
    height: 100,
    type: Phaser.AUTO,
    backgroundColor: 0x000000,
    scene: [],
    preload: preload,
    create: create,
    update: update
}

var game = new Phaser.Game(config);

function preload() {}
function create() {}
function update() {}