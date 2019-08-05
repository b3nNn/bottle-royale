const nanoseconds = 1;
const milliseconds = 1000;
const seconds = 1000000;
const minutes = seconds * 60;
const hours = minutes * 60;

const Hours = (t: number): number => t / hours;
const Minutes = (t: number): number => t / minutes;
const Seconds = (t: number): number => t / seconds;
const Milliseconds = (t: number): number => t / milliseconds;
const Nanoseconds = (t: number): number => t;

const toHours = (h: number): number => h * hours;
const toMinutes = (m: number): number => m * minutes;
const toSeconds = (s: number): number => s * seconds;
const toMilliseconds = (ms: number): number => ms * milliseconds;
const toNanoseconds = (ns: number): number => ns * nanoseconds;

class Time {

}

export { Time, Hours, Minutes, Seconds, Milliseconds, Nanoseconds, toHours, toMinutes, toSeconds, toMilliseconds, toNanoseconds };