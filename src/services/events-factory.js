import EventEmitter from '../modules/game/events-emitter';

class EventsFactory {
    constructor(collections) {
        this.collections = collections;
    }

    createProvider(name) {
        return new EventEmitter(this.collections, name);
    }
}
EventsFactory.$inject = ['Collections'];

export default EventsFactory;