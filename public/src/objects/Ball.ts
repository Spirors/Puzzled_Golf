import { Level1 } from "../scenes/Level1";

export class Ball extends Phaser.Physics.Arcade.Sprite {
    private max_power = 600;
    private delta = 98/100;

    constructor(config) {
        super(config.scene, config.x, config.y, 'ball');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);

        this.setOrigin(0.5, 0.5);
        this.setInteractive();
        this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
        this.scene.input.setDraggable(this);

        this.on('drag', function (pointer, gameObject) {
            var angleToPointer = pointer.getAngle();
            var distXToPointer = pointer.getDistanceX();
            var distYToPointer = pointer.getDistanceY();
        }, this);

        this.on('dragend', function (pointer) {
            var angleToPointer = pointer.getAngle();
            var distXToPointer = pointer.getDistanceX();
            var distYToPointer = pointer.getDistanceY();
            var power = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
            console.log(power);
            if (power > this.max_power){
                power = this.max_power;
            }
            console.log(power);
            this.shootBall(power, angleToPointer)
        }, this);
    }

    update() {
        this.setVelocity(this.delta * this.body.velocity.x, this.delta * this.body.velocity.y)
    }

    shootBall(power, angle) {
        this.setVelocity(power * -Math.cos(angle), power * -Math.sin(angle));
    }

    // Todo: Disable drag during shootBall
    //       Collision with wall
    //       Overlap with hole
    //       Line indicator
}