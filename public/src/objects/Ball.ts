import { Level1 } from "../scenes/Level1";

export class Ball extends Phaser.Physics.Arcade.Sprite {
    private max_power;
    private min_power;
    private delta;
    private draggable;

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
        this.delta = .985;
        this.draggable = true;

        this.on('drag', function (pointer, gameObject) {
            var angleToPointer = pointer.getAngle();
            var distXToPointer = pointer.getDistanceX();
            var distYToPointer = pointer.getDistanceY();
        }, this);

        this.on('dragend', function (pointer) {
            if (this.draggable == true) {
                var angleToPointer = pointer.getAngle();
                var distXToPointer = pointer.getDistanceX();
                var distYToPointer = pointer.getDistanceY();
                var power = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
                if (power > this.max_power){
                    power = this.max_power;
                }
                if (power <= this.min_power) {
                    power = 0;
                }
                // console.log(power);
                if (power != 0) {
                    this.scene.events.emit("addScore");
                    this.draggable = false;
                    this.shootBall(power, angleToPointer);
                }
            }
        }, this);
    }

    update() {
        // console.log(this.body.velocity.x, this.body.velocity.y);
        if (Math.abs(this.body.velocity.x) < 2 && Math.abs(this.body.velocity.x) < 2) {
            this.setVelocity(0, 0);
            this.draggable = true;
        } else {
            this.setVelocity(this.delta * this.body.velocity.x, this.delta * this.body.velocity.y);
        }
    }

    shootBall(power, angle) {
        this.setVelocity(power * -Math.cos(angle), power * -Math.sin(angle));
    }

    // Todo: Line indicator
}