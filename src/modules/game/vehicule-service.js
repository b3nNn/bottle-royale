import TravelPlane from './travel-plane';
import { GameService } from '../../services/game-service';

class VehiculeService {
    constructor(collections) {
        this.collections = collections;
    }

    createTravelPlane() {
        const plane = new TravelPlane();
        plane.ID = this.collections('game.travel_plane').uid();
        this.collections('game').push('travel_plane', {
            serverID: GameService.serverID,
            planeID: plane.ID,
            plane
        });
        return plane;
    }
}

export default VehiculeService;