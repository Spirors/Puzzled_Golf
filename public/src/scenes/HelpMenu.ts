export class HelpMenu extends Phaser.Scene{
    private parent;
    private menuWidth;
    private menuHeight;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    init(){
        this.menuHeight = 502;
        this.menuWidth = 662;
    }
    preload(){
        
    }
    create ()
    {
        var background = this.add.image(0, 0,"help_menu").setOrigin(0);
        this.cameras.main.setViewport(this.game.renderer.width/2 - this.menuWidth/2, this.game.renderer.height/2 - this.menuHeight/2, this.menuWidth, this.menuHeight);
        var exit = this.add.image(605, 10, "exit").setOrigin(0);
        exit.setDepth(1);
        exit.setInteractive();
        exit.on('pointerdown', () => {
            this.scene.resume("inGameMenu");
            this.scene.remove(this);
        })
        exit.on('pointerover', () => {
            exit.setTint( 1 * 0xffff66);
        })
        exit.on('pointerout', () => {
            exit.setTint( 1 * 0xffffff);
        });
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }
}