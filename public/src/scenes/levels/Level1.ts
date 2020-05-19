import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { MovingBlock } from '../../objects/MovingBlock';

export class Level1 extends Phaser.Scene{
    private menu;

    private ball;
    private hole;

    private moving_blocks = new Array();
    private boolWin;

    constructor(){
        super("level1");
    }
    init(){
        this.boolWin = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map1', './assets/map/level1.json');
        this.load.image("bkgrnd1", "./assets/background/level1_background.png");
        this.load.image('moving_block1', "./assets/obj/moving_block1.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd1").setOrigin(0,0).setScale(1.37);
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
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
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
                v : 200,
                start : 64,
                end : 64,
                verticle : true,
                name : 'moving_block1'
            });
            this.moving_blocks.push(moving_block);
        });
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        for(let moving_block of this.moving_blocks) {
            this.physics.add.collider(this.ball, moving_block);
        }
        this.children.bringToTop(this.ball);
    }

    update() {
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
        this.ball.hide();
        this.scene.pause();
        this.events.emit('levelWin');
    }
}