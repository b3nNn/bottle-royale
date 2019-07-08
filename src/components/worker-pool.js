import Pool from 'worker-threads-pool';

const WorkerPool = (options, script) => {
    const pool = new Pool({ max: 8 });
    const cb = null;

    const handler = (data, callback) => {
        if (!cb) {
            cb = callback;
        }
        pool.acquire(script, { workerData: data }, (err, worker) => {
            let error;
            let message;
            if (err) {
            //   return callback(err, null);
            }
            worker.once("message", msg => {
                message = msg;
                cb(error, message)
            });
            worker.once("error", err => {
                // error = err;
            });
        });
    }
    return handler;
};

export default WorkerPool;