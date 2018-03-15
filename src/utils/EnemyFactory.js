import Skeleton from '../entities/Skeleton';
import Slime from '../entities/Slime';

export default {

    getRandomEnemyWithParams: function( xPos, yPos, lvl, hp, atkSpeed, moveSpeed, strength ) {

        let decider = Math.random() * 100;
        let newEnemy = null;
        if( decider < 50 ) {
            newEnemy = new Slime( xPos, yPos, lvl, hp, atkSpeed, moveSpeed, strength );
        }
        else {
            newEnemy = new Skeleton( xPos, yPos, lvl, hp, atkSpeed, moveSpeed, strength );
        }

        return newEnemy;
    }

}