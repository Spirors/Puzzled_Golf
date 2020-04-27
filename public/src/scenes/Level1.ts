import { Hud } from './Hud';
import { HelpMenu } from './HelpMenu';
import { Ball } from '../objects/ball';

 // 
            // Phaser.Geom.Line.SetToAngle(this.ball_line, gameObject.x, gameObject.y, angleToPointer, 100)
            // if (angleToPointer >= 0 && angleToPointer <= 1.5708) {
            //     Phaser.Geom.Line.SetToAngle(this.ball_line, this.ball.x, this.ball.y, angleToPointer, 100)
            // } else if (angleToPointer >= 1.5708 && angleToPointer <= 3.14159) {
            // } else if (angleToPointer >= -3.14159 && angleToPointer <= -1.5708) {
            // } else if (angleToPointer >= -1.5708 && angleToPointer <= 0) {
            // }

export class Level1 extends Phaser.Scene{
    private ball : Ball;
    private ball_line;
    private max_power = 400;

    constructor(){
        super("level1");
    }
    init(){}
    preload(){
        this.load.image('ball', '../dist/images/ball.png');
    }
    create(){
        this.createHud();
        this.ball = new Ball({
            scene : this,
            x : this.scale.width/2,
            y : this.scale.height/2
        })
    }
    update() {
    }
    clickHandler (pointer)
    {
        // console.log("click");
        // this.events.emit('addScore');
    }
    createWindow(func, name, x, y){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true);
    }
    createHud() {
        console.log("LEVEL1");
        this.createWindow(Hud, "hud", 0, 0);
        this.events.emit('setLevel');
        this.input.on('pointerdown', this.clickHandler, this);
        var menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 1);
        menu.setInteractive();
        menu.on('pointerup', function () {
            this.createWindow(HelpMenu,"help",this.game.renderer.width/2, this.game.renderer.height/2);
        }, this);
    }
}