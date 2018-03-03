// image imports
import overlay from '../img/black.jpg';
import light from '../img/light.png';
import tileImg from '../img/mapTiles.jpg';
import titleImg from '../img/title.png';
import chestImg from '../img/chest.png';

// class imports
import Chest from '../components/Chest';
import Input from '../utils/Input';
import Global from '../utils/Global';
import HUD from '../components/HUD';
import MapGen from '../utils/MapGen';
import Player from '../entities/Player';
import Rectangle from '../utils/Rectangle';
import SoundEngine from '../utils/SoundEngine';
import Sprite from '../entities/Sprite';
import Tilemap from '../components/Tilemap';

class ActionScene {
    constructor() {

        this.curFloor = 1;
        this.playerRoom = -1;
        this.mLayers = {};
        this.floorChests = [];
        this.mInitialized = false;
        this.lightSize = 200;
        this.light = new Sprite(light, this.lightSize, this.lightSize, this.lightSize, this.lightSize, false, 50, 50);        
        this.mapGenerator = new MapGen();
        this.currentMap = null;
        this.player = new Player();
        this.title = null;
        this.hud = new HUD();
    }

    init() {
        let mapW = 40, mapH = 30;
        this.mapGenerator.makeMap( mapW, mapH );
        this.currentMap = new Tilemap( tileImg, 16, 16, this.mapGenerator.getTileData() );
        
        this.addLayer("map");
        this.addToLayer( "map", this.currentMap );

        this.makePlayer();
        this.makeChests();        
        this.makeEnemies();
        this.makeSpotlight();        
        this.makeTitle();

        this.hud.playerHealth = this.player.hp;
        this.hud.floor = this.curFloor;
        this.addLayer( "hud" );
        this.addToLayer( "hud", this.hud );

        SoundEngine.play( "music" );

        this.mInitialized = true;
    }

    makeChests() {
        this.addLayer( "chests" );
        let maxChests = 5;
        let numChests = Math.ceil( Math.random() * maxChests );
        let newChest = null;
        let startPos = null;
        for( let i = 0; i < numChests; ++ i ) {
            startPos = this.mapGenerator.getStartRoomAndPos().pos;
            newChest = new Chest( startPos.x * 16, startPos.y * 16 );
            this.floorChests.push(newChest);
            this.addToLayer( "chests", newChest );
        }
    }

    makeEnemies() {
        this.addLayer("enemies");
    }

    makePlayer() {
        let startStuff = this.mapGenerator.getStartRoomAndPos();
        this.playerRoom = startStuff.room;
        this.player = new Player( startStuff.pos.x * 16, startStuff.pos.y * 16);
        this.player.boundsOffsetX = 7;
        this.player.boundsWidth = 10;
        this.player.init();
        this.addLayer("player");        
        this.addToLayer("player", this.player );
        Global.playerPos = { x: this.player.x, y: this.player.y };
        Global.camera.follow( this.player );        
    }

    makeSpotlight() {
        let blackOverlay = new Sprite(overlay, 320, 240, 320, 240, false, 0, 0);
        blackOverlay.staticPosition = true;

        this.addLayer( "spotLightEffect" );
        this.addToLayer( "spotLightEffect", blackOverlay );
        this.addToLayer( "spotLightEffect", this.light );
        this.addLayerRenderCommand( "spotLightEffect", [
            { cmd: "globalCompositeOperation", value: "destination-in" },
            { cmd: "globalCompositeOperation", value: "normal" }
        ]);
    }

    makeTitle() {
        this.title = new Sprite( titleImg, 480, 80, 160, 80, true, 80, 2 );
        this.title.staticPosition = true;
        this.title.addAnimation( "pulse", [0,1,2,1], 250 );
        this.addLayer( "title" );
        this.addToLayer( "title", this.title );
        this.title.playAnimation("pulse");
    }

    checkCollisions() {
        if( this.currentMap.collides( this.player ) ) {
            this.player.x = this.player.lastX;
            this.player.y = this.player.lastY;
        }

        this.floorChests.map( (chest) => {
            if( chest.isOnScreen() ) {
                if( chest.bounds.overlaps( this.player.bounds ) ) {
                    this.player.x = this.player.lastX;
                    this.player.y = this.player.lastY;
                }
            }
        });
    }

    checkChestClicks() {
        this.floorChests.map( (chest) => {
            if( chest.isOpen != true ) {
                chest.isUnderPoint( Input.mouseClick );
            }
        });
    }

    update( elapsed ) {
        
        if( Input.any() ) {
            this.title.fade( 1.5, false, this.onTitleFadeOutComplete.bind(this) );
        }

        this.checkCollisions();

        this.Layers.map( (layer) => {
            layer.renderables.map( (renderable) => {
                renderable.update( elapsed );
            })
        })

        if( Input.mouseJustPressed( "LEFT_MOUSE" ) ) {
            this.checkChestClicks();
        }

        this.light.x = this.player.x - (this.lightSize * 0.5);
        this.light.y = this.player.y - (this.lightSize * 0.5);
        Global.playerPos.x = this.player.x;
        Global.playerPos.y = this.player.y;
    }


    render( canvasCtx ) {
        this.Layers.map( (layer) => {

            if( layer.renderCommands ) {
                let startCmd = layer.renderCommands[0];
                canvasCtx[startCmd.cmd] = startCmd.value;
            };

            layer.renderables.map( (renderable) => {
                renderable.render( canvasCtx );
            });

            if( layer.renderCommands ) {
                let endCmd = layer.renderCommands[1];
                canvasCtx[endCmd.cmd] = endCmd.value;
            };
        })
    }

    addLayer( name ) {
        this.mLayers[name] = {
            name,
            renderables: []
        };
    }

    addToLayer( layerName, objectToAdd ) {
        if( this.mLayers[ layerName ] ) {
            this.mLayers[ layerName ].renderables.push( objectToAdd );
        }
        else {
            throw new Error( `No layer with the name ${layerName} exists. Object not added.` );
        }
    }

    addLayerRenderCommand( layerName, commands ) {
        if( this.mLayers[layerName] ) {
            this.mLayers[layerName].renderCommands = commands;
        }
        else {
            throw new Error( `No layer with the name ${layerName} exists. Render commands not added.` );
        }
    }

    removeLayer( name ) {
        delete this.mLayers[ name ];
    }

    onTitleFadeOutComplete() {
        this.removeLayer( "title" );
    }
    // Getters
    get initialized() { return this.mInitialized; }
    get Layers() { return Object.values( this.mLayers ); }

}

export default ActionScene;