export class MovingBlock extends Phaser.Physics.Arcade.Sprite {
    private velocity;
    private startY;
    private endY;
    private reversed;

    constructor(config) {
        super(config.scene, config.x, config.y, 'moving_block');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.setImmovable(true);

        this.velocity = config.v;
        this.startY = this.y - config.start;
        this.endY = this.y + config.end;
        this.reversed = false;

        this.setVelocity(0, this.velocity);
    }

    update() {
        // console.log(this.body.velocity.y);
        if (this.body.velocity.y == 0) {
            this.restart();
        }

        if (this.y < this.startY) {
            if (this.reversed == true) {
                this.reverse();
                this.reversed = false;
            }
        }
        if (this.y > this.endY) {
            if (this.reversed == false) {
                this.reverse();
                this.reversed = true;
            }
        }
    }

    restart() {
        this.setVelocity(0, this.velocity);
    }

    reverse() {
        this.velocity *= -1;
        this.setVelocity(0, this.velocity);
    }
}