import _ from 'lodash';
import GameService from '../../services/game-service';

const { NodeVM, VMScript } = require('vm2');

class ScriptedApplication {
    constructor(script, path, dir) {
        this.path = path;
        this.dir = dir;
        this.script = script;
        this.compiled = null;
        this.runtime = null;
        this.vm = null;
    }

    setup(client) {
        this.vm = new NodeVM({
            console: 'off',
            sandbox: {},
            require: {
                external: true,
                builtin: ['path'],
                root: this.dir,
                mock: GameService.clientModules(client)
            }
        });
    }

    compile() {
        return new Promise((resolve, reject) => {
            try {
                this.compiled = new VMScript(this.script);
                this.runtime = this.vm.run(this.compiled, this.path);
                this.loadRuntime(this.runtime);
                resolve(this);
            } catch (err) {
                console.error('Failed to compile script.', this.path, err);
                reject(err);
            }
        });
    }

    loadRuntime(runtime) {}

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