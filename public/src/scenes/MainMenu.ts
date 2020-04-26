import { HelpMenu } from "./HelpMenu";

export class MainMenu extends Phaser.Scene{
    constructor(){
        super("mainMenu");
    }
    init(){

    }
    preload(){
        this.load.spritesheet("button", "../dist/images/menu_button.png", {frameWidth: 147,
        frameHeight: 41});
        this.load.spritesheet("levels", "../dist/images/levels.png", {frameWidth: 404,
            frameHeight: 60});
        this.load.image("help_menu", "../dist/images/help_pop.png");
        this.load.image("exit", "../dist/images/exit.png");
    }
    create(){
        console.log("main menu");
        var help = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 - 120, 'button', 3);
        var level1 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2, 'levels', 0);
        var level2 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 +60, 'levels', 1);
        var level3 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 +120, 'levels', 2);
        var exit = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 +180, 'button', 4);

        help.setInteractive();
        help.on('pointerup', function () {
            this.createWindow(HelpMenu);
        }, this);

        level1.setInteractive();
        level1.on('pointerdown', () => {
            this.scene.start('level1');
        });
    }

    createWindow(func){
        let winX = this.game.renderer.width/4+40;
        let winY = this.game.renderer.height/4+40
        var win = this.add.zone(winX, winY, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var help_menu = new func("helpMenu", win);
        this.scene.add("helpMenu", help_menu, true);
    }
}