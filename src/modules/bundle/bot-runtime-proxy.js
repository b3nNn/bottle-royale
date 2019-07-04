import RuntimeProxy from './runtime-proxy';

class BotRuntimeProxy extends RuntimeProxy {
    constructor(runtime) {
        super(runtime)
    }

    ready(client) {
        if (this.runtime.ready) {
            this.runtime.ready(client);
        }
    }

    load(client, behavior) {
        if (this.runtime.load) {
            this.runtime.load(client, behavior);
        }
    }

    start(client, behavior) {
        if (this.runtime.start) {
            this.runtime.start(client, behavior);
        }
    }

    death(client, behavior) {
        if (this.runtime.death) {
            this.runtime.death(client, behavior);
        }
    }

    update(client, behavior) {
        if (this.runtime.update) {
            this.runtime.update(client, behavior);
        }
    }
}

export default BotRuntimeProxy;