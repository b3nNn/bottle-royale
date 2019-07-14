const seconds = 1000000;
const milliseconds = 1000;
const nanoseconds = 1;

const Seconds = t => t / seconds;
const Milliseconds = t => t / milliseconds;
const Nanoseconds = t => t;

const toSeconds = s => s * seconds;
const toMilliseconds = s => s * milliseconds;
const toNanoseconds = s => s * nanoseconds;

export { Seconds, Milliseconds, Nanoseconds, toSeconds, toMilliseconds, toNanoseconds };