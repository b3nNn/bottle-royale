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

    load(matchmaking) {
        if (this.runtime.load) {
            this.runtime.load(matchmaking);
        }
    }

    start(player) {
        if (this.runtime.start) {
            this.runtime.start(player);
        }
    }

    update(time) {
        if (this.runtime.update) {
            this.runtime.update(time);
        }
    }
}

export default BotRuntimeProxy;