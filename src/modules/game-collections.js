import _ from 'lodash';

const GameCollections = () => {
    const collections = [];
    const ids = {};

    const proxy = (collection) => {
        return {
            uid: () => {
                if (!ids[collection]) {
                    ids[collection] = 0;
                }
                return ++ids[collection];
            },
            push: (kind, entry) => {
                collections.push(_.merge(entry, {
                    collection: collection,
                    kind: kind
                }))
            },
            kind: kind => {
                return _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            },
            filter: (kind, filter) => {
                return _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind && filter(item) === true) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            },
            all: () => {
                return _.reduce(collections, (acc, item) => {
                    if (item.collection === collection) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            }
        };
    };

    return proxy;
}

export default GameCollections;