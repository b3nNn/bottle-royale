const { parentPort, workerData } = require('worker_threads');
const r = require('rethinkdbdash')();

const serverID = workerData.serverID;

const run = async () => {
    parentPort.postMessage('ready');
    parentPort.on('message', msg => {
        const cmd = msg.split(' ')[0];
        const params = JSON.parse(msg.slice(cmd.length + 1));
        switch (cmd) {
            case 'insert': {
                r.db('testing').table(params.kind).insert(params.model).run();
                break;
            }
            case 'update': {
                let filter;
                switch(params.kind) {
                    case 'client': {
                        filter = {
                            clientID: params.model.clientID,
                            serverID
                        };
                        break;
                    }
                    case 'matchmaking': {
                        filter = {
                            matchmakingID: params.model.matchmakingID,
                            serverID
                        };
                        break;
                    }
                    case 'behavior': {
                        filter = {
                            behaviorID: params.model.behaviorID,
                            serverID
                        };
                        break;
                    }
                    case 'player': {
                        filter = {
                            playerID: params.model.playerID,
                            serverID
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
                    r.db('testing').table(params.kind).filter(filter).update(params.model).run();
                }
                break;
            }
            default:
                break;
        }
    });
}

run();