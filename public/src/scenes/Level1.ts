import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';
import { Ball } from '../objects/ball';

export class Level1 extends Phaser.Scene{
    private ball;

    constructor(){
        super("level1");
    }
    init(){

    }
    preload(){
        this.load.image('hole', "../dist/assets/golf_hole.png");
        this.load.image('tiles', '../dist/assets/tileset.png');
        this.load.tilemapTiledJSON('map', '../dist/assets/level1.json');
        this.load.image('ball', '../dist/assets/ball.png');
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
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
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('golf_course', 'tiles');
        var platforms = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
        platforms.setScale(platforms.scale/2);
        platforms.setPosition(this.game.renderer.width/2 - ((platforms.width * platforms.scale)/2), this.game.renderer.height/2 - ((platforms.height * platforms.scale)/2));
        //width 1920 heihgt 1280

        this.ball = new Ball({
            scene : this,
            x : this.scale.width - 900, //x coordnate of ball
            y : this.scale.height - 600 //y coordnate of ball
        });
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