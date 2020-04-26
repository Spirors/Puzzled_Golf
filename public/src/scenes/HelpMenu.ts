export class HelpMenu extends Phaser.Scene{
    private parent;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    preload(){
        
    }
    create ()
    {
        var background = this.add.image(0,0,"help_menu").setOrigin(0);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 637, 361);
        var exit = this.add.image(605, 10, "exit").setOrigin(0);
        exit.setDepth(1);
        exit.setInteractive();
        exit.on('pointerdown', () => {
            this.scene.remove(this);
        });
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }
}