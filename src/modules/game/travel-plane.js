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

    exitPlayer(player) {
        if (player instanceof Player) {
            const idx = _.findIndex(this.seatSlots, slot => slot.ID === player.ID);
            if (idx >= 0) {
                this.seatSlots.splice(idx, 1);
            }
            player.vehicule = null;
        }
    }
}

export default TravelPlane;