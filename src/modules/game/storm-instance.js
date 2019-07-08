const ClientStormProxy = storm =>  {
    const proxy = {
        get state() {
            return storm.state;
        },
        get level() {
            return storm.level;
        }
    };
    return proxy;
};

class StormInstance {
    constructor() {
        this.state = 'init';
        this.level = 0;
        this.beginDelay = 10000000;
        this.prepareDelay = 5000000;
        this.stayDelay = 10000000;
        this.moveDelay = 5000000;
        this.clientProxy = ClientStormProxy(this);
    }

    prepare() {
        this.state = 'prepare';
    }

    move() {
        this.state = 'move';
    }

    stay() {
        this.state = 'stay';
    }

    levelUp() { 
        this.level++;
    }
}

export default StormInstance;