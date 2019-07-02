import GameService from '../../services/game-service';

const { NodeVM, VMScript } = require('vm2');

class ScriptedApplication {
    constructor(script, path, dir) {
        this.path = path;
        this.dir = dir;
        this.script = script;
        this.compiled = null;
        this.runtime = null;
        this.vm = new NodeVM({
            console: 'inherit',
            sandbox: GameService.sandbox,
            require: {
                external: true,
                builtin: ['path'],
                root: this.dir,
                mock: {
                    fs: {
                        readFileSync() { return 'Nice try!'; }
                    }
                }
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
}


export default ScriptedApplication;