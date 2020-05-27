export class Ball extends Phaser.Physics.Arcade.Sprite {
    // Fields for the ball
    private ball_delta;
    private ball_power;
    private draggable;

    // Fields for indicator line
    private indicator_line : Phaser.Geom.Line;
    private line_length;
    private max_length;
    private min_length;
    private graphics;

    private prevX;
    private prevY;

    private startX; 
    private startY;

    private boolBack = false;
    private boolStart = false;

    private club;
    private ang;

    constructor(config) {
        super(config.scene, config.x, config.y, 'ball');
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.setCircle(16);
        this.setInteractive();
        // this.setCollideWorldBounds(true);
        this.setBounce(1, 1);
        this.scene.input.setDraggable(this);

        this.ball_delta = .97;
        this.ball_power = 1/12;
        this.draggable = true;

        this.prevX = this.x;
        this.prevY = this.y;

        this.startX = this.x;
        this.startY = this.y;

        this.indicator_line = new Phaser.Geom.Line(
            this.x,
            this.y,
            this.x,
            this.y
        );
        this.line_length = 0;
        this.max_length = 120;
        this.min_length = 20;
        this.graphics = this.scene.add.graphics();

        this.scene.children.bringToTop(this.graphics);

        this.on('drag', function (pointer) {
            if (this.draggable == true) {
                var angleToPointer = pointer.getAngle();
                var distXToPointer = pointer.getDistanceX();
                var distYToPointer = pointer.getDistanceY();
                this.line_length = Math.sqrt(distXToPointer * distXToPointer + distYToPointer * distYToPointer);
                if (this.line_length < this.min_length) {
                    this.line_length = 0;
                }
                if (this.line_length > this.max_length) {
                    this.line_length = this.max_length;
                }
                this.changeLine(this.line_length, angleToPointer);
            }
        }, this);

        this.on('dragend', function (pointer) {
            if (this.draggable == true) {
                var angleToPointer = pointer.getAngle();
                let velocity = this.line_length * this.line_length * this.ball_power;
                if (velocity != 0) {
                    this.draggable = false;
                    this.scene.events.emit("addScore");
                    this.changeLine(0, 0);
                    this.shootBall(velocity, angleToPointer);
                }
            }
        }, this);
    }

    update() {
        this.updateLine();
        if(this.boolStart) {
            this.setVelocity(0, 0);
            this.x = this.startX;
            this.y = this.startY;
            this.boolStart = false;
        } else if(this.boolBack) {
            this.setVelocity(0, 0);
            this.x = this.prevX;
            this.y = this.prevY;
            this.boolBack = false;
        } else {
            this.updateBall();
        }
        this.checkDraggable();
    }

    checkDraggable() {
        if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
            this.draggable = true;
        }
    }

    updateBall() {
        // console.log(this.body.velocity.x, this.body.velocity.y);
        if (Math.abs(this.body.velocity.x) < 1 && Math.abs(this.body.velocity.y) < 1) {
            this.setVelocity(0, 0);
        } else {
            this.setVelocity(this.ball_delta * this.body.velocity.x, this.ball_delta * this.body.velocity.y);
        }
    }
    updateLine() {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xffffff, 1);
        this.graphics.strokeLineShape(this.indicator_line);
    }

    changeLine(length, angle) {
        Phaser.Geom.Line.SetToAngle(this.indicator_line, this.x, this.y, angle + Math.PI, length);
    }

    shootBall(velocity, angle) {
        console.log("angle:" + angle);
        this.ang = angle;
        if(angle > -1.2 && angle < 1.3){
            this.club = this.scene.add.sprite(this.x + 30, this.y - 80, "golf_club_left", 0).setScale(4);
            this.scene.anims.create({
                key: "stroke",
                frames: this.scene.anims.generateFrameNumbers("golf_club_left", {start: 0, end: 3}),
                repeat: 0,
                frameRate: 10
            });
        }else if(angle >= 1.7){
            this.club = this.scene.add.sprite(this.x + 15, this.y - 75 , "golf_club_right", 0).setScale(4);
            this.scene.anims.create({
                key: "stroke",
                frames: this.scene.anims.generateFrameNumbers("golf_club_right", {start: 0, end: 3}),
                repeat: 0,
                frameRate: 10
            });
        }else if(angle < -1.2 && angle > - 1.7){
            this.club = this.scene.add.sprite(this.x + 50, this.y + 20 , "golf_club_down", 0).setScale(4);
            this.scene.anims.create({
                key: "stroke",
                frames: this.scene.anims.generateFrameNumbers("golf_club_down", {start: 0, end: 3}),
                repeat: 0,
                frameRate: 10
            });
        }else{
            this.club = this.scene.add.sprite(this.x + 80, this.y - 60 , "golf_club_up", 0).setScale(4);
            this.scene.anims.create({
                key: "stroke",
                frames: this.scene.anims.generateFrameNumbers("golf_club_up", {start: 0, end: 3}),
                repeat: 0,
                frameRate: 10
            });
        }

        this.club.once('animationcomplete', () => {
            console.log('animationcomplete')
            this.club.destroy()
        });

        this.club.removeInteractive();
        this.club.play("stroke");
        // this.club_bool = true;
        this.scene.sound.play("hit");
        this.prevX = this.x;
        this.prevY = this.y;
        console.log(this.prevX, this.prevY);
        this.setVelocity(velocity * -Math.cos(angle), velocity * -Math.sin(angle));
    }

    getVelocityX() {
        return this.body.velocity.x;
    }

    getVelocityY() {
        return this.body.velocity.y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getR() {
        return this.width/2;
    }

    moveBack() {
        var splash = this.scene.add.sprite(this.x,  this.y, "splash_anim", 0).setScale(1.5);
        splash.setOrigin(0.6,0.7);
        this.scene.anims.create({
            key: "splash",
            frames: this.scene.anims.generateFrameNumbers("splash_anim", {start: 0, end: 4}),
                repeat: 0,
                frameRate: 7
            });
    
        splash.once('animationcomplete', () => {
            console.log('animationcomplete')
            splash.destroy()
        });

        splash.removeInteractive();
        splash.play("splash");
        // if(this.ang > 0 && this.ang < 1.3){
        //     var splash = this.scene.add.sprite(this.x - 30,  this.y - 20, "splash_anim", 0).setScale(1.5);
        // }else if(this.ang >= 1.3 && this.ang <= 1.8){
        //     var splash = this.scene.add.sprite(this.x - 10,  this.y - 30, "splash_anim", 0).setScale(1.5);
        // }else if(this.ang > 1.8){
        //     var splash = this.scene.add.sprite(this.x + 40,  this.y - 20, "splash_anim", 0).setScale(1.5);
        // }else if(this.ang <= 0 && this.ang > -1.3){
        //     var splash = this.scene.add.sprite(this.x - 30,  this.y + 20, "splash_anim", 0).setScale(1.5);
        // }else if(this.ang <= 1.3 && this.ang > -1.7){
        //     var splash = this.scene.add.sprite(this.x - 30,  this.y + 20, "splash_anim", 0).setScale(1.5);
        // }else{
        //     var splash = this.scene.add.sprite(this.x + 30,  this.y + 20, "splash_anim", 0).setScale(1.5);
        // }

        this.boolBack = true;

        // if(this.ang > 0 && this.ang < 1.7){
        //     var splash = this.scene.add.sprite(this.x - 30,  this.y + 20, "splash_anim", 0);
        // }else if(this.ang >= 1.7){
        //     var splash = this.scene.add.sprite(this.x + 30,  this.y + 40, "splash_anim", 0);
        // }else if(this.ang < 0 && this.ang > - 1.7){
        //     var splash = this.scene.add.sprite(this.x - 40,  this.y - 10, "splash_anim", 0);
        // }else{
        //     var splash = this.scene.add.sprite(this.x + 30,  this.y - 20, "splash_anim", 0);
        // }

        // this.scene.anims.create({
        //     key: "splash",
        //     frames: this.scene.anims.generateFrameNumbers("splash_anim", {start: 0, end: 4}),
        //         repeat: 0,
        //         frameRate: 7
        // });

        // splash.on('animationcomplete', function(){
        //     console.log("animationcomplete")
        //     splash.destroy();
        // });
        // splash.play("splash");
        var music_config = {
            mute: false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        var water_sound = this.scene.sound.add("water_splash");
        water_sound.play(music_config);
    }

    moveStart() {
        this.boolStart = true;
        var music_config = {
            mute: false,
            volume: 0.3,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }
        var water_sound = this.scene.sound.add("burn_sound");
        water_sound.play(music_config);
    }
    
    setDelta(d) {
        this.ball_delta = d;
    }

    hide(){
        this.setVisible(false);
    }

    stopped() {
        if(this.body.velocity.x == 0 && this.body.velocity.y == 0) {
            return true;
        }
        return false;
    }

    teleport(x, y, stop) {
        if(stop) {
            this.setVelocity(0, 0);
        }
        this.x = x;
        this.y = y;
        this.scene.sound.play("portal_sound");
    }
}   