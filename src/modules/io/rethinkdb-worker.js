const { parentPort, workerData } = require('worker_threads');
const r = require('rethinkdbdash')();
const { parse } = require('flatted/cjs');
const serverID = workerData.serverID;

const run = async () => {
    parentPort.postMessage('ready');
    parentPort.on('message', async msg => {
        const idx = msg.indexOf(' ');
        const cmd = msg.substr(0, idx);
        const params = parse(msg.substr(idx + 1));
        switch (cmd) {
            case 'insert': {
                await r.db('testing').table(params.kind).insert(params.model).run();
                break;
            }
            case 'update': {
                let filter;
                let getAll;
                switch(params.kind) {
                    case 'client': {
                        getAll = {
                            index: 'remote_id',
                            params: [serverID, params.model.clientID]
                        };
                        break;
                    }
                    case 'matchmaking': {
                        getAll = {
                            index: 'remote_id',
                            params: [serverID, params.model.matchmakingID]
                        };
                        break;
                    }
                    case 'behavior': {
                        getAll = {
                            index: 'remote_id',
                            params: [serverID, params.model.behaviorID]
                        };
                        break;
                    }
                    case 'player': {
                        getAll = {
                            index: 'remote_id',
                            params: [serverID, params.model.playerID]
                        };
                        break;
                    }
                    case 'game_object': {
                        getAll = {
                            index: 'remote_id',
                            params: [serverID, params.model.gameObjectID]
                        };
                        break;
                    }
                    case 'client_matchmaking_accept': {
                        serverID
                        break;
                    }
                    default:
                        break;
                }
                if (filter) {
                    await r.db('testing').table(params.kind).filter(filter).update(params.model).run();
                } else if (getAll) {
                    await r.db('testing').table(params.kind).getAll(getAll.params, {index: getAll.index}).update(params.model).run();
                }
                break;
            }
            default:
                break;
        }
    });
}

run();