import gameData from '../data/GameData.json';
import Random from '../utils/Random';

export default {
    all: gameData.games,

    getGameByRarity: function( rareLvl ) {
        rareLvl = rareLvl || 1;

        if( rareLvl < 1 ) {
            rareLvl = 1;
        }
        if( rareLvl > 5 ) {
            rareLvl = 5;
        }

        let targetGames = this.all.filter( (game) => {
            return game.rarity == rareLvl;
        });

        return targetGames[ Random.range(0, targetGames.length) ];
    }
};