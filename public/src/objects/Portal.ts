export class Portal extends Phaser.Physics.Arcade.Sprite {
    private tpX;
    private tpY;
    constructor(config) {
        super(config.scene, config.x, config.y, config.name);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.tpX = this.x + 80;
        this.tpY = this.y;
    }
    getTPX() {
        return this.tpX;
    }
    getTPY() {
        return this.tpY;
    }
}