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

    filter(event, filter) {
        return _.reduce(this.collections('game').kind('listener'), (acc, item) => {
            if (item.event == event && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
}

export default EventService;