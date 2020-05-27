import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { MovingBlock } from '../../objects/MovingBlock';
import { Portal } from '../../objects/Portal';

export class Level16 extends Phaser.Scene{
    private moving_blocks = new Array();
    private ball;
    private hole;    

    private boolWin;
    private boolSand;
    private boolSand2;
    private controls
    private cursors;

    private boolPressed1 = false;
    private boolPressed2 = false;

    private doorLayer1;
    private doorLayer2;

    private boolOpen1 = false;
    private boolOpen2 = false;

    private boolLPressed1 = false;
    private boolLPressed2 = false;

    private laserLayer1;

    private boolLOpen1 = false;
    private boolLOpen2 = false;

    private rportal1;
    private rportal2;


    private ball2;
    private boolBall2 = false;

    private waterLayer;
    private sandLayer;
    private plateLayer1;
    private plateLayer2;
    private lplateLayer1;
    private splateLayer1;
    private bgLayer;
    private borderLayer;


    constructor(){
        super("level16");
    }
    init(){
        this.boolWin = false;
        this.boolSand = false;
        this.boolSand2 = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map16', './assets/map/level16.json');
        this.load.image('moving_block_3v', "./assets/obj/moving_block_3v.png");
        this.load.image('moving_block_3h', "./assets/obj/moving_block_3h.png");
        this.load.image('rportal', "./assets/obj/rportal.png");
    }
    create(){
        this.physics.world.setFPS(120);
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        var bkgrnd = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'river');
        bkgrnd.setScale(this.cameras.main.width/bkgrnd.width, this.cameras.main.height/bkgrnd.height).setScrollFactor(0);
        //this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "sand").setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 16, par : 10});
        this.createWindow(Hud, "hud", this.game.renderer.width/2,this.game.renderer.height/2, {level : 16, par : 10});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        //----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map16' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        this.bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        // var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapX = this.game.renderer.width/2 - this.bgLayer.width/2 + 200;
        var mapY = this.game.renderer.height/2 - this.bgLayer.height/2 + 200;
        this.bgLayer.setPosition(mapX, mapY);
        this.borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        this.borderLayer.setPosition(mapX, mapY);
        this.borderLayer.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create water
        this.waterLayer = map.createDynamicLayer('Water', tileset, 0, 0);
        this.waterLayer.setPosition(mapX, mapY);
        this.waterLayer.setTileIndexCallback([3,4,5,6,7,8,9,10,11], this.inwater, this);
        //-------------------------------------------------------------------------------
        //create sand
        this.sandLayer = map.createDynamicLayer('Sand', tileset, 0, 0);
        this.sandLayer.setPosition(mapX, mapY);
        this.sandLayer.setTileIndexCallback([21,22,23,24,25,26,27,28,29], this.inSand, this);
        //-------------------------------------------------------------------------------
        //create plate1
        this.plateLayer1 = map.createDynamicLayer('Plate1', tileset, 0, 0);
        this.plateLayer1.setPosition(mapX, mapY);
        this.plateLayer1.setTileIndexCallback(34, this.onPlate1, this);
        //-------------------------------------------------------------------------------
        //create plate2
        this.plateLayer2 = map.createDynamicLayer('Plate2', tileset, 0, 0);
        this.plateLayer2.setPosition(mapX, mapY);
        this.plateLayer2.setTileIndexCallback(34, this.onPlate2, this);
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
        //create Laser plate1
        this.lplateLayer1 = map.createDynamicLayer('LPlate1', tileset, 0, 0);
        this.lplateLayer1.setPosition(mapX, mapY);
        this.lplateLayer1.setTileIndexCallback(35, this.onLPlate1, this);
        //-------------------------------------------------------------------------------
        //create Laser
        this.laserLayer1 = map.createDynamicLayer('Laser1', tileset, 0, 0);
        this.laserLayer1.setPosition(mapX, mapY);
        this.laserLayer1.setTileIndexCallback([37, 38], this.inLava, this);
        //-------------------------------------------------------------------------------
        //create Laser plate1
        this.splateLayer1 = map.createDynamicLayer('SPlate', tileset, 0, 0);
        this.splateLayer1.setPosition(mapX, mapY);
        this.splateLayer1.setTileIndexCallback(36, this.onSPlate, this);
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
        //create ball2
        var ballLayer = map.getObjectLayer('SBall')['objects'];
        ballLayer.forEach(object => {
            this.ball2 = new Ball({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2 //y coordnate of ball
            });
        });
        this.ball2.setVisible(false);
        this.ball2.setInteractive(false);
        this.children.bringToTop(this.ball2);
        //--------------------------------------------------------------------------------
        //create hole
        var holeLayer = map.getObjectLayer('Hole')['objects'];
        //this.hole = this.physics.add.staticGroup();
        this.hole = this.physics.add.group();
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
                v : 100,
                start : 96,
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
                v : 100,
                start : 96,
                end : 96,
                verticle : true,
                name : 'moving_block_3v'
            });
            this.moving_blocks.push(moving_block);
        });
        //create portal1
        var rportalLayer = map.getObjectLayer('RPortal1')['objects'];
        rportalLayer.forEach(object => {
            this.rportal1 = new Portal({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2, //y coordnate of ball
                name : "rportal"
            });
        });
        //-------------------------------------------------------------------------------
        //create portal2
        var rportalLayer = map.getObjectLayer('RPortal2')['objects'];
        rportalLayer.forEach(object => { 
            this.rportal2 = new Portal({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2, //y coordnate of ball
                name : "rportal"
            });
        });
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, this.borderLayer);
        this.physics.add.overlap(this.ball, this.waterLayer, null, null, {this : this, ball : this.ball});
        this.physics.add.overlap(this.ball, this.sandLayer, null, null, {this : this, ball : this.ball});
        // this.physics.add.overlap(this.ball, this.lavaLayer, null, null, {this : this, ball : this.ball});
        this.physics.add.overlap(this.ball, this.hole, function() {this.checkWin(this.ball)}, null, this);
        this.physics.add.overlap(this.ball, this.plateLayer1, null, null, {this : this, ball : this.ball});
        this.physics.add.overlap(this.ball, this.plateLayer2, null, null, {this : this, ball : this.ball});
        this.physics.add.collider(this.ball, this.doorLayer1, null, null, {this : this, ball : this.ball});
        this.physics.add.collider(this.ball, this.doorLayer2, null, null, {this : this, ball : this.ball});
        this.physics.add.overlap(this.ball, this.lplateLayer1, null, null, {this : this, ball : this.ball});
        this.physics.add.collider(this.ball, this.laserLayer1, null, null, {this : this, ball : this.ball});
        this.physics.add.overlap(this.ball, this.rportal1, function() {this.tp1(this.ball)}, null, this);
        this.physics.add.overlap(this.ball, this.rportal2, function() {this.tp2(this.ball)}, null, this);
        // this.physics.add.overlap(this.ball, this.bportal1, function() {this.tp3(this.ball)}, null, this);
        // this.physics.add.overlap(this.ball, this.bportal2, function() {this.tp4(this.ball)}, null, this);
        this.physics.add.overlap(this.ball, this.splateLayer1, null, null, {this : this, ball : this.ball});
        for(let moving_block of this.moving_blocks) {
            this.physics.add.collider(this.ball, moving_block, null, null, {this : this, ball : this.ball});
        }
        this.children.bringToTop(this.ball);
        this.physics.add.collider(this.ball, this.ball2);

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
        this.cameras.main.setBounds(0, 0, this.bgLayer.width + 300, this.bgLayer.height+250);
    }

    update (time, delta) {
        this.controls.update(delta);
        this.ball.update();
        if(this.boolWin == false && (this.ball.body.onFloor() || this.ball.body.onCeiling() || this.ball.body.onWall())){
            this.sound.play("wall_bounce");
        }
        if (this.boolBall2) {
            this.ball2.update();
            if(this.boolWin == false && (this.ball2.body.onFloor() || this.ball2.body.onCeiling() || this.ball2.body.onWall())){
                this.sound.play("wall_bounce");
            }
        }
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

    checkWin(ball){
        let velocityX = ball.getVelocityX();
        let velocityY = ball.getVelocityY();
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (velocity <= 150) {
            if(this.boolWin == false){
                this.boolWin = true;
                this.win(ball);
            }
        }
    }
    win(ball) {
        ball.hide();
        var ball_strink = this.add.sprite(ball.x, ball.y, "ball_anim", 0);
        this.children.bringToTop(ball_strink);
        this.anims.create({
            key: "ball_strink",
            frames: this.anims.generateFrameNumbers("ball_anim", {start: 0, end: 4}),
                repeat: 0,
                frameRate: 7
            });

        ball_strink.once('animationcomplete', () => {
            ball_strink.destroy();
            this.scene.pause();
            this.events.emit('levelWin');
        });
        ball_strink.removeInteractive();
        ball_strink.play("ball_strink");
    }

    inwater(ball) {
        if (this.boolPressed1 == true) {
            this.boolPressed1 = false;
        }
        if (this.boolPressed2 == true) {
            this.boolPressed2 = false;
        }
        if (this.boolLPressed1 == true) {
            this.boolLPressed1 = false;
        }
        ball.moveBack();
    }

    inSand(ball) {
        if (ball == this.ball)
            this.boolSand = true;
        if (ball == this.ball2)
            this.boolSand2 = true;
    }

    checkSand() {
        if (this.boolSand) {
            this.ball.setDelta(0.9);
            this.boolSand = false;
        } else if(!this.boolSand) {
            this.ball.setDelta(0.97);
            this.boolSand = false;
        }

        if (this.boolSand2) {
            this.ball2.setDelta(0.9);
            this.boolSand2 = false;
        } else if(!this.boolSand2) {
            this.ball2.setDelta(0.97);
            this.boolSand2 = false;
        }
    }

    inLava(ball) {
        if (this.boolPressed1 == true) {
            this.boolPressed1 = false;
        }
        if (this.boolPressed2 == true) {
            this.boolPressed2 = false;
        }
        if (this.boolLPressed1 == true) {
            this.boolLPressed1 = false;
        }
        ball.moveStart();
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
    open1() {
        this.boolOpen1 = true;
        this.sound.play("plate_sound");
        this.doorLayer1.setCollisionByExclusion([-1],false);
        this.doorLayer1.setVisible(false);
    }
    open2() {
        this.boolOpen2 = true;
        this.sound.play("plate_sound");
        this.doorLayer2.setCollisionByExclusion([-1],false);
        this.doorLayer2.setVisible(false);
    }
    onLPlate1() {
        console.log("L1");
        if (this.boolLPressed1 == false) {
            this.boolLPressed1 = true;
        }
    }
    openL1() {
        this.boolLOpen1 = true;
        this.sound.play("laser_sound");
        this.laserLayer1.setTileIndexCallback([37, 38], null, this);
        this.laserLayer1.setVisible(false);
    }

    checkOpen() {
        if (this.ball.stopped() && this.ball2.stopped()) {
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
            if (this.boolLPressed1) {
                if (this.boolLOpen1 == false) {
                    this.openL1();
                }
            }
        }
    }
    tp1(ball) {
        ball.teleport(this.rportal2.getTPX(), this.rportal2.getTPY(), true);
    }
    tp2(ball) {
        ball.teleport(this.rportal1.getTPX(), this.rportal1.getTPY(), true);
    }
    onSPlate() {
        if(this.boolBall2 == false) {
            this.ball2.setVisible(true);
            this.ball2.setInteractive(true);

            this.physics.add.collider(this.ball2, this.borderLayer);
            this.physics.add.overlap(this.ball2, this.waterLayer, null, null, {this : this, ball : this.ball2});
            this.physics.add.overlap(this.ball2, this.sandLayer, null, null, {this : this, ball : this.ball2});
            // this.physics.add.overlap(this.ball2, this.lavaLayer, null, null, {this : this, ball : this.ball2});
            this.physics.add.overlap(this.ball2, this.hole, function() {this.checkWin(this.ball2)}, null, this);
            this.physics.add.overlap(this.ball2, this.plateLayer1, null, null, {this : this, ball : this.ball2});
            this.physics.add.overlap(this.ball2, this.plateLayer2, null, null, {this : this, ball : this.ball2});
            this.physics.add.collider(this.ball2, this.doorLayer1, null, null, {this : this, ball : this.ball2});
            this.physics.add.collider(this.ball2, this.doorLayer2, null, null, {this : this, ball : this.ball2});
            this.physics.add.overlap(this.ball2, this.lplateLayer1, null, null, {this : this, ball : this.ball2});
            this.physics.add.collider(this.ball2, this.laserLayer1, null, null, {this : this, ball : this.ball2});
            this.physics.add.overlap(this.ball2, this.rportal1, function() {this.tp1(this.ball2)}, null, this);
            this.physics.add.overlap(this.ball2, this.rportal2, function() {this.tp2(this.ball2)}, null, this);
            // this.physics.add.overlap(this.ball2, this.bportal1, function() {this.tp3(this.ball2)}, null, this);
            // this.physics.add.overlap(this.ball2, this.bportal2, function() {this.tp4(this.ball2)}, null, this);

            this.physics.add.overlap(this.ball2, this.splateLayer1, null, null, {this : this, ball : this.ball2});
            for(let moving_block of this.moving_blocks) {
                this.physics.add.collider(this.ball2, moving_block, null, null, {this : this, ball : this.ball2});
            }
            this.children.bringToTop(this.ball2);
            this.boolBall2 = true;
            this.sound.play("plate_sound");
        }
    }
}