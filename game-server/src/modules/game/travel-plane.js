import _ from 'lodash';
import Vehicule from './vehicule';

class TravelPlane extends Vehicule {
    constructor() {
        super(100, 100);
    }

    enterPlayer(seatSlotsIndex, player) {
        player.vehicule = this;
        this.seatSlots[seatSlotsIndex] = {
            ID: player.ID
        };
    }

    exitPlayer(player) {
        const idx = _.findIndex(this.seatSlots, slot => slot.ID === player.ID);
        if (idx >= 0) {
            this.seatSlots.splice(idx, 1);
        }
        player.vehicule = null;
    }
}

export default TravelPlane;