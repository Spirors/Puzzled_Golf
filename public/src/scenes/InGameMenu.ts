import { HelpMenu } from './HelpMenu';
import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from './Level3';

export class InGameMenu extends Phaser.Scene{
    private parent;
    private menuHeight;
    private menuWidth;
    private muted;
    private level;
    private localStorageName;
    private levelHighScore;
    private starFrame;
    private music;
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
        this.localStorageName = "golfLevel" + this.level + "HighScore";
        if(localStorage.getItem(this.localStorageName) == '1000'){
            this.levelHighScore = 'None';
        }else{
            this.levelHighScore = localStorage.getItem(this.localStorageName);
        }
        if(this.levelHighScore == 'None'){
            this.starFrame = 0;
        }else if (Number(this.levelHighScore) <= 3) {
            this.starFrame = 3;
        }else if(Number(this.levelHighScore) > 3 && Number(this.levelHighScore) <= 6){
            this.starFrame = 2;
        }else if(Number(this.levelHighScore) > 6 && Number(this.levelHighScore) <= 10){
            this.starFrame = 1;
        }else{
            this.starFrame = 0;
        }
    }
    preload(){
        this.load.image("menu_bg", "./assets/menu_background.png");
        this.load.spritesheet("stars", "./assets/star_sprites.png", {frameWidth: 258, frameHeight: 68})
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

        this.music = this.sound.add("level_audio");
        this.music.play(music_config);
        //
        var background = this.add.image(0,0,"menu_bg").setOrigin(0);
        this.cameras.main.setViewport(this.game.renderer.width/2 - 168, this.game.renderer.height/2 - 255, this.menuWidth, this.menuHeight);
        let star = this.add.sprite(this.menuWidth/2 , this.menuHeight/2 -140, "stars", this.starFrame);
        let highScore = this.add.text(0, 0, 'Highscore - ' + this.levelHighScore, { font: '20px Arial', fill: '#000000' });
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