import _ from 'lodash';
import Player from '../runtime-modules/player';

class TravelPlane {
    constructor() {
        this.seatSlots = [];
        for (let it = 0; it < 100; it++) {
            this.seatSlots[it] = null;
        }
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