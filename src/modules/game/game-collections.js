import _ from 'lodash';
import { GameService } from '../../services/game-service';

const GameCollections = options => {
    const opts = options || {};

    const persistHandlers = opts.persistHandlers || [];
    const collections = [];
    const ids = {};
    
    const proxyBuilder = (collection) => {
        const updateItem = (kind, entry) => {
            _.each(persistHandlers, handler => handler.update(collection, kind, entry));
        };

        return {
            uid: () => {
                if (!ids[collection]) {
                    ids[collection] = 0;
                }
                return ++ids[collection];
            },
            push: (kind, entry) => {
                collections.push(_.merge({
                    collection: collection,
                    kind: kind
                }, entry));
                _.each(persistHandlers, handler => handler.push(collection, kind, entry));
            },
            kind: kind => {
                return _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            },
            kindUpdate: (kind, callback) => {
                const all = _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
                _.each(all, item => {
                    callback(item);
                    updateItem(kind, item);
                });
            },
            filter: (kind, filter) => {
                return _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind && filter(item) === true) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            },
            filterUpdate: (kind, filter, callback) => {
                const res = _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind && filter(item) === true) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
                _.each(res, item => {
                    if (callback) {
                        callback(item);
                    }
                    updateItem(kind, item);
                });
            },
            filterOne: (kind, filter, callback) => {
                const res = _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind && filter(item) === true) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
                callback(res.length === 0 ? null : res[0]);
            },
            filterOneUpdate: (kind, filter, callback) => {
                const res = _.reduce(collections, (acc, item) => {
                    if (item.collection === collection && item.kind === kind && filter(item) === true) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
                callback(res.length === 0 ? null : res[0]);
                updateItem(kind, res.length === 0 ? null : res[0]);
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

    proxyBuilder.init = async () => {
        for (let handler of persistHandlers) {
            await handler.init({
                debug: GameService.debugPersistence
            });
        }
    }
    return proxyBuilder;
}

export default GameCollections;