export class SplashScreen extends Phaser.Scene{
    private cloud;
    private hill;
    private grass;

    constructor(){
        super("splashScreen");
    }
    init(){

    }
    preload(){
        this.load.image("logo", "../dist/assets/puzzled_golf_logo.png");
 
        this.load.image("clouds", "../dist/assets/clouds.png");
        this.load.image("hills", "../dist/assets/hills.png");
        this.load.image("ground", "../dist/assets/ground.png");
    }
    create(){
        this.cameras.main.setBackgroundColor(0x9ce1e1);

        var game_width = this.game.renderer.width;
        var game_height = this.game.renderer.height;

        this.cloud = this.add.tileSprite(0,0, game_width, game_height, "clouds").setScale(1.37);
        this.hill = this.add.tileSprite(0,0, game_width, game_height, 'hills').setScale(1.37);
        this.grass = this.add.tileSprite(0,0, game_width, game_height, 'ground').setScale(1.37);
        
        this.cloud.setOrigin(0,0);
        this.hill.setOrigin(0,0);
        this.grass.setOrigin(0,0);


        var game_logo = this.add.image(this.game.renderer.width/2,this.game.renderer.height * 0.35,"logo");
        game_logo.setScale(0.9);

        let text = this.add.text(this.game.renderer.width/2 - 200,this.game.renderer.height * 0.85, "[Press Here To Continue]",
        { fontSize: '30px', color : '#957f1d'}) //c4a727
        text
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            text.setStyle({ fill: '#d9bd3f'}); //ffff66
        })
        .on('pointerout', () => {
            text.setStyle({ fill: '#957f1d'});
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