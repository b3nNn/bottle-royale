import _ from 'lodash';
import Strategy from './strategy';
import { GameService } from '../../services/game-service';

class Behavior {
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
        const strategy = new Strategy(this, name);
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
            from.tasks = _.merge(from.tasks, to.tasks);
            from.completeTasks = to.completeTasks;
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
            // console.log('behavior update', this.client.ID, this.tags);
            if (hook.strategy instanceof Strategy) {
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

    serialize() {
        return {
            serverID: GameService.serverID,
            behaviorID: this.ID,
            clientID: this.client.ID,
            tags: this.tags,
            strategies: []
        };
    }
}

export default Behavior;