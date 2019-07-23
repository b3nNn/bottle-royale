import microtime from 'microtime';

class ClockTick {
    constructor(delay) {
        this.startedAt = null;
        this.delay = delay;
        this.lastTick = microtime.now();
    }

    each(callback, otherwise) {
        const now = microtime.now();
        const elapsed = now - this.lastTick;

        if (elapsed >= this.delay) {
            callback();
            this.lastTick = now;
        } else if (otherwise) {
            otherwise();
        }
    }
}

export default ClockTick;