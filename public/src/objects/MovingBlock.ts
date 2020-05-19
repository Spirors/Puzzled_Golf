export class MovingBlock extends Phaser.Physics.Arcade.Sprite {
    private velocity;
    private startY;
    private endY;

    private startX;
    private endX;

    private verticle;
    private reversed;

    constructor(config) {
        super(config.scene, config.x, config.y, config.name);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.setImmovable(true);

        this.velocity = config.v;
        this.verticle = config.verticle;
        if(this.verticle == true) {
            this.startY = this.y - config.start;
            this.endY = this.y + config.end;
            this.setVelocity(0, this.velocity);
        } else {
            this.startX = this.x - config.start;
            this.endX = this.x + config.end;
            this.setVelocity(this.velocity, 0);
        }
        this.reversed = false;
    }

    update() {
        if (this.verticle == true) {
            this.moveVerticle();
        } else {
            this.moveHorizontal();
        }
    }

    moveVerticle() {
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

    moveHorizontal() {
        if (this.body.velocity.x == 0) {
            this.restart();
        }

        if (this.x < this.startX) {
            if (this.reversed == true) {
                this.reverse();
                this.reversed = false;
            }
        }
        if (this.x > this.endX) {
            if (this.reversed == false) {
                this.reverse();
                this.reversed = true;
            }
        }
    }

    restart() {
        if(this.verticle == true) {
            this.setVelocity(0, this.velocity);
        } else {
            this.setVelocity(this.velocity, 0);
        }
    }

    reverse() {
        this.velocity *= -1;
        if(this.verticle == true) {
            this.setVelocity(0, this.velocity);
        } else {
            this.setVelocity(this.velocity, 0);
        }
    }
}