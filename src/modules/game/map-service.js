class MapService {
    constructor(collections) {
        this.collections = collections;
        this.dropTravelPath = null;
        this.worldSize = { x: 1000.0, y: 1000.0};
        this.generateDropTravelPath();
    }

    generateDropTravelPath() {
        const start = { x: 0, y: 0 };
        const end = { x: 0, y: 0 };
        const mode = Math.floor((Math.random() * Math.floor(100))) % 4;

        switch(mode) {
            case 0: {
                start.x = Math.random();
                start.y = 0;
                end.x = Math.random();
                end.y = 1.0;
                break
            }
            case 1: {
                start.x = 1.0;
                start.y = Math.random();
                end.x = 0;
                end.y = Math.random();
                break
            }
            case 2: {
                start.x = Math.random();
                start.y = 1.0;
                end.x = Math.random();
                end.y = 0;
                break
            }
            case 3: {
                start.x = 0;
                start.y = Math.random();
                end.x = 1.0;
                end.y = Math.random();
                break
            }
            default:
                break;
        }
        this.dropTravelPath = {
            start,
            end,
            vector: { x: end.x - start.x, y: end.y - start.y }
        };
    }
}

export default MapService;
