import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';
import { Ball } from '../objects/ball';
import { MovingBlock } from '../objects/MovingBlock';
import { NONE } from 'phaser';
import { winScreen } from './WinScreen';

export class nextLevel extends Phaser.Scene{
    private menu;
    private level;

    constructor(){
        super("next");
    }
    init(data){
        this.level = data.id;
    }
    preload(){
        // Todo: Fix preloading
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.physics.world.setFPS(120);

        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        let highScore = this.add.text(0, 0, 'THIS LEVEL IS WIP ', { font: '48px Arial', fill: '#ffffff' });
        highScore.setPosition(this.game.renderer.width/2 - highScore.width/2, this.game.renderer.height/2 - highScore.height/2);
        this.scene.setVisible(false, "inGameMenu");
        this.events.emit('setLevel');
        this.menu = this.add.sprite(this.game.renderer.width, 30, 'button', 2);
        this.menu.setPosition(this.game.renderer.width/2, this.game.renderer.height/2 - this.menu.height/2 + 60);
        this.menu.setInteractive();
        this.setHighLight(this.menu);
        this.menu.on('pointerup', function () {
            //go main menu
            this.scene.start("mainMenu");
        }, this)
    }

    createWindow(func, name, x, y, data){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        if(data == NONE){
            this.scene.add(name, window, true);
        }else{
            this.scene.add(name, window, true, data);
        }
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff99);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }
}