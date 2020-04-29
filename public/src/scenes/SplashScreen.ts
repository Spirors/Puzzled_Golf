export class SplashScreen extends Phaser.Scene{
    constructor(){
        super("splashScreen");
    }
    init(){
        localStorage.setItem("golfLevel" + 1 + "HighScore", "1000");
    }
    preload(){
        this.load.image("logo", "../dist/assets/puzzled_golf_logo.png");
    }
    create(){
        this.add.image(this.game.renderer.width/2,this.game.renderer.height * 0.35,"logo");
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
}