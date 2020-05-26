import { HelpMenu } from './HelpMenu';
import { Level1 } from "./levels/Level1";
import { Level2 } from "./levels/Level2";
import { Level3 } from './levels/Level3';
import { Level4 } from './levels/Level4';
import { Level5 } from './levels/Level5';
import { Level6 } from './levels/Level6';
import { Level7 } from "./levels/Level7";
import { Level8 } from "./levels/Level8";
import { Level9 } from "./levels/Level9";
import { Level10 } from "./levels/Level10";
import { Level11 } from "./levels/Level11";
import { Level12 } from "./levels/Level12";
import { Level13 } from "./levels/Level13";
import { Level14 } from "./levels/Level14";
import { Level15 } from "./levels/Level15";
import { Level16 } from "./levels/Level16";
import { Level17 } from "./levels/Level17";
import { Level18 } from "./levels/Level18";
import { Level19 } from "./levels/Level19";

export class InGameMenu extends Phaser.Scene{
    private parent;
    private menuHeight;
    private menuWidth;
    private muted;
    private level;
    private localStorageName;
    private levelHighScore;
    private music;
    private par;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    init(data){
        this.menuHeight = 510;
        this.menuWidth = 336;
        this.muted = false;
        this.level = data.level;
        this.par = data.par;
        this.localStorageName = "golfLevel" + this.level + "HighScore";
        if(localStorage.getItem(this.localStorageName) == '1000'){
            this.levelHighScore = 'None';
        }else{
            this.levelHighScore = localStorage.getItem(this.localStorageName);
        }
    }
    preload(){
        this.load.image("menu_bg", "./assets/menu/menu_background.png");
        this.load.audio("level_audio", "./assets/audio/level1_audio.mp3");
    }
    create (data)
    {
        //music
        var music_config = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        if(this.level <  7){
            this.music = this.sound.add("level_audio");
        }else if(this.level < 13){
            this.music = this.sound.add("audio2");
        }else{
            music_config = {
                mute: false,
                volume: 0.4,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: true,
                delay: 0
            }

            this.music = this.sound.add("audio3");
        }
        this.music.play(music_config);
        //
        var background = this.add.image(0,0,"menu_bg").setOrigin(0);
        this.cameras.main.setViewport(this.game.renderer.width/2 - 168, this.game.renderer.height/2 - 255, this.menuWidth, this.menuHeight);
        let parNum = this.add.text(0, 0, 'Par: ' + this.par, { font: '75px Arial', fill: '#000000' });
        parNum.setPosition(this.menuWidth/2 - parNum.width/2, this.menuHeight/2 - 180 )
        let highScore = this.add.text(0, 0, 'Highscore: ' + this.levelHighScore, { font: '20px Arial', fill: '#000000' });
        highScore.setPosition(this.menuWidth/2 - highScore.width/2, this.menuHeight/2 - 80 )
        var restart = this.add.image(this.menuWidth/2 , this.menuHeight/2 - 20, "button", 5);
        var mainMenu = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 40, "button", 2);
        var help = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 100, "button", 1);
        var mute = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 160, "sound", 0);
        var exit = this.add.image(this.menuWidth - 57, 35, "exit").setOrigin(0);
        let ourGame = this.scene.get("level" + this.level);
        ourGame.events.on('levelWin', function () {
            this.music.stop();
        }, this);
        mute.setScale(.5);
        
        restart.setInteractive();
        mainMenu.setInteractive();
        help.setInteractive();
        mute.setInteractive();
        exit.setInteractive();

        this.setHighLight(restart);
        this.setHighLight(mainMenu);
        this.setHighLight(help);
        this.setHighLight(mute);
        this.setHighLight(exit);

        exit.on('pointerdown', () => {
            this.scene.resume("level" + this.level);
            this.scene.pause();
            this.scene.setVisible(false);
        });
        
        restart.on('pointerdown', () => {
            this.events.emit('goHome');
            this.scene.remove("hud");
            this.music.stop();
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
            if(this.level == 16){
                this.scene.add('level16', Level16, true, {id: 16})
                this.scene.stop();
            }
            if(this.level == 17){
                this.scene.add('level17', Level17, true, {id: 17})
                this.scene.stop();
            }
            if(this.level == 18){
                this.scene.add('level18', Level18, true, {id: 18})
                this.scene.stop();
            }
            if(this.level == 19){
                this.scene.add('level19', Level19, true, {id: 19})
                this.scene.stop();
            }
            // var level = this.scene.get("level" + this.level);
            // level.scene.restart();
        });
        
        mainMenu.on('pointerdown', () => {
            this.goMainMenu();
        });

        help.on('pointerdown', () => {
            this.scene.pause();
            this.createWindow(HelpMenu,"helpMenu",this.game.renderer.width/2 - 318, this.game.renderer.height/2 - 180);
        });
        
        mute.on('pointerdown', () => {
            if(this.muted){
                this.muted = false;
                this.music.resume()
                mute.setFrame(0);
            }else{
                this.muted = true;
                this.music.pause();
                mute.setFrame(1);
            }
        })   
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }

    createWindow(func, name, x, y){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true);
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff99);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }

    goMainMenu(){
        this.music.stop();
        this.events.emit('goHome');
        this.scene.remove("hud");
        this.scene.remove("level" + this.level);
        this.scene.start("mainMenu");
        this.scene.remove("inGameMenu");
    }
}