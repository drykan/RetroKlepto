export default {
    range: function( min, max ) {
        return Math.floor( min + ( Math.random() * (max - min) ) );
    }
}