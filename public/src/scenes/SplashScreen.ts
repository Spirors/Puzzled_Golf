export class SplashScreen extends Phaser.Scene{
    private cloud;
    private hill;
    private grass;

    constructor(){
        super("splashScreen");
    }
    init(){
        localStorage.setItem("golfLevel" + 1 + "HighScore", "1000");
    }
    preload(){
        this.load.image("logo", "../dist/assets/puzzled_golf_logo.png");
 
        this.load.image("clouds", "../dist/assets/clouds.png");
        this.load.image("hills", "../dist/assets/hills.png");
        this.load.image("ground", "../dist/assets/ground.png");
    }
    create(){
        this.cameras.main.setBackgroundColor(0x9ce1e1);

        // this.hill = this.add.image(0, 0, "hills");
        // this.hill.setOrigin(0, 0);
        var game_width = this.game.renderer.width;
        var game_height = this.game.renderer.height;

        // this.hill.setDisplaySize(game_width, game_height);

        // this.grass = this.add.image(0, 0, "ground");
        // this.grass.setOrigin(0, 0);
        // this.grass.setDisplaySize(game_width, game_height);
        this.cloud = this.add.tileSprite(0,0, game_width, game_height, "clouds");
        this.hill = this.add.tileSprite(0,0, game_width, game_height, 'hills');
        this.grass = this.add.tileSprite(0,0, game_width, game_height, 'ground');
        
        this.cloud.setOrigin(0,0);
        this.hill.setOrigin(0,0);
        this.grass.setOrigin(0,0);

        var game_logo = this.add.image(this.game.renderer.width/2,this.game.renderer.height * 0.35,"logo");

        let text = this.add.text(this.game.renderer.width/2 - 200,this.game.renderer.height * 0.8, "[Press Here To Continue]",
        { fontSize: '30px', color : '#c4a727'})
        text
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            text.setStyle({ fill: '#ffff66'});
        })
        .on('pointerout', () => {
            text.setStyle({ fill: '#c4a727'});
        })
        .on('pointerdown', () => {
            this.scene.start('mainMenu');
        });
    }

    update(){
        this.cloud.tilePositionX -= 0.6;
        this.hill.tilePositionX -= 0.85;
        
    }
}