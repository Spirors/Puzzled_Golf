import { Level1 } from "../scenes/Level1";

export class Ball extends Phaser.Physics.Arcade.Sprite {
    // Fields for the ball
    private max_velocity;
    private min_velocity;
    private ball_delta;
    private ball_power;
    private draggable;

    // Fields for indicator line
    private indicator_line : Phaser.Geom.Line;
    private max_length;
    private min_length;
    private graphics;

    constructor(config) {
        super(config.scene, config.x, config.y, 'ball');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.setCircle(16);
        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
        this.scene.input.setDraggable(this);

        this.max_velocity = 1500;
        this.min_velocity = 200;
        this.ball_power = 10;
        this.ball_delta = .97;
        this.draggable = true;

        this.indicator_line = new Phaser.Geom.Line(
            this.x,
            this.y,
            this.x,
            this.y
        );
        this.max_length = 150;
        this.min_length = 20;
        this.graphics = this.scene.add.graphics()

        this.on('drag', function (pointer) {
            if (this.draggable == true) {
                var angleToPointer = pointer.getAngle();
                var distXToPointer = pointer.getDistanceX();
                var distYToPointer = pointer.getDistanceY();
                var line_length = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
                if (line_length <= this.min_length) {
                    line_length = 0;
                }
                if (line_length > this.max_length) {
                    line_length = this.max_length;
                }
                this.changeLine(line_length, angleToPointer);
            }
        }, this);

        this.on('dragend', function (pointer) {
            if (this.draggable == true) {
                var angleToPointer = pointer.getAngle();
                var distXToPointer = pointer.getDistanceX();
                var distYToPointer = pointer.getDistanceY();
                var velocity = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
                velocity = velocity * this.ball_power;
                if (velocity <= this.min_velocity) {
                    velocity = 0;
                }
                if (velocity > this.max_velocity){
                    velocity = this.max_velocity;
                }
                if (velocity != 0) {
                    this.scene.events.emit("addScore");
                    this.draggable = false;
                    this.changeLine(0, 0);
                    this.shootBall(velocity, angleToPointer);
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
        if (Math.abs(this.body.velocity.x) < 1 && Math.abs(this.body.velocity.x) < 1) {
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
        Phaser.Geom.Line.SetToAngle(this.indicator_line, this.x, this.y, angle + Math.PI, delta);
    }

    shootBall(velocity, angle) {
        this.setVelocity(velocity * -Math.cos(angle), velocity * -Math.sin(angle));
    }
}