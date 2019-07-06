const { parentPort, workerData } = require('worker_threads');
const r = require('rethinkdbdash')();

const tableRequireds = [
    'game',
    'behavior'
];

const run = async () => {
    parentPort.postMessage('ready');
    parentPort.on('message', msg => {
        const cmd = msg.split(' ')[0];
        const params = JSON.parse(msg.slice(cmd.length + 1));
        console.log('thread msg', cmd, params);
        switch (cmd) {
            case 'push': {
                r.db('testing').table(params.kind).insert(params.model).run();
                break;
            }
            default:
                break;
        }
    });
}

run();