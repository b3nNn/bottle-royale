import _ from 'lodash';
import PersistHandler from './persist-handler';
import { Worker } from 'worker_threads';
import rethinkdbdash from 'rethinkdbdash';
import { GameService } from '../../services/game-service';
import { stringify } from 'flatted';

const gameWhitelists = [
    'server',
    'client',
    'player',
    'player_location',
    'storm',
    'behavior',
    'matchmaking',
    'game_object',
    'client_matchmaking_accept'
];

const tableOptions = r => {
    return {
        'server': {
            primaryKey: 'id'
        },
        'client': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('clientID')]
                }
            ]
        },
        'player': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('playerID')]
                }
            ]
        },
        'player_location': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('locationID')]
                }
            ]
        },
        'storm': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('stormID')]
                }
            ]
        },
        'behavior': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('behaviorID')]
                }
            ]
        },
        'matchmaking': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('matchmakingID')]
                }
            ]
        },
        'game_object': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID'],
            compoundIndexes: [
                {
                    name: 'remote_id',
                    params: [r.row('serverID'), r.row('gameObjectID')]
                }
            ]
        },
        'client_matchmaking_accept': {
            primaryKey: 'id',
            secondaryIndexes: ['serverID']
        },
    }
};

class RethinkDBPersistHandler extends PersistHandler {
    constructor(options) {
        const opts = options || {};
        super();
        this.worker = null;
        this.serverID = null;
        this.r = null;
        this.debug = opts.debug;
        this.tableOpts = null;
    }

    async init() {
        this.r = rethinkdbdash();
        this.tableOpts = tableOptions(this.r);
        this.serverID = GameService.serverID;
        await this.initDatabase();
        await this.initWorker();
    }

    async initDatabase() {
        const r = this.r;
        const dbs = await r.dbList().run();
        if (!dbs.includes('testing')) {
            await r.dbCreate('testing').run();
            tabs.push('testing');
        }
        const tables = await r.db('testing').tableList().run();
        for (let table of gameWhitelists) {
            if (!tables.includes(table)) {
                await r.db('testing').tableCreate(table, this.tableOpts[table]).run();
            }
            const indexes = await r.db('testing').table(table).indexList().run();
            if (this.tableOpts[table].compoundIndexes) {
                const indexes = await r.db('testing').table(table).indexList().run();
                for (let index of this.tableOpts[table].compoundIndexes) {
                    if (!indexes.includes(index.name)) {
                        await r.db('testing').table(table).indexCreate(index.name, index.params).run();
                        await r.db('testing').table(table).indexWait(index.name);
                    }
                }
            }
            if (this.tableOpts[table].secondaryIndexes) {
                for (let index of this.tableOpts[table].secondaryIndexes) {
                    if (!indexes.includes(index)) {
                        await r.db('testing').table(table).indexCreate(index).run();
                        await r.db('testing').table(table).indexWait(index);
                    }
                }
            }
        }
    }

    initWorker() {
        return new Promise(resolve => {
            if (!this.worker) {
                this.worker = new Worker('./src/modules/io/rethinkdb-worker.js', { workerData: { serverID: this.serverID} });
                this.worker.on('message', msg => {
                    const cmd = msg.split(' ').pop();
                    
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
        }).catch(err => {});
    }

    push(collection, kind, entry) {
        let obj;
        if (collection === 'game') {
            if (_.includes(gameWhitelists, kind)) {
                obj = this.serialize(entry, kind);
                if (!obj) {
                    console.warn(`cannot serialize ${collection}.${kind}`);
                } else {
                    if (this.debug) {
                        console.log(`[RethinkDB] insert ${stringify({
                            collection,
                            kind,
                            model: obj
                        })}`);
                    }
                    this.worker.postMessage(`insert ${stringify({
                        collection,
                        kind,
                        model: obj
                    })}`);
                }
            }
        }
    }

    update(collection, kind, entry) {
        let obj;
        if (collection === 'game') {
            if (_.includes(gameWhitelists, kind)) {
                obj = this.serialize(entry, kind);
                if (!obj) {
                    console.warn(`cannot serialize ${collection}.${kind}`);
                } else {
                    if (this.debug) {
                        console.log(`[RethinkDB] update ${stringify({
                            collection,
                            kind,
                            model: obj
                        })}`);
                    }
                    this.worker.postMessage(`update ${stringify({
                        collection,
                        kind,
                        model: obj
                    })}`);
                }
            }
        }
    }

    serialize(entry, kind) {
        let serialized;
        const key = _.camelCase(kind);
        if (_.isObject(entry[key]) && _.isFunction(entry[key].serialize)) {
            serialized = entry[key].serialize();
        } else if (_.isObject(entry)) {
            serialized = _.clone(entry);
        }
        return serialized;
    }
}

export default RethinkDBPersistHandler;