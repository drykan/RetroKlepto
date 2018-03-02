// image imports
import overlay from '../img/black.jpg';
import light from '../img/light.png';
import tileImg from '../img/mapTiles.jpg';

// class imports
import Input from '../utils/Input';
import Global from '../utils/Global';
import MapGen from '../utils/MapGen';
import Player from '../entities/Player';
import Rectangle from '../utils/Rectangle';
import Sprite from '../entities/Sprite';
import Tilemap from '../components/Tilemap';

class ActionScene {
    constructor() {

        this.mLayers = {};
        this.mInitialized = false;
        this.lightSize = 200;
        this.light = new Sprite(light, this.lightSize, this.lightSize, this.lightSize, this.lightSize, false, 50, 50);        
        this.mapGenerator = new MapGen();
        this.currentMap = null;
        this.player = new Player();
    }

    init() {
        let mapW = 40, mapH = 30;
        this.mapGenerator.makeMap( mapW, mapH );
        this.currentMap = new Tilemap( tileImg, 16, 16, this.mapGenerator.getTileData() );
        
        this.addLayer("map");
        this.addToLayer( "map", this.currentMap );

        let startStuff = this.mapGenerator.getStartRoomAndPos();
        this.player = new Player( startStuff.pos.x * 16, startStuff.pos.y * 16);
        this.player.boundsOffsetX = 7;
        this.player.boundsWidth = 10;
        this.player.init();
        this.addLayer("player");        
        this.addToLayer("player", this.player );
        Global.camera.follow( this.player );

        this.addLayer("enemies");

        /* */
        let blackOverlay = new Sprite(overlay, 320, 240, 320, 240, false, 0, 0);
        blackOverlay.staticPosition = true;

        this.addLayer( "spotLightEffect" );
        this.addToLayer( "spotLightEffect", blackOverlay );
        this.addToLayer( "spotLightEffect", this.light );
        this.addLayerRenderCommand( "spotLightEffect", [
            { cmd: "globalCompositeOperation", value: "destination-in" },
            { cmd: "globalCompositeOperation", value: "normal" }
        ]);
        

        this.mInitialized = true;
    }

    update( elapsed ) {
        
        if( this.currentMap.collides( this.player ) ) {
            this.player.x = this.player.lastX;
            this.player.y = this.player.lastY;
        }

        this.Layers.map( (layer) => {
            layer.renderables.map( (renderable) => {
                renderable.update( elapsed );
            })
        })

        this.light.x = this.player.x - (this.lightSize * 0.5);
        this.light.y = this.player.y - (this.lightSize * 0.5);        
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

    // Getters
    get initialized() { return this.mInitialized; }
    get Layers() { return Object.values( this.mLayers ); }

}

export default ActionScene;