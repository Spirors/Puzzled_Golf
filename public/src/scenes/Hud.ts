import { winScreen } from './WinScreen';

export class Hud extends Phaser.Scene{
    private parent;
    private stroke = 0;
    private level;
    private levelText;
    private localStorageName;
    private levelHighScore;
    private menu;
    private par;

    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    init(data){
        this.level = data.level;
        this.par = data.par;
    }
    create ()
    {
        let scoreText = this.add.text(10, 10, 'Stroke: ' + this.stroke, { font: '48px Arial', fill: '#c4a727' });
        this.levelText = this.add.text(10, 50, '', { font: '48px Arial', fill: '#c4a727' });
        let parText = this.add.text(10, 90, 'Par: ' + this.par, { font: '48px Arial', fill: '#c4a727' });
        this.cameras.main.setViewport(0, 0, this.game.renderer.width, this.game.renderer.height);
        let ourGame = this.scene.get("level" + this.level);
        this.levelText.setText('Level: ' + this.level);
        this.localStorageName = "golfLevel" + this.level + "HighScore";
        ourGame.events.on('addScore', function () {
            this.stroke += 1;
            scoreText.setText('Stroke: ' + this.stroke);
        }, this);
        //menu button
        this.menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 3);
        this.menu.setInteractive();
        this.setHighLight(this.menu);
        this.menu.on('pointerup', function () {
            this.menu.setTint( 1 * 0xffffff);
            this.scene.pause("level" + this.level);
            this.scene.resume("inGameMenu");
            this.scene.setVisible(true, "inGameMenu");
        }, this)

        this.levelHighScore = localStorage.getItem(this.localStorageName) == null ? 1000 :
                              localStorage.getItem(this.localStorageName);
        ourGame.events.on('levelWin', function () {
            this.sound.play("ball_in_hole_sound");
            console.log("level win");
            this.menu.removeInteractive();
            var score = this.stroke - this.par;
            let newHighscore = Math.min(score, this.levelHighScore);
            localStorage.setItem(this.localStorageName, newHighscore.toString());
            this.events.emit('createWinScreen', {score: score});
            if(this.scene.manager.getScene("winScreen") == null){
                this.createWindow(winScreen,"winScreen",this.game.renderer.width/2, this.game.renderer.height/2, {level : this.level, score : score, par : this.par});
            }
            this.sound.play("win_music");
            console.log(this);
        }, this);
        this.scene.get('inGameMenu').events.on('goHome', function (){
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
        })
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff66);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }

    createWindow(func, name, x, y, data){
        console.log("create wind");
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true, data);
    }
}