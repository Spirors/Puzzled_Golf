import { Level1 } from "./levels/Level1";
import { Level2 } from "./levels/Level2";
import { Level3 } from "./levels/Level3";
import { Level4 } from "./levels/Level4";
import { Level5 } from "./levels/Level5";
import { Level6 } from "./levels/Level6";
import { Level7 } from "./levels/Level7";
import { Level8 } from "./levels/Level8";
import { Level9 } from "./levels/Level9";
import { Level10 } from "./levels/Level10";
import { Level11 } from "./levels/Level11";
import { Level12 } from "./levels/Level12";
import { Level13 } from "./levels/Level13";
import { Level14 } from "./levels/Level14";
import { Level15 } from "./levels/Level15";
// import { Level16 } from "./levels/Level16";
// import { Level17 } from "./levels/Level17";
// import { Level18 } from "./levels/Level18";

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
        this.load.image("win_bg", "./assets/menu/win_screen.png");
    }
    create ()
    {
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
            if(this.level == 3){
                this.scene.add('level3', Level3, true, {id: 3})
                this.scene.stop();
            }
            if(this.level == 4){
                this.scene.add('level4', Level4, true, {id: 4})
                this.scene.stop();
            }
            if(this.level == 5){
                this.scene.add('level5', Level5, true, {id: 5})
                this.scene.stop();
            }
            if(this.level == 6){
                this.scene.add('level6', Level6, true, {id: 6})
                this.scene.stop();
            }
            if(this.level == 7){
                this.scene.add('level7', Level7, true, {id: 7})
                this.scene.stop();
            }
            if(this.level == 8){
                this.scene.add('level8', Level8, true, {id: 8})
                this.scene.stop();
            }
            if(this.level == 9){
                this.scene.add('level9', Level9, true, {id: 9})
                this.scene.stop();
            }
            if(this.level == 10){
                this.scene.add('level10', Level10, true, {id: 10})
                this.scene.stop();
            }
            if(this.level == 11){
                this.scene.add('level11', Level11, true, {id: 11})
                this.scene.stop();
            }
            if(this.level == 12){
                this.scene.add('level12', Level12, true, {id: 12})
                this.scene.stop();
            }
            if(this.level == 13){
                this.scene.add('level13', Level13, true, {id: 13})
                this.scene.stop();
            }
            if(this.level == 14){
                this.scene.add('level14', Level14, true, {id: 14})
                this.scene.stop();
            }
            if(this.level == 15){
                this.scene.add('level15', Level15, true, {id: 15})
                this.scene.stop();
            }
            // if(this.level == 16){
            //     this.scene.add('level16', Level16, true, {id: 16})
            //     this.scene.stop();
            // }
            // if(this.level == 17){
            //     this.scene.add('level17', Level17, true, {id: 17})
            //     this.scene.stop();
            // }
            // if(this.level == 18){
            //     this.scene.add('level18', Level18, true, {id: 18})
            //     this.scene.stop();
            // }
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
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
            this.scene.remove("hud");
            this.scene.remove("level" + this.level);
            //goto lv2
            if(this.level == 1){
                this.scene.add('level2', Level2, true, {id: 2})
                this.scene.stop();
            }
            //goto lv3
            if(this.level == 2){
                this.scene.add('level3', Level3, true, {id: 3})
                this.scene.stop();
            }
            //goto lv4
            if(this.level == 3){
                this.scene.add('level4', Level4, true, {id: 4})
                this.scene.stop();
            }
            //goto lv5
            if(this.level == 4){
                this.scene.add('level5', Level5, true, {id: 5})
                this.scene.stop();
            }
            //goto lv6
            if(this.level == 5){
                this.scene.add('level6', Level6, true, {id: 6})
                this.scene.stop();
            }
            //goto lv7
            if(this.level == 6){
                this.scene.add('level7', Level7, true, {id: 7})
                this.scene.stop();
            }
            //goto lv8
            if(this.level == 7){
                this.scene.add('level8', Level8, true, {id: 8})
                this.scene.stop();
            }
            //goto lv9
            if(this.level == 8){
                this.scene.add('level9', Level9, true, {id: 9})
                this.scene.stop();
            }
            //goto lv10
            if(this.level == 9){
                this.scene.add('level10', Level10, true, {id: 10})
                this.scene.stop();
            }
            //goto lv11
            if(this.level == 10){
                this.scene.add('level11', Level11, true, {id: 11})
                this.scene.stop();
            }
            //goto lv12
            if(this.level == 11){
                this.scene.add('level12', Level12, true, {id: 12})
                this.scene.stop();
            }
            //goto lv13
            if(this.level == 12){
                this.scene.add('level13', Level13, true, {id: 13})
                this.scene.stop();
            }//goto lv4
            if(this.level == 13){
                this.scene.add('level14', Level14, true, {id: 14})
                this.scene.stop();
            }
            // //goto lv6
            // if(this.level == 14){
            //     this.scene.add('level15', Level15, true, {id: 15})
            //     this.scene.stop();
            // }
            // //goto lv6
            // if(this.level == 15){
            //     this.scene.add('level16', Level16, true, {id: 16})
            //     this.scene.stop();
            // }
            // //goto lv6
            // if(this.level == 16){
            //     this.scene.add('level17', Level17, true, {id: 17})
            //     this.scene.stop();
            // }
            // //goto lv6
            // if(this.level == 17){
            //     this.scene.add('level18', Level18, true, {id: 18})
            //     this.scene.stop();
            // }
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