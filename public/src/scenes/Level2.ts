import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';
import { Ball } from '../objects/ball';
import { Door } from '../objects/Door';
import { NONE } from 'phaser';

export class Level2 extends Phaser.Scene{
    private ball;
    private hole;
    private holeX;
    private holeY;
    private holeR;

    private door;

    private plate;
    private plateX;
    private plateY;
    private plateR;

    private waterLayer;
    private boolWin;
    private menu;

    private boolPressed;

    constructor(){
        super("level2");
    }
    init(){
        this.boolWin = false;
        this.boolPressed = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map2', './assets/level2.json');
        this.load.image('plate', "./assets/plate.png");
        this.load.image('door', "./assets/moving_block.png");
        this.load.image('water', "./assets/water.png");

        this.load.image("bkgrnd2", "./assets/level2_background.png");
    }
    create(){
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd2").setOrigin(0,0).setScale(1.37);
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.physics.world.setFPS(120);

        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        // console.log(this.scene.manager.keys);
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 2});
        this.createWindow(Hud, "hud", 0, 0, {level : 2});
        console.log(this.scene.manager.keys);
        this.scene.setVisible(false, "inGameMenu") ;
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
        var map = this.make.tilemap({ key: 'map2' });
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
            x : this.scale.width - 600, //x coordnate of ball
            y : this.scale.height - 400 //y coordnate of ball
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

        // Overlap of ball and hole
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        //--------------------------------------------------------------------------------
        // create plate
        var plateLayer = map.getObjectLayer('plate')['objects'];
        this.plate = this.physics.add.staticGroup();
        plateLayer.forEach(object => {
            // console.log(object.x,object.y);
            this.plateX = mapX + object.x;
            this.plateY = mapY + object.y;
            this.plateR = object.width/2;
            let obj = this.plate.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "plate"); 
            
        });

        // Overlap of ball and plate
        this.physics.add.overlap(this.ball, this.plate, this.checkPressed, null, this);

        var waterLayer = map.getObjectLayer('water')['objects'];
        this.waterLayer = this.physics.add.staticGroup();
        waterLayer.forEach(object => {
            // console.log(object.x,object.y);
            // this.holeX = mapX + object.x;
            // this.holeY = mapY + object.y
            // this.holeR = object.width/2;
            let obj = this.waterLayer.create(mapX + object.x + 32 - object.width/2, mapY + object.y - object.height/2, "water");
        });

        // Overlap of ball and water
        this.physics.add.overlap(this.ball, this.waterLayer, this.inwater, null, this);

        this.children.bringToTop(this.ball);

        this.door = new Door({
            scene : this,
            x : this.scale.width - 556, //x coordnate of moving_block
            y : this.scale.height - 400 //y coordnate of moving_block
        });
        this.physics.add.collider(this.ball, this.door);
    }

    update() {
        this.ball.update();
        this.door.update();
        // this.checkPressed();
        // this.checkWater();
        // this.checkWin();
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

    checkWin(){
        let velocityX = this.ball.getVelocityX();
        let velocityY = this.ball.getVelocityY();
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (velocity <= 150) {
            if(this.boolWin == false){
                this.boolWin = true;
                this.win();
            }
            // let ballX = this.ball.getX();
            // let ballY = this.ball.getY();
            // // console.log(this.holeX - this.holeR, ballX, this.holeX + this.holeR);
            // // console.log(this.holeY - this.holeR, ballY, this.holeY + this.holeR);
            // if (ballX >= this.holeX - this.holeR && ballX <= this.holeX + this.holeR &&
            //     ballY >= this.holeY - this.holeR && ballY <= this.holeY + this.holeR) {
            //     // console.log(velocity);
            //     if(this.boolWin == false){
            //         this.boolWin = true;
            //         this.win();
            //     }
            // }
        }
    }
    win() {
        console.log("win");
        this.menu.removeInteractive();
        this.scene.pause();
        this.events.emit('levelWin');
    }

    checkPressed() {
        if (this.boolPressed == false) {
            this.boolPressed = true;
            this.pressed();
        }
        // let ballX = this.ball.getX();
        // let ballY = this.ball.getY();
        // let ballR = this.ball.getR();
        // // console.log(ballX - ballR, ballY - ballR, ballR);
        // // console.log(this.plateX - this.plateR, ballX, this.plateX + this.plateR);
        // // console.log(this.plateY - this.plateR, ballY, this.plateY + this.plateR);

        // if (ballX >= this.plateX - this.plateR && ballX <= this.plateX + this.plateR &&
        //     ballY >= this.plateY - this.plateR && ballY <= this.plateY + this.plateR) {
        //     this.pressed();
        // }
    }
    pressed() {
        this.door.setOpen();
    }
    inwater() {
        this.ball.moveBack();
    }
}