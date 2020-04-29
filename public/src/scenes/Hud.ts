export class Hud extends Phaser.Scene{
    private parent;
    private score = 0;
    private level;
    private levelText;
    private localStorageName;
    private levelHighScore;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    init(data){
        this.level = data.level;
    }
    preload(){
        
    }
    create ()
    {
        let scoreText = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#c4a727' });
        this.levelText = this.add.text(10, 50, '', { font: '48px Arial', fill: '#c4a727' });
        this.cameras.main.setViewport(0, 0, 0, 0);
        let ourGame = this.scene.get('level1');
        this.levelText.setText('Level: ' + this.level);
        this.localStorageName = "golfLevel" + this.level + "HighScore";
        ourGame.events.on('addScore', function () {
            this.score += 1;
            scoreText.setText('Score: ' + this.score);
        }, this);
        this.levelHighScore = localStorage.getItem(this.localStorageName) == null ? 0 :
                              localStorage.getItem(this.localStorageName);
        ourGame.events.on('levelWin', function () {
            let newHighscore = Math.min(this.score, this.levelHighScore);
            localStorage.setItem(this.localStorageName, newHighscore.toString());
            //go back to mainmenu
            console.log("highscore:", localStorage.getItem(this.localStorageName))
            ourGame.events.off('addScore');
            ourGame.events.off('setLevel');
            this.scene.remove("level1");
            this.scene.start("mainMenu");
            this.scene.remove("inGameMenu");
            this.scene.remove("hud");
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
}