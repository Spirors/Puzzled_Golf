import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { MovingBlock } from '../../objects/MovingBlock';
import { Portal } from '../../objects/Portal';

export class Level17 extends Phaser.Scene{
    private moving_blocks = new Array();
    private ball;
    private hole;    

    private boolWin;
    private boolSand;
    private controls
    private cursors;

    private boolPressed1 = false;
    private boolPressed2 = false;
    private boolPressed3 = false;

    private doorLayer1;
    private doorLayer2;
    private doorLayer3;

    private boolOpen1 = false;
    private boolOpen2 = false;
    private boolOpen3 = false;

    private boolLPressed1 = false;
    private boolLPressed2 = false;

    private laserLayer1;
    private laserLayer2;

    private boolLOpen1 = false;
    private boolLOpen2 = false;

    private rportal1;
    private rportal2;

    private bportal1;
    private bportal2;

    constructor(){
        super("level17");
    }
    init(){
        this.boolWin = false;
        this.boolSand = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map17', './assets/map/level17.json');
        this.load.image("bkgrnd2", "./assets/background/level2_background.png");
        this.load.image('moving_block_3v', "./assets/obj/moving_block_3v.png");
        this.load.image('moving_block_3h', "./assets/obj/moving_block_3h.png");
        this.load.image('rportal', "./assets/obj/rportal.png");
        this.load.image('bportal', "./assets/obj/bportal.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        // this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd2").setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 17});
        this.createWindow(Hud, "hud", this.game.renderer.width/2,this.game.renderer.height/2, {level : 17});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map17' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        // var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapX = this.game.renderer.width/2 - bgLayer.width/2 + 250;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2 + 350;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create water
        var waterLayer = map.createDynamicLayer('Water', tileset, 0, 0);
        waterLayer.setPosition(mapX, mapY);
        waterLayer.setTileIndexCallback([3,4,5,6,7,8,9,10,11], this.inwater, this);
        //-------------------------------------------------------------------------------
        //create lava
        var lavaLayer = map.createDynamicLayer('Lava', tileset, 0, 0);
        lavaLayer.setPosition(mapX, mapY);
        lavaLayer.setTileIndexCallback([12,13,14,15,16,17,18,19,20], this.inLava, this);
        //-------------------------------------------------------------------------------
        //create sand
        var sandLayer = map.createDynamicLayer('Sand', tileset, 0, 0);
        sandLayer.setPosition(mapX, mapY);
        sandLayer.setTileIndexCallback([21,22,23,24,25,26,27,28,29], this.inSand, this);
        //-------------------------------------------------------------------------------
        //create plate1
        var plateLayer1 = map.createDynamicLayer('Plate1', tileset, 0, 0);
        plateLayer1.setPosition(mapX, mapY);
        plateLayer1.setTileIndexCallback(34, this.onPlate1, this);
        //-------------------------------------------------------------------------------
        //create plate2
        var plateLayer2 = map.createDynamicLayer('Plate2', tileset, 0, 0);
        plateLayer2.setPosition(mapX, mapY);
        plateLayer2.setTileIndexCallback(34, this.onPlate2, this);
        //-------------------------------------------------------------------------------
        //create plate2
        var plateLayer3 = map.createDynamicLayer('Plate3', tileset, 0, 0);
        plateLayer3.setPosition(mapX, mapY);
        plateLayer3.setTileIndexCallback(34, this.onPlate3, this);
        //-------------------------------------------------------------------------------
        //create door1
        this.doorLayer1 = map.createDynamicLayer('Door1', tileset, 0, 0);
        this.doorLayer1.setPosition(mapX, mapY);
        this.doorLayer1.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create door2
        this.doorLayer2 = map.createDynamicLayer('Door2', tileset, 0, 0);
        this.doorLayer2.setPosition(mapX, mapY);
        this.doorLayer2.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create door2
        this.doorLayer3 = map.createDynamicLayer('Door3', tileset, 0, 0);
        this.doorLayer3.setPosition(mapX, mapY);
        this.doorLayer3.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create Laser plate1
        var lplateLayer1 = map.createDynamicLayer('LPlate1', tileset, 0, 0);
        lplateLayer1.setPosition(mapX, mapY);
        lplateLayer1.setTileIndexCallback(35, this.onLPlate1, this);
        //-------------------------------------------------------------------------------
        //create Laser plate2
        var lplateLayer2 = map.createDynamicLayer('LPlate2', tileset, 0, 0);
        lplateLayer2.setPosition(mapX, mapY);
        lplateLayer2.setTileIndexCallback(35, this.onLPlate2, this);
        //-------------------------------------------------------------------------------
        //create Laser
        this.laserLayer1 = map.createDynamicLayer('Laser1', tileset, 0, 0);
        this.laserLayer1.setPosition(mapX, mapY);
        this.laserLayer1.setTileIndexCallback([37, 38], this.inLava, this);
        //-------------------------------------------------------------------------------
        //create Laser2
        this.laserLayer2 = map.createDynamicLayer('Laser2', tileset, 0, 0);
        this.laserLayer2.setPosition(mapX, mapY);
        this.laserLayer2.setTileIndexCallback([37, 38], this.inLava, this);
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
                end : 64,
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
                v : 100,
                start : 64,
                end : 96,
                verticle : true,
                name : 'moving_block_3v'
            });
            this.moving_blocks.push(moving_block);
        });
        //-------------------------------------------------------------------------------
        //create red portal
        var rportalLayer = map.getObjectLayer('RPortal1')['objects'];
        rportalLayer.forEach(object => {
            this.rportal1 = new Portal({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2, //y coordnate of ball
                name : "rportal"
            });
        });
        var rportalLayer = map.getObjectLayer('RPortal2')['objects'];
        rportalLayer.forEach(object => { 
            this.rportal2 = new Portal({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2, //y coordnate of ball
                name : "rportal"
            });
        });
        //-------------------------------------------------------------------------------
        //create blue portal
        var bportalLayer = map.getObjectLayer('BPortal1')['objects'];
        bportalLayer.forEach(object => {
            this.bportal1 = new Portal({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2, //y coordnate of ball
                name : "bportal"
            });
        });
        var bportalLayer = map.getObjectLayer('BPortal2')['objects'];
        bportalLayer.forEach(object => { 
            this.bportal2 = new Portal({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2, //y coordnate of ball
                name : "bportal"
            });
        });
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, waterLayer);
        this.physics.add.overlap(this.ball, sandLayer);
        this.physics.add.overlap(this.ball, lavaLayer);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        this.physics.add.overlap(this.ball, plateLayer1);
        this.physics.add.overlap(this.ball, plateLayer2);
        this.physics.add.overlap(this.ball, plateLayer3);
        this.physics.add.collider(this.ball, this.doorLayer1);
        this.physics.add.collider(this.ball, this.doorLayer2);
        this.physics.add.collider(this.ball, this.doorLayer3);
        this.physics.add.overlap(this.ball, lplateLayer1);
        this.physics.add.collider(this.ball, this.laserLayer1);
        this.physics.add.overlap(this.ball, lplateLayer2);
        this.physics.add.collider(this.ball, this.laserLayer2);
        this.physics.add.overlap(this.ball, this.rportal1, this.tp1, null, this);
        this.physics.add.overlap(this.ball, this.rportal2, this.tp2, null, this);
        this.physics.add.overlap(this.ball, this.bportal1, this.tp3, null, this);
        this.physics.add.overlap(this.ball, this.bportal2, this.tp4, null, this);
        for(let moving_block of this.moving_blocks) {
            this.physics.add.collider(this.ball, moving_block);
        }
        this.children.bringToTop(this.ball);

        //camera movment
        this.cursors = this.input.keyboard.createCursorKeys();

        this.cursors = this.input.keyboard.addKeys(
            {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        var controlConfig = {
            camera: this.cameras.main,
            left: this.cursors.left,
            right: this.cursors.right,
            up: this.cursors.up,
            down: this.cursors.down,
            speed: 0.5
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        this.cameras.main.setBounds(0, 0, bgLayer.width + 300, bgLayer.height+250);
    }

    update (time, delta) {
        this.controls.update(delta);
        this.ball.update();
        this.checkSand();
        for(var i = 0; i < this.moving_blocks.length; i++) {
            this.moving_blocks[i].update();
        }
        this.checkOpen();
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
        this.ball.hide();
        this.scene.pause();
        this.events.emit('levelWin');
    }

    inwater() {
        if (this.boolPressed1 == true) {
            this.boolPressed1 = false;
        }
        if (this.boolPressed2 == true) {
            this.boolPressed2 = false;
        }
        if (this.boolPressed3 == true) {
            this.boolPressed3 = false;
        }
        if (this.boolLPressed1 == true) {
            this.boolLPressed1 = false;
        }
        if (this.boolLPressed2 == true) {
            this.boolLPressed2 = false;
        }
        this.ball.moveBack();
    }

    inSand() {
        this.boolSand = true;
    }

    checkSand() {
        if (this.boolSand) {
            this.ball.setDelta(0.9);
            this.boolSand = false;
        } else if(!this.boolSand) {
            this.ball.setDelta(0.97);
            this.boolSand = false;
        }
    }

    inLava() {
        if (this.boolPressed1 == true) {
            this.boolPressed1 = false;
        }
        if (this.boolPressed2 == true) {
            this.boolPressed2 = false;
        }
        if (this.boolPressed3 == true) {
            this.boolPressed3 = false;
        }
        if (this.boolLPressed1 == true) {
            this.boolLPressed1 = false;
        }
        if (this.boolLPressed2 == true) {
            this.boolLPressed2 = false;
        }
        this.ball.moveStart();
    }

    onPlate1() {
        console.log(1);
        if (this.boolPressed1 == false) {
            this.boolPressed1 = true;
        }
    }
    onPlate2() {
        console.log(2);
        if (this.boolPressed2 == false) {
            this.boolPressed2 = true;
        }
    }
    onPlate3() {
        console.log(3);
        if (this.boolPressed3 == false) {
            this.boolPressed3 = true;
        }
    }
    open1() {
        this.boolOpen1 = true;
        this.doorLayer1.setCollisionByExclusion([-1],false);
        this.doorLayer1.setVisible(false);
    }
    open2() {
        this.boolOpen2 = true;
        this.doorLayer2.setCollisionByExclusion([-1],false);
        this.doorLayer2.setVisible(false);
    }
    open3() {
        this.boolOpen3 = true;
        this.doorLayer3.setCollisionByExclusion([-1],false);
        this.doorLayer3.setVisible(false);
    }
    onLPlate1() {
        console.log("L1");
        if (this.boolLPressed1 == false) {
            this.boolLPressed1 = true;
        }
    }
    onLPlate2() {
        console.log("L2");
        if (this.boolLPressed2 == false) {
            this.boolLPressed2 = true;
        }
    }
    openL1() {
        this.boolLOpen1 = true;
        this.laserLayer1.setTileIndexCallback([37, 38], null, this);
        this.laserLayer1.setVisible(false);
    }
    openL2() {
        this.boolLOpen2 = true;
        this.laserLayer2.setTileIndexCallback([37, 38], null, this);
        this.laserLayer2.setVisible(false);
    }

    checkOpen() {
        if (this.ball.stopped()) {
            if (this.boolPressed1) {
                if (this.boolOpen1 == false) {
                    this.open1();
                }
            }
            if (this.boolPressed2) {
                if (this.boolOpen2 == false) {
                    this.open2();
                }
            }
            if (this.boolPressed3) {
                if (this.boolOpen3 == false) {
                    this.open3();
                }
            }
            if (this.boolLPressed1) {
                if (this.boolLOpen1 == false) {
                    this.openL1();
                }
            }
            if (this.boolLPressed2) {
                if (this.boolLOpen2 == false) {
                    this.openL2();
                }
            }
        }
    }
    tp1() {
        this.ball.teleport(this.rportal2.getTPX(), this.rportal2.getTPY(), true);
    }
    tp2() {
        this.ball.teleport(this.rportal1.getTPX(), this.rportal1.getTPY(), true);
    }
    tp3() {
        this.ball.teleport(this.bportal2.getTPX(), this.bportal2.getTPY(), false);
    }
    tp4() {
        this.ball.teleport(this.bportal1.getTPX(), this.bportal1.getTPY(), false);
    }
}