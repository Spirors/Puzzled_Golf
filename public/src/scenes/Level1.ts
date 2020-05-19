import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';
import { Ball } from '../objects/ball';
import { MovingBlock } from '../objects/MovingBlock';

export class Level1 extends Phaser.Scene{
    private ball;
    private hole;

    private moving_block;
    private boolWin;
    private menu;

    constructor(){
        super("level1");
    }
    init(){
        this.boolWin = false;
    }
    preload(){
        // Todo: Fix preloading
        this.load.image("bkgrnd1", "./assets/level1_background.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd1").setOrigin(0,0).setScale(1.37);
        this.physics.world.setFPS(120);
        console.log(this.scene.manager.keys);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        console.log(this.scene.manager.keys);
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 1});
        this.createWindow(Hud, "hud", 0, 0, {level : 1});
        console.log(this.scene.manager.keys);
        this.scene.setVisible(false, "inGameMenu");
        this.events.emit('setLevel');
        this.menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 3);
        this.menu.setInteractive();
        this.setHighLight(this.menu);
        this.menu.on('pointerup', function () {
            this.menu.setTint( 1 * 0xffffff);
            this.scene.pause();
            this.scene.resume("inGameMenu");
            this.scene.setVisible(true, "inGameMenu") ;
        }, this)
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map1' });
        var tileset = map.addTilesetImage('golf_course', 'tiles');
        var bgLayer = map.createStaticLayer('background', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create ball
        this.ball = new Ball({
            scene : this,
            x : this.scale.width - 1000, //x coordnate of ball
            y : this.scale.height - 600 //y coordnate of ball
        });
        this.physics.add.collider(this.ball, borderLayer);
        //--------------------------------------------------------------------------------
        //create hole
        var holeLayer = map.getObjectLayer('hole')['objects'];
        this.hole = this.physics.add.staticGroup();
        holeLayer.forEach(object => {
            let obj = this.hole.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        this.children.bringToTop(this.ball);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        //--------------------------------------------------------------------------------
        //create moving block
        this.moving_block = new MovingBlock({
            scene : this,
            x : this.scale.width - 550, //x coordnate of moving_block
            y : this.scale.height - 255 //y coordnate of moving_block
        });
        this.physics.add.collider(this.ball, this.moving_block);
    }

    update() {
        this.ball.update();
        this.moving_block.update();
    }

    createWindow(func, name, x, y, data){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true, data);
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff99);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }

    checkWin(){
        let velocityX = this.ball.getVelocityX();
        let velocityY = this.ball.getVelocityY();
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (velocity <= 150) {
            if(this.boolWin == false){
                this.boolWin = true;
                this.win();
            }
        }
    }
    win() {
        this.menu.removeInteractive();
        this.scene.pause();
        this.events.emit('levelWin');
    }
}