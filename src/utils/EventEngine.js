export default {
    listeners: {},

    on: function( event, callback ) {
        if( this.listeners[event] == undefined ) {
            this.listeners[event] = [ callback ];
        }
        else {
            this.listeners[event].push( callback );
        }
    },

    off: function( event, callback ) {
        this.listeners[event] = this.listeners[event].filter( (cb) => {
            return cb != callback;
        });
    },

    emit: function( event, params ) {
        if( this.listeners[event] ) {
            this.listeners[event].map( (cb) => {
                cb(params);
            });
        }
    }
}