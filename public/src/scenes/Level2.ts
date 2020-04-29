import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';
import { Ball } from '../objects/ball';
import { MovingBlock } from '../objects/MovingBlock';
import { NONE } from 'phaser';

export class Level2 extends Phaser.Scene{
    private ball;
    private hole;
    private plate;
    private holeX;
    private holeY;
    private holeR;

    private moving_block;

    constructor(){
        super("level2");
    }
    init(){

    }
    preload(){
        this.load.tilemapTiledJSON('map2', '../dist/assets/level2.json');
        this.load.image('plate', "../dist/assets/plate.png");
        // this.load.image('moving_block', "../dist/assets/moving_block.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.physics.world.setFPS(120);

        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 2});
        this.createWindow(Hud, "hud", 0, 0, {level : 2});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        var menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 3);
        menu.setInteractive();
        this.setHighLight(menu);
        menu.on('pointerup', function () {
            menu.setTint( 1 * 0xffffff);
            this.scene.pause();
            this.scene.resume("inGameMenu");
            this.scene.setVisible(true, "inGameMenu") ;
        }, this)
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map2' });
        var tileset = map.addTilesetImage('golf_course', 'tiles');
        var bgLayer = map.createStaticLayer('background', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
        var waterLayer = map.createStaticLayer('water', tileset, 0, 0);
        waterLayer.setPosition(mapX, mapY);
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
            console.log(object.x,object.y);
            this.holeX = mapX + object.x;
            this.holeY = mapY + object.y
            this.holeR = object.width/2;
            let obj = this.hole.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        this.children.bringToTop(this.ball);
        //--------------------------------------------------------------------------------
        // create plate
        var plateLayer = map.getObjectLayer('plate')['objects'];
        this.plate = this.physics.add.staticGroup();
        plateLayer.forEach(object => {
            // console.log(object.x,object.y);
            // this.holeX = mapX + object.x;
            // this.holeY = mapY + object.y
            // this.holeR = object.width/2;
            let obj = this.plate.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "plate"); 
        });
        this.children.bringToTop(this.ball);
    }

    update() {
        this.ball.update();
        // this.moving_block.update();

        this.gameWin();
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
            obj.setTint( 1 * 0xffff66);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }

    gameWin(){
        let velocityX = this.ball.getVelocityX();
        let velocityY = this.ball.getVelocityY();
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (velocity <= 250) {
            let ballX = this.ball.getX();
            let ballY = this.ball.getY();
            // console.log(this.holeX - this.holeR, ballX, this.holeX + this.holeR)
            // console.log(this.holeY - this.holeR, ballY, this.holeY + this.holeR)
            if (ballX >= this.holeX - this.holeR && ballX <= this.holeX + this.holeR &&
                ballY >= this.holeY - this.holeR && ballY <= this.holeY + this.holeR) {
                console.log("win");
                this.events.emit('levelWin');
            }
        }
    }
}