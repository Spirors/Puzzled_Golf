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
        this.load.image("bkgrnd1", "./assets/background/level1_background.png");
        this.load.image('moving_block_5v', "./assets/obj/moving_block_5v.png");
    }
    create(){
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.createCore('bkgrnd1', 1);
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
        this.physics.add.overlap(this.ball, this.hole, this.cwin, null, this);
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
    cwin() {
        this.boolWin = this.checkWin(this.ball, this.boolWin);
    }
}