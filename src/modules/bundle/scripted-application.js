import _ from 'lodash';
import { GameService } from '../../services/game-service';
import { NodeVM, VMScript } from 'vm2';

class ScriptedApplication {
    constructor(script, path, dir) {
        this.path = path;
        this.dir = dir;
        this.script = script;
        this.compiled = null;
        this.runtime = null;
        this.vm = null;
        this.namespace = null;
    }

    setupVM(client) {
        this.namespace = GameService.battleRoyaleNamespace.get(client);
        this.vm = new NodeVM({
            console: 'inherit',
            sandbox: {
                GameService,
                br: this.namespace
            },
            require: {
                external: true,
                root: this.dir,
            }
        });
    }

    compile() {
        return new Promise((resolve, reject) => {
            try {
                this.compiled = new VMScript(this.script);
                this.vm.run(this.compiled, this.path);
                resolve(this);
            } catch (err) {
                const scriptError = this.toScriptingError(err);
                reject(scriptError);
            }
        });
    }

    toScriptingError(err) {
        let result;
        const stack = err.stack;
        const matches = (stack === undefined ? null : err.stack.match(/\(vm.js:[0-9]+:[0-9]+\)/g));

        if (!matches) {
            result = err;
        } else {
            result = new Error();
            // const latest = matches.pop();
            const script = `${this.path}`;
            result.stack = stack.replace(/vm.js/g, script);
            // result.stack = `${_.split(stack, latest).shift()}${latest}`.replace(/vm.js/g, script);
        }
        return result;
    }
}


export default ScriptedApplication;