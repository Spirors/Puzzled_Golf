export class Door extends Phaser.Physics.Arcade.Sprite {
    private open;
    constructor(config) {
        super(config.scene, config.x, config.y, 'door');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.setImmovable(true);

        this.open = false;
    }

    update() {
        if (this.open == true) {
            this.destroy();
        }
    }
    setOpen() {
        this.open = true;
    }
}