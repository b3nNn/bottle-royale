import _ from 'lodash';
import Player from '../runtime-modules/player';
import Vehicule from './vehicule';

class TravelPlane extends Vehicule {
    constructor() {
        super(100, 100);
    }

    enterPlayer(seatSlotsIndex, player) {
        if (player instanceof Player) {
            player.vehicule = this;
            this.seatSlots[seatSlotsIndex] = {
                ID: player.ID
            };
        }
    }
}

export default TravelPlane;