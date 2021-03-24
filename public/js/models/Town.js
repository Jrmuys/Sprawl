import House from "./buildings/House";
import Person from "./Person";

export default class Town {
    constructor(originX, originY, playerID) {

        /**
         * @type {Array<House>}
         */
        this.houses = []

        /**
         * @type {Array<Person>}
         */
        this.people = []

        /**
         * @type {Array<ProductionBuilding}
         */
        this.productionBuildings = []

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
            this.onTick();
            setTimeout(this.runLoop, 1000)

        } else {
            console.log("Paused...")
        }
    }

    onTick() {

        if (this._population < this._populationCapacity) {
            if (Math.random(20) == 0) {
                const newPerson = new Person();
                for (let i = 0; i < this.houses.length; i++) {
                    if (this.houses[i].getPeopleCount < this.houses[i]._capacity) {

                        this.houses[i].addPerson(newPerson)
                        this.people.push(newPerson)
                        console.log("Added person, ", newPerson)
                        break;
                    }
                }
            }
        }

        for (let i; i < this.)

    }

}