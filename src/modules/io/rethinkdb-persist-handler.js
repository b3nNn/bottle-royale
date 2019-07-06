import _ from 'lodash';
import PersistHandler from './persist-handler';
import { Worker } from 'worker_threads';
import rethinkdbdash from 'rethinkdbdash';

const r = rethinkdbdash();

const gameWhitelists = [
    'client',
    'player',
    'behavior',
    'matchmaking',
    'client_matchmaking_accept'
];

const tableOptions = {
    'client': { primaryKey: 'id' },
    'player': { primaryKey: 'id' },
    'behavior': { primaryKey: 'id' },
    'matchmaking': { primaryKey: 'id' },
    'client_matchmaking_accept': { primaryKey: 'id' },
};

class RethinkDBPersistHandler extends PersistHandler {
    constructor() {
        super();
        this.worker = null;
    }

    async init() {
        await this.initDatabase();
        await this.initWorker();
    }

    async initDatabase() {
        const dbs = await r.dbList().run();
        if (!dbs.includes('testing')) {
            await r.dbCreate('testing').run();
            tabs.push('testing');
        }
        const tables = await r.db('testing').tableList().run();
        for (let table of gameWhitelists) {
            if (!tables.includes(table)) {
                await r.db('testing').tableCreate(table, tableOptions[table]).run();
            }
        }
    }

    initWorker() {
        return new Promise(resolve => {
            if (!this.worker) {
                this.worker = new Worker('./src/modules/io/rethinkdb-worker.js', { workerData: {} });
                this.worker.on('message', msg => {
                    const cmd = msg.split(' ')[0];
                    const params = msg.slice(cmd.length + 1);
                    // console.log('thread msg', cmd, params);
                    switch (cmd) {
                        case 'ready': {
                            resolve();
                            break;
                        }
                        default:
                            break;
                    }
                });
                this.worker.on('error', console.error);
                this.worker.on('exit', (code) => {
                    this.worker = null;
                });
            }
        });
    }

    push(collection, kind, entry) {
        let obj;
        if (collection === 'game') {
            if (_.includes(gameWhitelists, kind)) {
                obj = this.serialize(entry, kind);
                if (!obj) {
                    console.warn(`cannot serialize ${collection}.${kind}`);
                } else {
                    this.worker.postMessage(`push ${JSON.stringify({
                        collection,
                        kind,
                        model: obj
                    })}`);
                }
            }
            console.log('[RethinkDB] create', collection, kind, obj);
        }
    }

    update(collection, kind, entry) {
        let obj;
        if (collection === 'game') {
            if (_.includes(gameWhitelists, kind)) {
                obj = this.serialize(entry, kind);
                if (!obj) {
                    console.warn(`cannot serialize ${collection}.${kind}`);
                }
            }
            console.log('[RethinkDB] update', collection, kind, obj);
        }
    }

    serialize(entry, key) {
        let serialized;
        if (_.isObject(entry[key]) && _.isFunction(entry[key].serialize)) {
            serialized = entry[key].serialize();
        } else if (_.isObject(entry)) {
            serialized = _.clone(entry);
        }
        return serialized;
    }
}

export default RethinkDBPersistHandler;