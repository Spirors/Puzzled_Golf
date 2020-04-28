import { Level1 } from "../scenes/Level1";

export class Ball extends Phaser.Physics.Arcade.Sprite {
    private max_power;
    private min_power;
    private ball_delta;
    private draggable;

    private max_indicatorLength;
    private min_indicatorLength;
    private indicator_line : Phaser.Geom.Line;
    private line_length;
    private line_angle;
    private graphics;

    constructor(config) {
        super(config.scene, config.x, config.y, 'ball');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
        this.scene.input.setDraggable(this);

        this.max_power = 1000;
        this.min_power = 20;
        this.ball_delta = .985;
        this.draggable = true;

        this.indicator_line = new Phaser.Geom.Line(
            this.x,
            this.y,
            this.x,
            this.y
        );
        this.max_indicatorLength = 150;
        this.min_indicatorLength = 20;
        this.line_length = 0;
        this.line_angle = 0;
        this.graphics = this.scene.add.graphics()

        this.on('drag', function (pointer) {
            if (this.draggable == true) {
                var distXToPointer = pointer.getDistanceX();
                var distYToPointer = pointer.getDistanceY();
                this.line_angle = pointer.getAngle();
                this.line_length = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
                if (this.line_length <= this.min_indicatorLength) {
                    this.line_length = 0;
                }
                if (this.line_length > this.max_indicatorLength) {
                    this.line_length = this.max_indicatorLength;
                }
                this.changeLine(this.line_length, this.line_angle);
            }
        }, this);

        this.on('dragend', function (pointer) {
            if (this.draggable == true) {
                var angleToPointer = pointer.getAngle();
                var distXToPointer = pointer.getDistanceX();
                var distYToPointer = pointer.getDistanceY();
                var power = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
                if (power <= this.min_power) {
                    power = 0;
                }
                power = power * 5;
                if (power > this.max_power){
                    power = this.max_power;
                }
                console.log(power)
                if (power != 0) {
                    this.scene.events.emit("addScore");
                    this.draggable = false;
                    this.changeLine(0, 0);
                    this.shootBall(power, angleToPointer);
                }
            }
        }, this);
    }

    update() {
        this.updateBall();
        this.updateLine();
    }

    updateBall() {
        // console.log(this.body.velocity.x, this.body.velocity.y);
        if (Math.abs(this.body.velocity.x) < 2 && Math.abs(this.body.velocity.x) < 2) {
            this.setVelocity(0, 0);
            this.draggable = true;
        } else {
            this.setVelocity(this.ball_delta * this.body.velocity.x, this.ball_delta * this.body.velocity.y);
        }
    }
    updateLine() {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.graphics.strokeLineShape(this.indicator_line);
    }

    changeLine(delta, angle) {
        Phaser.Geom.Line.SetToAngle(this.indicator_line, this.x, this.y, angle + 3.14159, delta);
    }

    shootBall(power, angle) {
        this.setVelocity(power * -Math.cos(angle), power * -Math.sin(angle));
    }
}