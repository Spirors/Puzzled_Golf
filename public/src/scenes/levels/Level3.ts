import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { MovingBlock } from '../../objects/MovingBlock';

export class Level3 extends Phaser.Scene{
    private ball;
    private hole;    

    private moving_blocks = new Array();

    private boolWin;

    constructor(){
        super("level3");
    }
    init(){
        this.boolWin = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map3', './assets/map/level3.json');
        this.load.image("bkgrnd2", "./assets/background/level2_background.png");
        this.load.image('moving_block_3v', "./assets/obj/moving_block_3v.png");
        this.load.image('moving_block_3h', "./assets/obj/moving_block_3h.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd2").setOrigin(0,0).setScale(1.37);
        this.physics.world.setFPS(120);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 3});
        this.createWindow(Hud, "hud", 0, 0, {level : 3});
        console.log(this.scene.manager.keys);
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map3' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);

        //create water
        var waterLayer = map.createDynamicLayer('Water', tileset, 0, 0);
        waterLayer.setPosition(mapX, mapY);
        waterLayer.setTileIndexCallback([2,3,4,5,6,7,8,9,10], this.inwater, this);
        //-------------------------------------------------------------------------------
        //create ball
        var ballLayer = map.getObjectLayer('Ball')['objects'];
        ballLayer.forEach(object => {
            this.ball = new Ball({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2 //y coordnate of ball
            });
        });
        //--------------------------------------------------------------------------------
        //create hole
        var holeLayer = map.getObjectLayer('Hole')['objects'];
        this.hole = this.physics.add.staticGroup();
        holeLayer.forEach(object => {
            this.hole.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        //--------------------------------------------------------------------------------
        //create moving block
        var movingLayer = map.getObjectLayer('Moving1')['objects'];
        movingLayer.forEach(object => {
            var moving_block = new MovingBlock({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of moving_block
                y : mapY + object.y - object.height/2, //y coordnate of moving_block
                v : 150,
                start : 32,
                end : 96,
                verticle : false,
                name : 'moving_block_3h'
            });
            this.moving_blocks.push(moving_block);
        });

        var movingLayer = map.getObjectLayer('Moving2')['objects'];
        movingLayer.forEach(object => {
            var moving_block = new MovingBlock({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of moving_block
                y : mapY + object.y - object.height/2, //y coordnate of moving_block
                v : 150,
                start : 32,
                end : 32,
                verticle : true,
                name : 'moving_block_3v'
            });
            this.moving_blocks.push(moving_block);
        });

        // Add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, waterLayer);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        for(let moving_block of this.moving_blocks) {
            this.physics.add.collider(this.ball, moving_block);
        }
        this.children.bringToTop(this.ball);
    }

    update (time, delta) {
        this.ball.update();
        for(var i = 0; i < this.moving_blocks.length; i++) {
            this.moving_blocks[i].update();
        }
    }

    createWindow(func, name, x, y, data){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true, data);
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
        }
    }
    win() {
        console.log("win");
        this.scene.pause();
        this.events.emit('levelWin');
    }
    inwater() {
        this.ball.moveBack();
    }
}

//--------------------------------------------------------------------------------
// this.load.image('plate', "./assets/obj/plate.png");
// this.load.image('door', "./assets/obj/moving_block.png");
// this.load.image('water', "./assets/obj/water.png");

        // create plate
        // var plateLayer = map.getObjectLayer('plate')['objects'];
        // this.plate = this.physics.add.staticGroup();
        // plateLayer.forEach(object => {
        //     let plate = new Plate({
        //         scene : this,
        //         x : mapX + object.x - object.width/2, //x coordnate of ball
        //         y : mapY + object.y - object.height/2 //y coordnate of ball
        //     });
        //     this.physics.add.overlap(this.ball, plate, this.checkPressed, null, this);
        //     this.plateArray.push(plate);
        // });

        // Overlap of ball and plate
        // this.plateArray.forEach(plate =>{
        //     this.physics.add.overlap(this.ball, this.plate, this.checkPressed, null, this);
        // });


    // checkPressed() {
    //     // if (this.boolPressed == false) {
    //     //     this.boolPressed = true;
    //     //     this.pressed();
    //     // }
    //     this.plateArray.forEach(plate =>{
    //         this.physics.add.overlap(this.ball, this.plate, this.checkPressed, null, this);
    //     });
    //     console.log("pressed");
    // }
// this.doorLayer = map.createStaticLayer('door', tileset, 0, 0);
//         this.doorLayer.setPosition(mapX, mapY);
//         this.doorLayer.setCollisionByExclusion([-1],true);

// pressed() {
//     this.doorLayer.setCollisionByExclusion([-1],false);
//     this.doorLayer.setVisible(false);
// }