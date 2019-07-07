import GameEvents from './game-events';
import ModuleProvider from './module-provider';

class GameEventsModuleProvider extends ModuleProvider {
    constructor() {
        super();
    }
    
    get(client) {
        const events = new GameEvents(client);

        return {
            'game-events': events
        }
    }
}

export default GameEventsModuleProvider;