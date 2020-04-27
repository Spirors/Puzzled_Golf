import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';

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
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2);
        this.createWindow(Hud, "hud", 0, 0);
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        this.input.on('pointerdown', this.clickHandler, this);
        var menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 3);
        menu.setInteractive();
        this.setHighLight(menu);
        menu.on('pointerup', function () {
            menu.setTint( 1 * 0xffffff);
            this.scene.pause();
            this.scene.setVisible(true, "inGameMenu") ;
        }, this)
    }

    clickHandler (pointer){
        this.events.emit('addScore');
    }

    createWindow(func, name, x, y){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true);
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff66);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }
}