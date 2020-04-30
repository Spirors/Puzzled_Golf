import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from "./Level3";

export class winScreen extends Phaser.Scene{
    private parent;
    private menuWidth;
    private menuHeight;
    private score;
    private level;
    private starFrame;
    private levelHighScore;

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
        this.levelHighScore = localStorage.getItem("golfLevel"+ this.level +"HighScore");

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
        let star = this.add.sprite(this.menuWidth/2 , this.menuHeight/2 - 50, "stars", this.starFrame);
        star.setScale(1.5);
        let scoreText = this.add.text(0,0, 'Score - ' + this.score, { font: '20px Arial', fill: '#000000' });
        scoreText.setPosition(this.menuWidth/2 - scoreText.width/2, this.menuHeight/2 + 20)
        let highScoreText = this.add.text(0,0, 'Highscore - ' + this.levelHighScore, { font: '20px Arial', fill: '#000000' });
        highScoreText.setPosition(this.menuWidth/2 - highScoreText.width/2, this.menuHeight/2 + 50);
        var restart = this.add.image(this.menuWidth/2 - 120, this.menuHeight/2 + 100, "button", 5);
        var mainMenu = this.add.image(this.menuWidth/2 + 120, this.menuHeight/2 + 100, "button", 2);
        var nextLevel = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 160, "button", 7);
        let ourGame = this.scene.get("level" + this.level);

        restart.setInteractive();
        mainMenu.setInteractive();
        nextLevel.setTint( 1 * 0x737373);

        if(this.score < 11 || this.levelHighScore < 11 ){
            nextLevel.setInteractive();
            nextLevel.setTint( 1 * 0xffffff);
        }

        this.setHighLight(restart);
        this.setHighLight(mainMenu);
        this.setHighLight(nextLevel);

        restart.on('pointerdown', () => {
            // ourGame.events.off('addScore');
            // ourGame.events.off('setLevel');
            // this.scene.remove("hud");
            // var level = this.scene.get("level" + this.level);
            // level.scene.restart();
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
            this.scene.remove("hud");
            this.scene.remove("level" + this.level);
            if(this.level == 1){
                this.scene.add('level1', Level1, true, {id: 1})
                this.scene.stop();
            }
            if(this.level == 2){
                this.scene.add('level2', Level2, true, {id: 2})
                this.scene.stop();
            }
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
            //stop level 1 goto level2
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
            this.scene.remove("hud");
            this.scene.remove("level" + this.level);
            if(this.level == 1){
                this.scene.add('level2', Level2, true, {id: 2})
                this.scene.stop();
            }
            //implment goto level 3
            if(this.level == 2){
                this.scene.add('level3', Level3, true, {id: 3})
                this.scene.stop();
            }
        });
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