import _ from 'lodash';
// import { GameService } from '../../services/game-service';
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

    setupVM(namespace) {
        this.namespace = namespace;
        this.vm = new NodeVM({
            console: 'inherit',
            sandbox: {
                // GameService,
                br: this.namespace
            },
            require: {
                external: true,
                root: this.dir,
            }
        });
    }

    async compile() {
        try {
            this.compiled = new VMScript(this.script);
            await this.vm.run(this.compiled, this.path);
            return this;
        } catch (err) {
            const scriptError = this.toScriptingError(err);
            throw scriptError;
        }
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