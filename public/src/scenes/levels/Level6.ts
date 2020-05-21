import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';

export class Level6 extends Phaser.Scene{
    private ball;
    private hole;    

    private boolWin;
    private boolSand;

    private boolPressed1 = false;
    private boolPressed2 = false;

    private doorLayer1;
    private doorLayer2;

    private boolOpen1 = false;
    private boolOpen2 = false;

    constructor(){
        super("level6");
    }
    init(){
        this.boolWin = false;
        this.boolSand = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map6', './assets/map/level6.json');
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        var bkgrnd = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'desert');
        bkgrnd.setScale(this.cameras.main.width/bkgrnd.width, this.cameras.main.height/bkgrnd.height).setScrollFactor(0);
        //this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "desert").setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 6});
        this.createWindow(Hud, "hud", 0, 0, {level : 6, stars : [5,7,9]});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map6' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
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
        //add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, sandLayer);
        this.physics.add.overlap(this.ball, plateLayer1);
        this.physics.add.overlap(this.ball, plateLayer2);
        this.physics.add.collider(this.ball, this.doorLayer1);
        this.physics.add.collider(this.ball, this.doorLayer2);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        this.children.bringToTop(this.ball);
    }

    update() {
        this.ball.update();
        if(this.boolWin == false && (this.ball.body.onFloor() || this.ball.body.onCeiling() || this.ball.body.onWall())){
            this.sound.play("wall_bounce");
        }
        this.checkSand();
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
        }
    }
}