const nanoseconds = 1;
const milliseconds = 1000;
const seconds = 1000000;
const minutes = seconds * 60;

const Minutes = t => t / minutes;
const Seconds = t => t / seconds;
const Milliseconds = t => t / milliseconds;
const Nanoseconds = t => t;

const toMinutes = m => m * minutes;
const toSeconds = s => s * seconds;
const toMilliseconds = s => s * milliseconds;
const toNanoseconds = s => s * nanoseconds;

export { Minutes, Seconds, Milliseconds, Nanoseconds, toMinutes, toSeconds, toMilliseconds, toNanoseconds };