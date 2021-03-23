import House from "./Buildings/House";

export default class Town {
    constructor(originX, originY, playerID) {
        this.houses = []

        this._resources = {
            wood: 0,
            stone: 0,
            food: 0,
        }

        this.workplaces = []

        this.size = 32;
        this.origin = { x: originX, y: originY }

        this.ownerID = playerID
        this.pause = false

        this._population = 0;
        this._populationCapacity = 4;


        this.run()

    }

    addHouse(location, mapLayer) {
        let newHouse = new House(location)
        newHouse.renderBuilding(mapLayer)
        this.buildings.push(newHouse)
    }

    runLoop() {
        if (!this.pause) {
            // Do town logic




            setTimeout(this.runLoop, 1000)

        } else {
            console.log("Paused...")
        }
    }

}