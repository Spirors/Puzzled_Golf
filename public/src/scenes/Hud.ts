export class Hud extends Phaser.Scene{
    private parent;
    private score = 0;
    private level;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    preload(){
        
    }
    create ()
    {
        let scoreText = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#c4a727' });
        let levelText = this.add.text(10, 50, '', { font: '48px Arial', fill: '#c4a727' });
        this.cameras.main.setViewport(0, 0, 0, 0);
        let ourGame = this.scene.get('level1');
        ourGame.events.on('setLevel', function () {
            this.level = 1;
            levelText.setText('Level: ' + this.level);
        }, this);
        ourGame.events.on('addScore', function () {
            this.score += 1;
            scoreText.setText('Score: ' + this.score);
        }, this);
        // console.log(ourGame.events.eventNames);
        this.scene.get('inGameMenu').events.on('goHome', function (){
            console.log('mm');
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