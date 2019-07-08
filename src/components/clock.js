import microtime from 'microtime';

class Clock {
    constructor() {
        this.startedAt = null;
        this.stoppedAt = null;
        this.stopDiff = 0;
    }

    start() {
        this.startedAt = microtime.now();
        this.stoppedAt = null;
        this.stopDiff = 0;
    }

    stop() {
        this.stoppedAt = microtime.now();
    }

    resume() {
        this.stopDiff += (microtime.now() - this.stoppedAt);
        this.stoppedAt = null;
    }

    getElapsed() {
        let elapsed;

        if (this.startedAt && !this.stoppedAt) {
            elapsed = microtime.now() - this.startedAt - this.stopDiff;
        } else if (this.stoppedAt) {
            elapsed = this.stoppedAt - this.startedAt - this.stopDiff
        } else {
            elapsed = 0;
        }
        return elapsed;
    }
}

export default Clock;