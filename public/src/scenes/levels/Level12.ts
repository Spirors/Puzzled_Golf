import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { MovingBlock } from '../../objects/MovingBlock';

export class Level12 extends Phaser.Scene{
    private moving_blocks = new Array();
    private ball;
    private hole;    

    private boolWin;
    private boolSand;
    private controls
    private cursors;

    constructor(){
        super("level12");
    }
    init(){
        this.boolWin = false;
        this.boolSand = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map12', './assets/map/level12.json');
        this.load.image("bkgrnd2", "./assets/background/level2_background.png");
        this.load.image('moving_block_3h', "./assets/obj/moving_block_3h.png");
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
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 12});
        this.createWindow(Hud, "hud", this.game.renderer.width/2,this.game.renderer.height/2, {level : 12});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map12' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        // var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapX = this.game.renderer.width/2 - bgLayer.width/2 + 400;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2 + 250;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create water
        var waterLayer = map.createDynamicLayer('Water', tileset, 0, 0);
        waterLayer.setPosition(mapX, mapY);
        waterLayer.setTileIndexCallback([2,3,4,5,6,7,8,9,10], this.inwater, this);
        //-------------------------------------------------------------------------------
        //create sand
        var sandLayer = map.createDynamicLayer('Sand', tileset, 0, 0);
        sandLayer.setPosition(mapX, mapY);
        sandLayer.setTileIndexCallback([20,21,22,23,24,25,26,27,28], this.inSand, this);
        //-------------------------------------------------------------------------------
        //create plate1
        var plateLayer1 = map.createDynamicLayer('Plate1', tileset, 0, 0);
        plateLayer1.setPosition(mapX, mapY);
        plateLayer1.setTileIndexCallback(34, this.onPlate, this);
        //-------------------------------------------------------------------------------
        //create plate2
        var plateLayer2 = map.createDynamicLayer('Plate2', tileset, 0, 0);
        plateLayer2.setPosition(mapX, mapY);
        plateLayer2.setTileIndexCallback(34, this.onPlate, this);
        //-------------------------------------------------------------------------------
        //create door1
        var doorLayer1 = map.createDynamicLayer('Door1', tileset, 0, 0);
        doorLayer1.setPosition(mapX, mapY);
        doorLayer1.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create door2
        var doorLayer2 = map.createDynamicLayer('Door2', tileset, 0, 0);
        doorLayer2.setPosition(mapX, mapY);
        doorLayer2.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create Laser plate1
        var lplateLayer1 = map.createDynamicLayer('LPlate1', tileset, 0, 0);
        lplateLayer1.setPosition(mapX, mapY);
        lplateLayer1.setTileIndexCallback(34, this.onPlate, this);
        //-------------------------------------------------------------------------------
        //create Laser plate2
        var lplateLayer2 = map.createDynamicLayer('LPlate2', tileset, 0, 0);
        lplateLayer2.setPosition(mapX, mapY);
        lplateLayer2.setTileIndexCallback(34, this.onPlate, this);
        //-------------------------------------------------------------------------------
        //create Laser
        var laserLayer1 = map.createDynamicLayer('Laser1', tileset, 0, 0);
        laserLayer1.setPosition(mapX, mapY);
        laserLayer1.setCollisionByExclusion([-1],true);
        //-------------------------------------------------------------------------------
        //create Laser2
        var laserLayer2 = map.createDynamicLayer('Laser2', tileset, 0, 0);
        laserLayer2.setPosition(mapX, mapY);
        laserLayer2.setCollisionByExclusion([-1],true);
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
        var movingLayer = map.getObjectLayer('Moving')['objects'];
        movingLayer.forEach(object => {
            var moving_block = new MovingBlock({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of moving_block
                y : mapY + object.y - object.height/2, //y coordnate of moving_block
                v : 100,
                start : 128,
                end : 0,
                verticle : false,
                name : 'moving_block_3h'
            });
            this.moving_blocks.push(moving_block);
        });
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, waterLayer);
        this.physics.add.overlap(this.ball, sandLayer);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        this.physics.add.overlap(this.ball, plateLayer1);
        this.physics.add.overlap(this.ball, plateLayer2);
        this.physics.add.collider(this.ball, doorLayer1);
        this.physics.add.collider(this.ball, doorLayer2);
        this.physics.add.overlap(this.ball, lplateLayer1);
        this.physics.add.overlap(this.ball, lplateLayer2);
        this.physics.add.collider(this.ball, laserLayer1);
        this.physics.add.collider(this.ball, laserLayer2);
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
        this.ball.moveStart();
    }

    onPlate() {
        console.log("on plate");
    }
}