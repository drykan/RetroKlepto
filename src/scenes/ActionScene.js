import Sprite from '../entities/Sprite';
import bgImg from '../img/bgTest.jpg';
import overlay from '../img/black.jpg';
import light from '../img/light.png';

import Input from '../utils/Input';

class ActionScene {
    constructor() {

        this.mLayers = {};
        this.mInitialized = false;
        this.light = new Sprite(light, 115, 115, 115, 115, false, 50, 50);
    }

    init() {
        this.addLayer( "background" );
        this.addToLayer( "background", new Sprite(bgImg, 320, 240, 320, 240, false, 0, 0) );

        this.addLayer( "spotLightEffect" );
        this.addToLayer( "spotLightEffect", new Sprite(overlay, 320, 240, 320, 240, false, 0, 0) );
        this.addToLayer( "spotLightEffect", this.light );
        this.addLayerRenderCommand( "spotLightEffect", [
            { cmd: "globalCompositeOperation", value: "destination-in" },
            { cmd: "globalCompositeOperation", value: "normal" }
        ]);

        this.mInitialized = true;
    }

    update( elapsed ) {
        this.Layers.map( (layer) => {
            layer.sprites.map( (sprite) => {
                sprite.update( elapsed );
            })
        })

        /** TODO: Remove this test code later **/
        if( Input.isKeyDown( "A" ) || Input.isKeyDown( "LEFT" ) ) {
            if( this.light.x > 0 ) {
                this.light.x -= 0.5;
            }
        }
        else if( Input.isKeyDown( "D" ) || Input.isKeyDown( "RIGHT" ) ) {
            if( this.light.x < 320 - 115 ) {
                this.light.x += 0.5;
            }
        }

        if( Input.isKeyDown( "W" ) || Input.isKeyDown( "UP" ) ) {
            if( this.light.y > 0 ) {
                this.light.y -= 0.5;
            }
        }
        else if( Input.isKeyDown( "S" ) || Input.isKeyDown( "DOWN" ) ) {
            if( this.light.y < 240 - 115 ) {
                this.light.y += 0.5;
            }
        }
        /** END TEST CODE **/
    }

    addLayer( name ) {
        this.mLayers[name] = {
            name,
            sprites: []
        };
    }

    addToLayer( layerName, objectToAdd ) {
        if( this.mLayers[ layerName ] ) {
            this.mLayers[ layerName ].sprites.push( objectToAdd );
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
            throw new Error( `No layer with the name ${layerNamea} exists. Render commands not added.` );
        }
    }

    // Getters
    get initialized() { return this.mInitialized; }
    get Layers() { return Object.values( this.mLayers ); }

}

export default ActionScene;