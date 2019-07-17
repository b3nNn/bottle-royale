import EventsProvider from '../modules/game/events-provider';

class EventsFactory {
    constructor(collections) {
        this.collections = collections;
    }

    createProvider(name) {
        return new EventsProvider(this.collections, name);
    }
}
EventsFactory.$inject = ['Collections'];

export default EventsFactory;