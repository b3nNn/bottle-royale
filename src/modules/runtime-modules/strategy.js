import _ from 'lodash';

class Strategy {
    constructor(behavior, name) {
        this.behavior = behavior;
        this.name = name;
        this.actCallback = null;
        this.running = false;
        this.hooks = [];
        this.tasks = {};
        this.completeTask = {};
    }

    on(event, callback) {
        if (event === 'act' && callback) {
            this.actCallback = callback;
        }
    }

    until(tags, tasks, callback) {
        this.hooks.push({
            tags,
            tasks,
            callback,
            fullFill: false
        });
    }

    once(task) {
        const t = {};

        t[task] = 'once';
        return t;
    }

    always(task) {
        const t = {};

        t[task] = 'always';
        return t;
    }

    act() {
        if (this.actCallback) {
            this.actCallback();
        }
        this.running = true;
    }

    task(name, fn) {
        this.tasks[name] = fn;
    }

    runTask(name, params) {
        if (_.isFunction(this.tasks[name])) {
            this.tasks[name](params);
        }
    }

    update(behavior) {
        _.each(_.reduce(this.hooks, (acc, hook) => {
            if (hook.fullFill !== true) {
                acc.push(hook);
            }
            return acc;
        }, []), hook => {
            // console.log('strategy update', this.name, behavior.hasTags(hook.tags), hook.tags, hook.tasks);
            if (behavior.hasTags(hook.tags)) {
                hook.fullFill = true;
                hook.callback(behavior.nextStrategy(this));
            } else {
                _.each(hook.tasks, task => {
                    _.each(_.keys(task), name => {
                        const mode = task[name];
                        switch(mode) {
                            case 'once': {
                                if (!this.completeTask[name]) {
                                    this.runTask(name, {
                                        complete: () => {
                                            this.completeTask[name] = true;
                                        }
                                    });
                                }
                                break;
                            }
                            case 'always': {
                                this.runTask(name, {
                                    complete: () => {
                                        this.completeTask[name] = true;
                                    }
                                });
                                break;
                            }
                            default:
                                break;
                        }
                    });
                });
            }
        });
    }
}

export default Strategy;