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

    start(player, game) {
        if (this.runtime.start) {
            this.runtime.start(player, game);
        }
    }

    update(time) {
        if (this.runtime.update) {
            this.runtime.update(time);
        }
    }
}

export default BotRuntimeProxy;