// image imports
import overlay from '../img/black.jpg';
import light from '../img/light.png';
import tileImg from '../img/mapTiles.jpg';
import titleImg from '../img/title.png';
import ladderImg from '../img/ladderDown.png';
import descendImg from '../img/descendMsg.png';

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
import LootDisplay from '../components/LootDisplay';
import Slime from '../entities/Slime';
import EventEngine from '../utils/EventEngine';
import Random from '../utils/Random';

const HIT_DIST = 26;

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
        this.ladder = null;
        this.isDescending = false;
        this.descendSprite = new Sprite( descendImg, 320, 240, 320, 240, false, 0, 0 );
        this.descendSprite.alpha = 0;
        this.showingLoot = false;
        this.gameOver = false;
        this.gameOverLootDisplay = new LootDisplay();
        this.gameOverLootDisplay.isGameOverDisplay = true;
        this.floorEnemies = [];

        this.hurtPlayer = this.hurtPlayer.bind(this);
        EventEngine.on( "playerHit", this.hurtPlayer );
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
        //this.makeSpotlight();
        this.makeTitle();

        let ladderPos = this.mapGenerator.getStartRoomAndPos();
        while( ladderPos.room == this.playerRoom ) {
            ladderPos = this.mapGenerator.getStartRoomAndPos();
        }
        this.ladder = new Sprite( ladderImg, 16, 16, 16, 16, false, ladderPos.pos.x * 16, ladderPos.pos.y * 16 );
        this.addToLayer( "map", this.ladder );

        this.addLayer( "lootDisplay" );

        this.hud.playerHealth = this.player.hp;
        this.hud.floor = this.curFloor;
        this.addLayer( "hud" );
        this.addToLayer( "hud", this.hud );

        this.descendSprite.staticPosition = true;
        this.addLayer( "descend" );
        this.addToLayer( "descend", this.descendSprite );

        SoundEngine.play( "music" );

        this.mInitialized = true;
    }

    doDescend() {
        this.clearLayer( "map" );
        this.clearLayer( "chests" );
        this.clearLayer( "enemies" );

        this.floorChests = [];
        this.floorEnemies = [];

        let mapW = 40, mapH = 30;
        this.mapGenerator.makeMap( mapW, mapH );
        this.currentMap = new Tilemap( tileImg, 16, 16, this.mapGenerator.getTileData() );        
        this.addToLayer( "map", this.currentMap );

        let playerStartInfo = this.mapGenerator.getStartRoomAndPos();
        this.playerRoom = playerStartInfo.room;
        this.player.x = playerStartInfo.pos.x * 16;
        this.player.y = playerStartInfo.pos.y * 16;

        this.makeChests();
        this.makeEnemies();

        let ladderPos = this.mapGenerator.getStartRoomAndPos();
        while( ladderPos.room == this.playerRoom ) {
            ladderPos = this.mapGenerator.getStartRoomAndPos();
        }
        this.ladder = new Sprite( ladderImg, 16, 16, 16, 16, false, ladderPos.pos.x * 16, ladderPos.pos.y * 16 );
        this.addToLayer( "map", this.ladder );

        this.curFloor++;
        this.hud.floor = this.curFloor;
    }

    makeChests() {
        this.addLayer( "chests" );
        let maxChests = 5;
        let numChests = Math.ceil( Math.random() * maxChests );
        let newChest = null;
        let startPos = null;
        let maxRarityLvl = 5;//(this.curFloor + 2 <= 5) ? this.curFloor + 2 : 5;

        for( let i = 0; i < numChests; ++i ) {
            startPos = this.mapGenerator.getStartRoomAndPos().pos;
            newChest = new Chest( startPos.x * 16, startPos.y * 16, maxRarityLvl );
            this.floorChests.push(newChest);
            this.addToLayer( "chests", newChest );
        }
    }

    makeEnemies() {
        this.addLayer("enemies");
        let newEnemy = null;
        let startInfo = this.mapGenerator.getStartRoomAndPos();
        let limit =  Random.range( this.curFloor + 2, this.curFloor + 8 );
        for( let i = 0; i < limit; ++i ) {
            while( startInfo.room == this.playerRoom ) {
                startInfo = this.mapGenerator.getStartRoomAndPos();
            }

            newEnemy = new Slime( startInfo.pos.x * 16, startInfo.pos.y * 16, 1, 3, 1200, 0.03, 1 );
            this.addToLayer( "enemies", newEnemy );
            this.floorEnemies.push( newEnemy );
            startInfo = this.mapGenerator.getStartRoomAndPos();
        }
    }

    makePlayer() {
        let startStuff = this.mapGenerator.getStartRoomAndPos();
        this.playerRoom = startStuff.room;
        this.player = new Player( startStuff.pos.x * 16, startStuff.pos.y * 16, 5);
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
        if( this.isDescending != true ) {
            if( this.currentMap.collides( this.player ) ) {
                this.player.x = this.player.lastX;
                this.player.y = this.player.lastY;
            }

            this.floorEnemies.map( (enemy) => {
                if( enemy.isOnScreen() && this.currentMap.collides( enemy ) ) {
                    enemy.x = enemy.lastX;
                    enemy.y = enemy.lastY;
                }
            });

            this.floorEnemies.forEach( (enemy) => {
                if( enemy.isAlive && enemy.isOnScreen() ) {
                    if( enemy.isUnderPoint( Input.mouseClick ) && Input.mouseJustPressed( "LEFT_MOUSE" ) ) {
                        let hitChance = Math.random() * 100;
                        if( hitChance > 12 ) {
                            enemy.damage( 1 );
                            SoundEngine.play( "enemyHit" );
                        }
                        else {
                            SoundEngine.play( "miss" );
                        }
                    }
                }
            });

            if( this.ladder.bounds.overlaps( this.player.bounds ) ) {
                // descend
                this.isDescending = true;
                Input.lock();
                SoundEngine.play( "steps" );
                this.descendSprite.fade( 1.5, 1, 0, true, this.onDescendFadeIn.bind(this) );
            }
        }
    }

    onDescendFadeIn() {
        this.doDescend();
        this.descendSprite.fade(1.5, 0, 1, true, this.onDescendFadeOut.bind(this) );        
    }

    onDescendFadeOut() {
        Input.unlock();
        this.isDescending = false;
    }

    checkChestClicks() {
        this.floorChests.map( (chest) => {
            if( chest.isOpen != true ) {
                if( chest.isUnderPoint( Input.mouseClick ) ) {
                    let dist = Math.distance( this.player.midPoint, chest.midPoint );
                    if( dist <= HIT_DIST ) {
                        chest.open();
                        let loot = new LootDisplay();
                        loot.Game = chest.contents;
                        this.player.loot.push( chest.contents );
                        this.clearLayer( "lootDisplay" );
                        this.addToLayer( "lootDisplay", loot );
                        this.showingLoot = true;
                    }
                }
            }
        });
    }

    hurtPlayer( damageValue ) {
        this.player.damage( damageValue );
        this.hud.playerHealth = this.player.hp;
        if( this.player.isAlive != true ) {
            this.gameOver = true;
            this.player.alpha = 0;
        }
    }

    update( elapsed ) {
        if( Input.any() ) {
            this.title.fade( 1.5, 0, 1, false, this.onTitleFadeOutComplete.bind(this) );
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

        if( this.showingLoot && Input.isKeyDown( "SPACE" ) ) {
            this.showingLoot = false;
            this.clearLayer( "lootDisplay" );
        }

        if( Input.justPressed("H") ) {
            this.hurtPlayer(1);
        }

        if( this.gameOver == true ) {
            if( this.mLayers[ "collection" ] == null ) {
                this.addLayer( "collection" );
                if( this.player.loot.length > 0 ) {
                    this.gameOverLootDisplay.Game = this.player.getLootItem();
                }
                this.addToLayer( "collection", this.gameOverLootDisplay );
            }

            if( Input.justPressed( "RIGHT" ) ){
                this.gameOverLootDisplay.Game = this.player.getNextLootItem();
            }
            else if( Input.justPressed( "LEFT" ) ){
                this.gameOverLootDisplay.Game = this.player.getPrevLootItem();
            }
        }

        this.light.x = this.player.x - (this.lightSize * 0.5);
        this.light.y = this.player.y - (this.lightSize * 0.5);
        let playerMidPt = this.player.midPoint;
        Global.playerPos.x = playerMidPt.x;
        Global.playerPos.y = playerMidPt.y;
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
        if( !this.mLayers[name] ) {
            this.mLayers[name] = {
                name,
                renderables: []
            };
        }
        else {
            console.log(`A layer with the name ${name} already exists. No new layer was created.`);
        }
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

    removeFromLayer( name, obj ) {
        this.mLayers[name].renderables = this.mLayers[name].renderables.filter( (item) => { return item == obj } );
    }

    clearLayer( name ) {
        this.mLayers[name].renderables.map( (item) => {
            item.destroy();
            item = null;
        });
        this.mLayers[name].renderables = [];
    }

    onTitleFadeOutComplete() {
        this.removeLayer( "title" );
    }
    // Getters
    get initialized() { return this.mInitialized; }
    get Layers() { return Object.values( this.mLayers ); }

}

export default ActionScene;