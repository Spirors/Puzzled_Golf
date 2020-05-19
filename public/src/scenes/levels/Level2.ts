import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { Door } from '../../objects/Door';

export class Level2 extends Phaser.Scene{
    private ball;
    private door;

    private plate;

    private waterLayer;
    private boolWin;
    private menu;

    private boolPressed;
    private boolOpened;

    constructor(){
        super("level2");
    }
    init(){
        this.boolWin = false;
        this.boolPressed = false;
        this.boolOpened = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map2', './assets/map/level2.json');
        this.load.image('plate', "./assets/obj/plate.png");
        this.load.image('door', "./assets/obj/moving_block.png");
        this.load.image('water', "./assets/obj/water.png");
        this.load.image("bkgrnd2", "./assets/background/level2_background.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd2").setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 2});
        this.createWindow(Hud, "hud", 0, 0, {level : 2});
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
        this.children.bringToTop(this.ball);
        //--------------------------------------------------------------------------------
        //create hole
        var holeLayer = map.getObjectLayer('hole')['objects'];
        var holes = this.physics.add.staticGroup();
        holeLayer.forEach(object => {
            let obj = holes.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        this.physics.add.overlap(this.ball, holes, this.checkWin, null, this);
        //--------------------------------------------------------------------------------
        //create plate
        var plateLayer = map.getObjectLayer('plate')['objects'];
        var plates = this.physics.add.staticGroup();
        plateLayer.forEach(object => {
            let obj = plates.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "plate"); 
        });
        this.physics.add.overlap(this.ball, plates, this.pressed, null, this);
        //--------------------------------------------------------------------------------
        //create water
        var waterLayer = map.getObjectLayer('water')['objects'];
        this.waterLayer = this.physics.add.staticGroup();
        waterLayer.forEach(object => {
            let obj = this.waterLayer.create(mapX + object.x + 32 - object.width/2, mapY + object.y - object.height/2, "water");
        });
        this.physics.add.overlap(this.ball, this.waterLayer, this.inwater, null, this);
        //--------------------------------------------------------------------------------
        //create door
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
        this.menu.removeInteractive();
        this.ball.hide();
        this.scene.pause();
        this.events.emit('levelWin');
    }

    pressed() {
        if (this.boolPressed == false) {
            this.boolPressed = true;
        }
    }
    inwater() {
        if (this.boolPressed == true) {
            this.boolPressed = false;
        }
        this.ball.moveBack();
    }

    checkOpen() {
        if (this.ball.stopped()) {
            if (this.boolPressed) {
                if (this.boolOpened == false) {
                    this.boolOpened = true;
                    this.door.setOpen();
                }
            }
        }
    }
}