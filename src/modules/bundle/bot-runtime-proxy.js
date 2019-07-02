import RuntimeProxy from './runtime-proxy';

class BotRuntimeProxy extends RuntimeProxy {
    constructor(runtime) {
        super(runtime)
    }

    ready(client) {
        if (this.runtime.load) {
            this.runtime.ready(client);
        }
    }

    load(client, behavior) {
        if (this.runtime.load) {
            this.runtime.load(client, behavior);
        }
    }
}

export default BotRuntimeProxy;