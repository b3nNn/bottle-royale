const surviveStrategy = require('./survive-strategy');

module.exports = behavior => {
    const strategy = behavior.createStrategy('loot-strategy');
    
    strategy.on('act', params => {
        strategy.until(['has_weapon'], [
            strategy.always('watch-for-stuff')
        ], next => {
            next(surviveStrategy(behavior));
        });
    });
    strategy.task('watch-for-stuff', task => {
        behavior.client.log('hello from watch-for-stuff');
    });
    return strategy;
};