import { LevelCreator } from './LevelCreator';

export class Level1 extends LevelCreator{
    private bgLayer;
    private borderLayer;
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
        this.load.image('moving_block_5v', "./assets/obj/moving_block_5v.png");
    }
    create(){
        this.physics.world.setFPS(120);
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.createCore('grass_bkgrnd', 1, 2);
        //-----------------------------------------------------------------------------
        //map
        this.bgLayer = this.createMap('map1');
        this.borderLayer = this.createBorder();
        //-------------------------------------------------------------------------------
        //create ball
        this.ball = this.createBall();
        //--------------------------------------------------------------------------------
        //create hole
        this.hole = this.createHole();
        //--------------------------------------------------------------------------------
        //create moving block
        this.moving_blocks = this.createMoving("Moving", 200, 64, 64, true, 'moving_block_5v');
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, this.borderLayer);
        this.physics.add.overlap(this.ball, this.hole, function() {this.checkWin("ball1")}, null, this);
        for(let moving_block of this.moving_blocks) {
            this.physics.add.collider(this.ball, moving_block);
        }
        this.children.bringToTop(this.ball);
    }

    update() {
        this.ball.update();
        if(this.boolWin == false && (this.ball.body.onFloor() || this.ball.body.onCeiling() || this.ball.body.onWall())){
            this.sound.play("wall_bounce");
        }
        for(var i = 0; i < this.moving_blocks.length; i++) {
            this.moving_blocks[i].update();
        }
    }
    
    checkWin(b){
        console.log(b);
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
}