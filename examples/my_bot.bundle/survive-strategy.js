module.exports = behavior => {
    const strategy = behavior.createStrategy('survive-strategy');
    
    strategy.on('act', params => {
    });
    return strategy;
};