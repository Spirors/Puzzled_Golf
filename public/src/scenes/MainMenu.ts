import { HelpMenu } from "./HelpMenu";
import { Level1 } from "./Level1";

export class MainMenu extends Phaser.Scene{
    private level1StorageName;
    private level2StorageName;
    private levelHighScore;
    constructor(){
        super("mainMenu");
    }
    init(){

    }
    preload(){
        this.load.spritesheet("button", "../dist/assets/menu_button.png", {frameWidth: 189,
        frameHeight: 37});
        this.load.spritesheet("levels", "../dist/assets/levels.png", {frameWidth: 404,
            frameHeight: 60});
        this.load.image("help_menu", "../dist/assets/help_pop.png");
        this.load.image("exit", "../dist/assets/exit.png");
        this.level1StorageName = "golfLevel1HighScore";
    }
    create(){

        var help = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 - 120, 'button', 1);
        var level1 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2, 'levels', 0);
        var level2 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 +60, 'levels', 1);
        var level3 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 +120, 'levels', 2);
        var exit = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 +180, 'button', 0);

        level2.setTint( 1 * 0x737373);
        level3.setTint( 1 * 0x737373);

        if(Number(localStorage.getItem(this.level1StorageName)) < 11){
            level2.setTint( 1 * 0xFFFFFF);
            level2.setInteractive();
        }

        help.setInteractive();
        help.on('pointerup', function () {
            this.createWindow(HelpMenu);
        }, this);

        level1.setInteractive();
        level1.on('pointerdown', () => {
            var newScene = this.scene.add('level1', Level1, true, {id: 1});
            this.scene.stop();
        });
        level2.on('pointerdown', () => {
            console.log("level2");
        });
        
        

        exit.setInteractive();
        exit.on('pointerdown', () => {
            this.scene.start("splashScreen")
        });
    }

    createWindow(func){
        let winX = this.game.renderer.width/4+40;
        let winY = this.game.renderer.height/4+40
        var win = this.add.zone(winX, winY, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var help_menu = new func("helpMenu", win);
        this.scene
        .add("helpMenu", help_menu, true);
    }
}