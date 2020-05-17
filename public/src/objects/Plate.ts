export class Plate extends Phaser.Physics.Arcade.Sprite {
    private pressed;
    constructor(config) {
        super(config.scene, config.x, config.y, 'plate');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.setImmovable(true);

        this.pressed = false;
    }

    setPressed() {
        this.pressed = true;
    }
}