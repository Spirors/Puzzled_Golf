import { HelpMenu } from "./HelpMenu";
import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from "./Level3";

export class MainMenu extends Phaser.Scene{
    private level1StorageName;
    private level2StorageName;
    private levelHighScore;
    private muted;
    private cheats;

    private cloud;
    private hill;
    private grass;

    constructor(){
        super("mainMenu");
    }
    init(){
        this.muted = false;
        this.cheats = false;
    }
    preload(){
        this.load.spritesheet("button", "../dist/assets/menu_button.png", {frameWidth: 189,
        frameHeight: 37});
        this.load.spritesheet("levels", "../dist/assets/levels.png", {frameWidth: 404,
            frameHeight: 60});
        this.load.image("help_menu", "../dist/assets/help_pop.png");
        this.load.image("exit", "../dist/assets/exit.png");
        this.load.image("menu_boarder", "../dist/assets/main_menu_board.png");
        this.load.spritesheet("sound", "../dist/assets/sound_image.png", {frameWidth: 117, frameHeight: 77});
        this.level1StorageName = "golfLevel1HighScore";
        this.level2StorageName = "golfLevel2HighScore";
        this.load.image("golf_ball", "../dist/assets/golf_ball.png");

        // Todo: Fix preloading
        this.load.image('hole', "../dist/assets/golf_hole.png");
        this.load.image('tiles', '../dist/assets/tileset.png');
        this.load.tilemapTiledJSON('map1', '../dist/assets/level1.json');
        this.load.image('ball', '../dist/assets/ball.png');
        this.load.image('moving_block', "../dist/assets/moving_block.png");

        this.load.image("hills", "../dist/assets/hills.png");
        this.load.spritesheet("golfer", "../dist/assets/male_golfer.png",{frameWidth: 256,
            frameHeight: 256
        });
        
        this.load.audio('hit', '../dist/assets/audio/ball_hit.mp3');
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
        var level1 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 - 50, 'levels', 0);
        var level2 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 + 20, 'levels', 1);
        var level3 = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 + 90, 'levels', 2);
        var exit = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 + 150, 'button', 0);
        var mute = this.add.sprite(this.game.renderer.width/2, this.game.renderer.height/2 + 210, 'sound', 0);
        var cheat_code = this.add.image(this.game.renderer.width/2 - 400,this.game.renderer.height/2 + 210,"golf_ball");
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

        level2.setTint( 1 * 0x737373);
        level3.setTint( 1 * 0x737373);

        if(Number(localStorage.getItem(this.level1StorageName)) < 11){
            level2.setTint( 1 * 0xFFFFFF);
            level2.setInteractive();
        }
        if(Number(localStorage.getItem(this.level2StorageName)) < 11){
            level3.setTint( 1 * 0xFFFFFF);
            level3.setInteractive();
        }

        cheat_code.setInteractive();
        cheat_code.on('pointerdown', function () {
            if(this.cheats){
                if(Number(localStorage.getItem(this.level1StorageName)) > 10){
                    level2.removeInteractive()
                    level2.setTint( 1 * 0x737373);
                }
                if(Number(localStorage.getItem(this.level2StorageName)) > 10){
                    level3.removeInteractive()
                    level3.setTint( 1 * 0x737373);
                }
                this.cheats = false;
            }else{
                level2.setTint( 1 * 0xFFFFFF);
                level2.setInteractive();
                level3.setTint( 1 * 0xFFFFFF);
                level3.setInteractive();
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