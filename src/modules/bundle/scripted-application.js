import _ from 'lodash';
import { GameService } from '../../services/game-service';

const { NodeVM, VMScript } = require('vm2');

const modules = {
    'location': process.cwd() + '/src/modules/runtime-modules/player-location.js',
    'player': process.cwd() + '/src/modules/runtime-modules/player.js',
    'client': process.cwd() + '/src/modules/runtime-modules/client.js',
    'game-events': process.cwd() + '/src/modules/runtime-modules/game-events.js',
    'storm-events': process.cwd() + '/src/modules/runtime-modules/storm.js',
}
class ScriptedApplication {
    constructor(script, path, dir) {
        this.path = path;
        this.dir = dir;
        this.script = script;
        this.compiled = null;
        this.runtime = null;
        this.vm = null;
    }

    setupVM(client) {
        this.vm = new NodeVM({
            console: 'off',
            // sandbox: GameService.clientModules.get(client),
            require: {
                external: {
                    modules: [
                        'location',
                        'player',
                        'client',
                        'game-events',
                        'storm-events'
                    ]
                },
                builtin: ['*'],
                import: ['game-events'],
                // root: this.dir,
                resolve: (name, params) => {
                    console.log('test resolve', name, modules[name]);
                    if (modules[name]) {
                        return modules[name];
                    }
                    // console.log('test resolve', name, __dirname + '/../runtime-modules/player-location.js');
                    // return __dirname + '/../runtime-modules/player-location.js';
                }
            }
        });
        this.vm.run("require('location')", __filename + '/../runtime-modules/player-location.js');
    }

    compile() {
        return new Promise((resolve, reject) => {
            try {
                this.compiled = new VMScript(this.script);
                this.vm.run(this.compiled, this.path);
                resolve(this);
            } catch (err) {
                console.error('Failed to compile script.', this.path, err);
                reject(err);
            }
        });
    }

    toScriptingError(err) {
        let result;
        const matches = err.stack.match(/\(vm.js:[0-9]+:[0-9]+\)/g);

        if (!matches) {
            result = err;
        } else {
            const latest = matches.pop();
            const script = `${this.path}`;
            result = `${_.split(err.stack, latest).shift()}${latest}`.replace(/vm.js/g, script);
        }
        return result;
    }
}


export default ScriptedApplication;