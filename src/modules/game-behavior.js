import _ from 'lodash';

class GameBehavior {
    constructor(client) {
        this.client = client;
        this.strategies = {};
        this.tags = [];
        this.hooks = [];
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    hasTags(tags) {
        const t = _.values(tags);

        return _.difference(t, this.tags).length === 0;
    }

    setTags(tags) {
        this.tags = tags;
    }

    createStrategy(name) {
        const strategy = new GameStrategy(this, name);
        if (this.strategies[name] !== undefined) {
            this.strategies[name] = strategy;
        }
        return strategy;
    }

    nextStrategy(from) {
        return to => {
            to.act();
            from.name = to.name;
            from.hooks = _.concat(from.hooks, to.hooks);
        };
    }

    while(tags, strategy, callback) {
        this.hooks.push({
            tags,
            strategy,
            callback,
            fullFill: false
        });
    }

    update() {
        _.each(_.reduce(this.hooks, (acc, hook) => {
            if (hook.fullFill !== true) {
                acc.push(hook);
            }
            return acc;
        }, []), hook => {
            console.log('behavior update', this.client.ID, this.tags);
            if (hook.strategy instanceof GameStrategy) {
                // console.log('while', _.values(hook.tags), hook.strategy.running, hook.fullFill, this.hasTags(hook.tags));
                if (this.hasTags(hook.tags)) {
                    if (!hook.strategy.running) {
                        hook.strategy.act();
                    }
                    hook.strategy.update(this);
                } else if (hook.strategy.running) {
                    hook.callback(this.nextStrategy(hook.strategy));
                    hook.fullFill = true;
                }
            }
        });
    }
}

class GameStrategy {
    constructor(behavior, name) {
        this.behavior = behavior;
        this.name = name;
        this.actCallback = null;
        this.running = false;
        this.hooks = [];
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

    update(behavior) {
        _.each(_.reduce(this.hooks, (acc, hook) => {
            if (hook.fullFill !== true) {
                acc.push(hook);
            }
            return acc;
        }, []), hook => {
            console.log('strategy update', this.name, behavior.hasTags(hook.tags), hook.tags, hook.tasks);
            if (behavior.hasTags(hook.tags)) {
                hook.fullFill = true;
                hook.callback(behavior.nextStrategy(this));
            }
        });
    }
}

export { GameBehavior, GameStrategy };