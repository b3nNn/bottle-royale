import microtime from 'microtime';

class Clock {
    private started: boolean;
    private stopped: boolean;
    private startedAt: number;
    private stoppedAt: number;
    private stopDiff: number;

    constructor() {
        this.started = false;
        this.stopped = false;
        this.startedAt = 0;
        this.stoppedAt = 0;
        this.stopDiff = 0;
    }

    start() {
        this.started = true;
        this.startedAt = microtime.now();
        this.stoppedAt = 0;
        this.stopDiff = 0;
    }

    stop() {
        this.stopped = true;
        this.stoppedAt = microtime.now();
    }

    resume() {
        this.stopped = false;
        this.stopDiff += (microtime.now() - this.stoppedAt);
        this.stoppedAt = 0;
    }

    getElapsed() {
        let elapsed;

        if (this.started && !this.stopped) {
            elapsed = microtime.now() - this.startedAt - this.stopDiff;
        } else if (this.stopped) {
            elapsed = this.stoppedAt - this.startedAt - this.stopDiff
        } else {
            elapsed = 0;
        }
        return elapsed;
    }
}

export default Clock;