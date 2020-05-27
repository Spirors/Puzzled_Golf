import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';

export class Level2 extends Phaser.Scene{
    private ball;
    private hole;    

    private boolWin;

    constructor(){
        super("level2");
    }
    init(){
        this.boolWin = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map2', './assets/map/level2.json');
    }
    create(){
        this.physics.world.setFPS(120);
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        var bkgrnd = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'river');
        bkgrnd.setScale(this.cameras.main.width/bkgrnd.width, this.cameras.main.height/bkgrnd.height).setScrollFactor(0);
       // this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "river").setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 2, par: 2});
        this.createWindow(Hud, "hud", 0, 0, {level : 2, par: 2});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map2' });
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
        waterLayer.setTileIndexCallback([3,4,5,6,7,8,9,10,11], this.inwater, this);
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
        //this.hole = this.physics.add.staticGroup();
        this.hole = this.physics.add.group();
        holeLayer.forEach(object => {
            this.hole.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, waterLayer);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        this.children.bringToTop(this.ball);
    }

    update() {
        this.ball.update();
        if(this.boolWin == false && (this.ball.body.onFloor() || this.ball.body.onCeiling() || this.ball.body.onWall())){
            this.sound.play("wall_bounce");
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
            if(this.boolWin == false) {
                this.boolWin = true;
                this.win();
            }
        }
    }
    win() {
        this.ball.hide();
        var ball_strink = this.add.sprite(this.ball.x, this.ball.y, "ball_anim", 0);
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

    inwater() {
        // Fix delay
        // var splash = this.add.sprite(this.ball.x,  this.ball.y, "splash_anim", 0).setScale(1.5);
        // splash.setOrigin(0.5,0.7);
        // this.anims.create({
        //     key: "splash",
        //     frames: this.anims.generateFrameNumbers("splash_anim", {start: 0, end: 4}),
        //         repeat: 0,
        //         frameRate: 7
        //     });
    
        // splash.on('animationcomplete', function(){
        //     console.log("animationcomplete")
        //     splash.destroy();
        // });
        // splash.play("splash");

        this.time.delayedCall(3000, this.ball.moveBack(), [], this);
    }
}