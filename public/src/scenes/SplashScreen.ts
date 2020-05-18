export class SplashScreen extends Phaser.Scene{
    private cloud;
    private grass;
    private music;

    constructor(){
        super("splashScreen");
    }
    init(){

    }
    preload(){
        this.load.image("logo", "./assets/puzzled_golf_logo.png");
 
        this.load.image("clouds", "./assets/background/clouds.png");
        this.load.image("hills", "./assets/background/hills.png");
        this.load.image("ground", "./assets/background/ground.png");

        this.load.audio("summer", "./assets/audio/bensound-summer.mp3");
        this.load.spritesheet("windmill", "./assets/background/windmill.png",{frameWidth: 256,
            frameHeight: 256
        });
    }
    create(){
        localStorage.setItem("golfLevel1HighScore", "1000");
        localStorage.setItem("golfLevel2HighScore", "1000");
        localStorage.setItem("golfLevel3HighScore", "1000");
        localStorage.setItem("golfLevel4HighScore", "1000");
        localStorage.setItem("golfLevel5HighScore", "1000");
        localStorage.setItem("golfLevel6HighScore", "1000");
        localStorage.setItem("golfLevel7HighScore", "1000");
        localStorage.setItem("golfLevel8HighScore", "1000");
        localStorage.setItem("golfLevel9HighScore", "1000");
        localStorage.setItem("golfLevel10HighScore", "1000");
        localStorage.setItem("golfLevel11HighScore", "1000");
        localStorage.setItem("golfLevel12HighScore", "1000");
        localStorage.setItem("golfLevel13HighScore", "1000");
        localStorage.setItem("golfLevel14HighScore", "1000");
        localStorage.setItem("golfLevel15HighScore", "1000");
        localStorage.setItem("golfLevel16HighScore", "1000");
        localStorage.setItem("golfLevel17HighScore", "1000");
        localStorage.setItem("golfLevel18HighScore", "1000");
        
        var game_width = this.game.renderer.width;
        var game_height = this.game.renderer.height;

        //add background layers 
        this.cameras.main.setBackgroundColor(0x9ce1e1);//sky background color 
        this.cloud = this.add.tileSprite(0,0, game_width, game_height, "clouds").setScale(1.37);
        this.grass = this.add.tileSprite(0,0, game_width, game_height, "ground").setScale(1.37);
        
        this.cloud.setOrigin(0,0);
        this.grass.setOrigin(0,0);

        //windmill animation
        const mill = this.add.sprite(this.game.renderer.width - 200, this.game.renderer.height * 0.55, "windmill", 0).setScale(2);
        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("windmill", {start: 0, end: 1}),
            repeat: -1,
            frameRate: 5
        });
        mill.play("rotate");

        //audio 
        var music_config = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.music = this.sound.add("summer");
        this.music.play(music_config);

        //statics (logo and click here)
        var game_logo = this.add.image(this.game.renderer.width/2,this.game.renderer.height * 0.35,"logo");
        game_logo.setScale(0.9);

        let text = this.add.text(this.game.renderer.width/2 - 200,this.game.renderer.height * 0.85, "[Press Here To Continue]",
        { fontSize: '30px', color : '#000000', fontStyle: 'bold'}) //c4a727
        text
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            text.setStyle({ fill: '#FFFFFF'}); //ffff66
        })
        .on('pointerout', () => {
            text.setStyle({ fill: '#000000'});
        })
        .on('pointerdown', () => {
            this.music.stop();
            this.scene.start('mainMenu');
        });

        
    }

    update(){
        //background layers scroll (clouds scroll slower than hill)
        this.cloud.tilePositionX += 0.6;
        
    }
}