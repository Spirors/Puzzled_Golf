export class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, 'door');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.setImmovable(true);
    }
}