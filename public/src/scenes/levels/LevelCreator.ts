import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from "../../objects/ball";
import { MovingBlock } from "../../objects/MovingBlock";
import { Portal } from '../../objects/Portal';

export class LevelCreator extends Phaser.Scene {
    private map;
    private mapX;
    private mapY;

    private tileset;

    constructor(key) {
        super(key)
    }

    //------------------------------------------------------------------------------------------
    //Create
    createCore(bk, x, s) {
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, bk).setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : x});
        this.createWindow(Hud, "hud", 0, 0, {level : x, stars: s});
        this.scene.setVisible(false, "inGameMenu");
        this.events.emit('setLevel');
    }
    createWindow(func, name, x, y, data){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true, data);
    }
    createMap(k) {
        this.map = this.make.tilemap({ key: k});
        this.tileset = this.map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = this.map.createStaticLayer('Grass', this.tileset, 0, 0);
        this.mapX = this.game.renderer.width/2 - bgLayer.width/2;
        this.mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(this.mapX, this.mapY);

        return bgLayer;
    }
    createBorder() {
        var borderLayer = this.map.createStaticLayer('Border', this.tileset, 0, 0);
        borderLayer.setPosition(this.mapX, this.mapY);
        borderLayer.setCollisionByExclusion([-1],true);

        return borderLayer;
    }
    createWater(inwater) {
        var waterLayer = this.map.createDynamicLayer('Water', this.tileset, 0, 0);
        waterLayer.setPosition(this.mapX, this.mapY);
        waterLayer.setTileIndexCallback([3,4,5,6,7,8,9,10,11], inwater, this);

        return waterLayer;
    }
    createSand(insand) {
        var sandLayer = this.map.createDynamicLayer('Sand', this.tileset, 0, 0);
        sandLayer.setPosition(this.mapX, this.mapY);
        sandLayer.setTileIndexCallback([21,22,23,24,25,26,27,28,29], insand, this);

        return sandLayer;
    }
    createPlate(onplate, p) {
        var plateLayer = this.map.createDynamicLayer(p, this.tileset, 0, 0);
        plateLayer.setPosition(this.mapX, this.mapY);
        plateLayer.setTileIndexCallback(34, onplate, this);

        return plateLayer;
    }
    createDoor(d) {
        var doorLayer = this.map.createDynamicLayer(d, this.tileset, 0, 0);
        doorLayer.setPosition(this.mapX, this.mapY);
        doorLayer.setCollisionByExclusion([-1],true);

        return doorLayer;
    }
    createLPlate(onLPlate, p) {
        var lplateLayer = this.map.createDynamicLayer(p, this.tileset, 0, 0);
        lplateLayer.setPosition(this.mapX, this.mapY);
        lplateLayer.setTileIndexCallback(35, onLPlate, this);

        return lplateLayer;
    }
    createLaser(inlaser, l) {
        var laserLayer = this.map.createDynamicLayer(l, this.tileset, 0, 0);
        laserLayer.setPosition(this.mapX, this.mapY);
        laserLayer.setTileIndexCallback([37, 38], inlaser, this);

        return laserLayer;
    }
    createBall() {
        var ball;
        var ballLayer = this.map.getObjectLayer('Ball')['objects'];
        ballLayer.forEach(object => {
            ball = new Ball({
                scene : this,
                x : this.mapX + object.x - object.width/2, //x coordnate of ball
                y : this.mapY + object.y - object.height/2 //y coordnate of ball
            });
        });

        return ball;
    }

    createHole() {
        var holeLayer = this.map.getObjectLayer('Hole')['objects'];
        var hole = this.physics.add.staticGroup();
        holeLayer.forEach(object => {
            hole.create(this.mapX + object.x - object.width/2, this.mapY + object.y - object.height/2, "hole"); 
        });
        return hole;
    }

    createMoving(m, velocity, s, e, vert, n) {
        var movingLayer = this.map.getObjectLayer(m)['objects'];
        var moving_blocks = [];
        movingLayer.forEach(object => {
            var moving_block = new MovingBlock({
                scene : this,
                x : this.mapX + object.x - object.width/2, //x coordnate of moving_block
                y : this.mapY + object.y - object.height/2, //y coordnate of moving_block
                v : velocity,
                start : s,
                end : e,
                verticle : vert,
                name : n
            });
            moving_blocks.push(moving_block);
        });
        return moving_blocks;
    }
    createPortal(p, n) {
        var portal;
        var portalLayer = this.map.getObjectLayer(p)['objects'];
        portalLayer.forEach(object => {
            portal = new Portal({
                scene : this,
                x : this.mapX + object.x - object.width/2, //x coordnate of ball
                y : this.mapY + object.y - object.height/2, //y coordnate of ball
                name : n
            });
        });
        return portal;
    }
    //------------------------------------------------------------------------------------------
}