export default {
    soundData: null,
    sounds: {},
    isInitialized: false,

    init: function( data ) {
        this.soundData = data;
        let cur = null;
        for( let soundName in this.soundData.sounds ) {
            cur = this.soundData.sounds[soundName];
            this.sounds[soundName] = new Audio( cur.file );
            this.sounds[soundName].loop = cur.loop;
        }

        this.isInitialized = true;
    },

    play: function( soundName ) {
        if( this.sounds[soundName] && !this.sounds[soundName].isPlaying ) {
            this.sounds[soundName].play();
        }
        else {
            console.log( `No sound with the name "${soundName}" was found.`);
        }
    },

    stop: function( soundName ) {
        if( this.sounds[soundName] && this.sounds[soundName].isPlaying ) {
            this.sounds[soundName].stop();
        }
        else {
            console.log( `No sound with the name "${soundName}" was found.`);
        }
    },

    pause: function( soundName ) {
        if( this.sounds[soundName] && this.sounds[soundName].isPlaying ) {
            this.sounds[soundName].pause();
        }
        else {
            console.log( `No sound with the name "${soundName}" was found.`);
        }
    }
}