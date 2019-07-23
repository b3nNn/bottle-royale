class Vehicule {
    constructor(speed = 0, seatNumber = 0) {
        this.speed = speed;
        this.seatSlots = [];
        for (let it = 0; it < seatNumber; it++) {
            this.seatSlots[it] = null;
        }
    }
    toSpeedMS() {
        return (this.speed / 3600) * 1000
    }
}

export default Vehicule;