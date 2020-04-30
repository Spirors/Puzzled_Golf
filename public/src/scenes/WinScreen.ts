export class winScreen extends Phaser.Scene{
    private parent;
    private menuWidth;
    private menuHeight;
    private score;
    private level;
    private starFrame;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    init(data){
        this.level = data.level;
        this.score = data.score;
        this.menuHeight = 409;
        this.menuWidth = 626;

        if (this.score <= 3) {
            this.starFrame = 3;
        }else if(this.score > 3 && this.score <= 6){
            this.starFrame = 2;
        }else if(this.score > 6 && this.score <= 10){
            this.starFrame = 1;
        }else{
            this.starFrame = 0;
        }
    }
    preload(){
        this.load.image("win_bg", "../dist/assets/win_screen.png");
    }
    create ()
    {
        // console.log(this.score);
        // console.log(this.starFrame);
        var background = this.add.image(0,0,"win_bg").setOrigin(0);
        this.cameras.main.setViewport(this.game.renderer.width/2 - this.menuWidth/2, this.game.renderer.height/2 - this.menuHeight/2, this.menuWidth, this.menuHeight);
        let star = this.add.sprite(this.menuWidth/2 , this.menuHeight/2 - 80, "stars", this.starFrame);
        star.setScale(1.5);
        var restart = this.add.image(this.menuWidth/2 - 120, this.menuHeight/2 + 100, "button", 5);
        var mainMenu = this.add.image(this.menuWidth/2 + 120, this.menuHeight/2 + 100, "button", 2);
        var nextLevel = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 160, "button", 7);
        let ourGame = this.scene.get("level" + this.level);

        restart.setInteractive();
        mainMenu.setInteractive();
        nextLevel.setInteractive();

        this.setHighLight(restart);
        this.setHighLight(mainMenu);
        this.setHighLight(nextLevel);

        restart.on('pointerdown', () => {
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
            this.scene.remove("hud");
            var level = this.scene.get("level" + this.level);
            level.scene.restart();
        });

        mainMenu.on('pointerdown', () => {
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
            this.scene.remove("level" + this.level);
            this.scene.start("mainMenu");
            this.scene.remove("inGameMenu");
            this.scene.remove("hud");
            this.scene.remove("winScreen");
        });

        nextLevel.on('pointerdown', () => {
            
        });

        //go back to mainmenu
        // console.log("highscore:", localStorage.getItem(this.localStorageName))
        // ourGame.events.off('addScore');
        // ourGame.events.off('setLevel');
        // this.scene.remove("level" + this.level);
        // this.scene.start("mainMenu");
        // this.scene.remove("inGameMenu");
        // this.scene.remove("hud");
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff99);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }
}