import _ from 'lodash';

class EventService {
    constructor(collections) {
        this.collections = collections;
    }

    each(event, callback) {
        _.each(this.collections('game').kind('listener').filter(item => {
            return item.event == event;
        }), listener => {
            callback(listener);
        });
    }

    raise(event, params) {
        _.each(this.collections('game').kind('listener').filter(item => {
            return item.event == event;
        }), listener => {
            listener.callback(params);
        });
    }
}

export default EventService;