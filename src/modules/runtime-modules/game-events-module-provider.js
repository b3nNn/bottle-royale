import GameEvents from './game-events';
import ModuleProvider from './module-provider';

class GameEventsModuleProvider extends ModuleProvider {
    constructor() {
        super();
    }
    
    get(client) {
        const events = new GameEvents(client);

        return events;
    }

    getName() {
        return 'game';
    }
}

export default GameEventsModuleProvider;