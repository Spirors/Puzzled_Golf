import { Hud } from './Hud';
import { InGameMenu } from './InGameMenu';
import { Ball } from '../objects/ball';
import { MovingBlock } from '../objects/MovingBlock';
import { NONE } from 'phaser';

export class Level1 extends Phaser.Scene{
    private ball;
    private hole;
    private holeX;
    private holeY;
    private holeR;

    private moving_block;

    private music; 
    
    constructor(){
        super("level1");
    }
    init(){

    }
    preload(){
        this.load.image('hole', "../dist/assets/golf_hole.png");
        this.load.image('tiles', '../dist/assets/tileset.png');
        this.load.tilemapTiledJSON('map1', '../dist/assets/level1.json');
        this.load.image('ball', '../dist/assets/ball.png');
        this.load.image('moving_block', "../dist/assets/moving_block.png");

        this.load.audio("level_audio", "../dist/assets/audio/level1_audio.mp3");
    }
    create(){
        var music_config = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.music = this.sound.add("level_audio");
        this.music.play(music_config);

        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.physics.world.setFPS(120);

        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 1});
        this.createWindow(Hud, "hud", 0, 0, {level : 1});
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
        var map = this.make.tilemap({ key: 'map1' });
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
            // obj.setOrigin(0); 
            // obj.body.width = object.width; 
            // obj.body.height = object.height; 
        });
        this.children.bringToTop(this.ball);
        // this.physics.add.overlap(this.ball, this.hole, null, this.gameWin, this);

        this.moving_block = new MovingBlock({
            scene : this,
            x : this.scale.width - 550, //x coordnate of moving_block
            y : this.scale.height - 255 //y coordnate of moving_block
        });
        this.physics.add.collider(this.ball, this.moving_block);
    }

    update() {
        this.ball.update();
        this.moving_block.update();

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