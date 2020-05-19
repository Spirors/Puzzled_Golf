import { HelpMenu } from "./HelpMenu";
import { Level1 } from "./levels/Level1";
import { Level2 } from "./levels/Level2";
import { Level3 } from "./levels/Level3";

export class MainMenu extends Phaser.Scene{
    private muted;
    private cheats;

    private cloud;
    private hill;
    private grass;

    private levelArray = new Array();

    constructor(){
        super("mainMenu");
    }
    init(){
        this.muted = false;
        this.cheats = false;
    }
    preload(){
        this.load.spritesheet("button", "./assets/menu/menu_button.png", {frameWidth: 189, frameHeight: 37});
        this.load.spritesheet("levels", "./assets/menu/level_buttons.png", {frameWidth: 58, frameHeight: 54});
        this.load.image("help_menu", "./assets/menu/help_pop.png");
        this.load.image("exit", "./assets/menu/exit.png");
        this.load.image("menu_boarder", "./assets/menu/main_menu_board.png");
        this.load.spritesheet("sound", "./assets/menu/sound_image.png", {frameWidth: 117, frameHeight: 77});
        this.load.image("golf_ball", "./assets/golf_ball.png");

        // For the level
        this.load.image('hole', "./assets/obj/golf_hole.png");
        this.load.image('tiles', './assets/map/tileset.png');
        this.load.image('ball', './assets/obj/ball.png');

        this.load.image("hills", "./assets/background/hills.png");
        this.load.spritesheet("golfer", "./assets/male_golfer.png",{frameWidth: 256, frameHeight: 256});
        
        this.load.audio('hit', './assets/audio/ball_hit.mp3');
        this.load.audio('wall_bounce','./assets/audio/sound_effects/wall_bounce.mp3'); 
        this.load.audio('ball_in_hole','./assets/audio/sound_effects/ball_in_hole.mp3'); 
        this.load.audio('win_music', './assets/audio/sound_effects/win_music.mp3'); 
        this.load.audio('water_splash', './assets/audio/sound_effects/water_splash.mp3'); 

    }
    create(){
        this.cameras.main.setBackgroundColor(0x9ce1e1);//sky background color 

        var game_width = this.game.renderer.width;
        var game_height = this.game.renderer.height;

        //add background layers 
        this.cloud = this.add.tileSprite(0,0, game_width, game_height, "clouds").setScale(1.37);
        this.hill = this.add.tileSprite(0,0, game_width, game_height, "hills").setScale(1.37);
        this.grass = this.add.tileSprite(0,0, game_width, game_height, "ground").setScale(1.37);
        
        this.cloud.setOrigin(0,0);
        this.hill.setOrigin(0,0);
        this.grass.setOrigin(0,0);

        //person walking animation 
        const person = this.add.sprite(this.game.renderer.width/2 - 500, this.game.renderer.height * 0.55, "golfer", 0).setScale(2);
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("golfer", {start: 0, end: 3}),
            repeat: -1,
            frameRate: 5
        });
        person.play("walk");

        //music
        if(this.scene.manager.getScene("level3") != null){
            this.scene.remove("level3");
        }
        var music_config = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        console.log(this.scene.manager.keys);
        var music = this.sound.add("summer");
        music.play(music_config);
        //
        var main_menu_boarder = this.add.image(0,0, 'menu_boarder').setOrigin(0);
        main_menu_boarder.setPosition(this.game.renderer.width/2 - main_menu_boarder.width/2, this.game.renderer.height/2 - main_menu_boarder.height/2);
        var help = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 - 110, 'button', 1);
        var exit = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 + 150, 'button', 0);
        var mute = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 + 210, 'sound', 0);
        var cheat_code = this.add.image(this.game.renderer.width/2 - 400,this.game.renderer.height/2 + 210,"golf_ball");

        //levels
        var level1 = this.add.sprite(this.game.renderer.width/2 - 200, this.game.renderer.height/2 - 50, 'levels', 0);
        var level2 = this.add.sprite(this.game.renderer.width/2 - 120, this.game.renderer.height/2 - 50, 'levels', 1);
        var level3 = this.add.sprite(this.game.renderer.width/2 - 40, this.game.renderer.height/2 - 50, 'levels', 2);
        var level4 = this.add.sprite(this.game.renderer.width/2 + 40, this.game.renderer.height/2 - 50, 'levels', 3);
        var level5 = this.add.sprite(this.game.renderer.width/2 + 120, this.game.renderer.height/2 - 50, 'levels', 4);
        var level6 = this.add.sprite(this.game.renderer.width/2 + 200, this.game.renderer.height/2 - 50, 'levels', 5);
        var level7 = this.add.sprite(this.game.renderer.width/2 - 200, this.game.renderer.height/2 + 20, 'levels', 6);
        var level8 = this.add.sprite(this.game.renderer.width/2 - 120, this.game.renderer.height/2 + 20, 'levels', 7);
        var level9 = this.add.sprite(this.game.renderer.width/2 - 40, this.game.renderer.height/2 + 20, 'levels', 8);
        var level10 = this.add.sprite(this.game.renderer.width/2 + 40, this.game.renderer.height/2 + 20, 'levels', 9);
        var level11 = this.add.sprite(this.game.renderer.width/2 + 120, this.game.renderer.height/2 + 20, 'levels', 10);
        var level12 = this.add.sprite(this.game.renderer.width/2 + 200, this.game.renderer.height/2 + 20, 'levels', 11);
        var level13 = this.add.sprite(this.game.renderer.width/2 - 200, this.game.renderer.height/2 + 90, 'levels', 12);
        var level14 = this.add.sprite(this.game.renderer.width/2 - 120, this.game.renderer.height/2 + 90, 'levels', 13);
        var level15 = this.add.sprite(this.game.renderer.width/2 - 40, this.game.renderer.height/2 + 90, 'levels', 14);
        var level16 = this.add.sprite(this.game.renderer.width/2 + 40, this.game.renderer.height/2 + 90, 'levels', 15);
        var level17 = this.add.sprite(this.game.renderer.width/2 + 120, this.game.renderer.height/2 + 90, 'levels', 16);
        var level18 = this.add.sprite(this.game.renderer.width/2 + 200, this.game.renderer.height/2 + 90, 'levels', 17);

        this.levelArray = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11,
            level12, level13, level14, level15, level16, level17, level18];

        cheat_code.setScale(.3);
        mute.setScale(.5);
        mute.setInteractive();
        mute.on('pointerdown', () => {
            if(this.muted){
                this.muted = false;
                music.resume();
                mute.setFrame(0);
            }else{
                this.muted = true;
                music.pause();
                mute.setFrame(1);
            }
        })   

        this.setHighLight(help);
        this.setHighLight(exit);
        for(var i = 1; i < this.levelArray.length; i++){
            if(Number(localStorage.getItem("golfLevel" + i + "HighScore")) < 11){
                this.levelArray[i].setTint( 1 * 0xFFFFFF);
                this.levelArray[i].setInteractive();
            }else{
                this.levelArray[i].setTint( 1 * 0x737373);
            }
        }

        cheat_code.setInteractive();
        cheat_code.on('pointerdown', function () {
            if(this.cheats){
                for(var i = 1; i < this.levelArray.length; i++){
                    if(Number(localStorage.getItem("golfLevel" + i + "HighScore")) > 10){
                        this.levelArray[i].removeInteractive()
                        this.levelArray[i].setTint( 1 * 0x737373);
                    }
                }
                this.cheats = false;
            }else{
                for(var i = 1; i < this.levelArray.length; i++){
                    this.levelArray[i].setTint( 1 * 0xFFFFFF);
                    this.levelArray[i].setInteractive();
                }
                this.cheats = true;
            }
        }, this);

        help.setInteractive();
        help.on('pointerdown', function () {
            this.createWindow(HelpMenu);
        }, this);

        level1.setInteractive();
        level1.on('pointerdown', () => {
            var newScene = this.scene.add('level1', Level1, true, {id: 1});
            music.stop();
            this.scene.stop();
        });
        level2.on('pointerdown', () => {
            var newScene = this.scene.add('level2', Level2, true, {id: 2});
            music.stop();
            this.scene.stop();
        });
        level3.on('pointerdown', () => {
            var newScene = this.scene.add('level3', Level3, true, {id: 3});
            music.stop();
            this.scene.stop();
        });
        
        exit.setInteractive();
        exit.on('pointerdown', () => {
            music.stop();
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

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff99);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }

    update(){
        this.cloud.tilePositionX += 0.6;
        this.hill.tilePositionX += 0.85;
    }
}