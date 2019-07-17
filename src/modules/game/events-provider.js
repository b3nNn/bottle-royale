import _ from 'lodash';

class EventsProvider {
    constructor(collections, kind) {
        this.kind = kind;
        this.collections = collections;
    }

    on(event, callback, params) {
        this.collections('runtime').push(this.kind, {
            event,
            callback,
            params
        });
    }

    off(client, event) {
        
    }

    each(event, callback) {
        _.each(this.collections('runtime').kind(this.kind).filter(item => {
            return item.event == event;
        }), listener => {
            callback(listener);
        });
    }

    fire(event, params) {
        this.each(event, listener => {
            listener.callback(params);
        });
    }

    fireFilter(event, filter, params) {
        _.each(this.filter(event, filter), listener => {
            listener.callback(params);
        });
    }

    filter(event, filter) {
        return _.reduce(this.collections('runtime').kind(this.kind), (acc, item) => {
            if (item.event == event && filter(item) === true) {
                acc.push(item);
            }
            return acc;
        }, []);
    }
}

export default EventsProvider;