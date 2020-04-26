import { Hud } from './Hud';
import { HelpMenu } from './HelpMenu';

export class Level1 extends Phaser.Scene{
    constructor(){
        super("level1");
    }
    init(){

    }
    preload(){

    }
    create(){
        console.log("LEVEL1");
        this.createWindow(Hud, "hud", 0, 0);
        this.events.emit('setLevel');
        this.input.on('pointerdown', this.clickHandler, this);
        var menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 1);
        menu.setInteractive();
        menu.on('pointerup', function () {
            this.createWindow(HelpMenu,"help",this.game.renderer.width/2, this.game.renderer.height/2);
        }, this);
    }
    clickHandler (pointer)
    {
        console.log("click");
        this.events.emit('addScore');
    }
    createWindow(func, name, x, y){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true);
    }
}