import TravelPlane from '../modules/game/travel-plane';

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

VehiculeService.$inject = ['Collections'];

export default VehiculeService;