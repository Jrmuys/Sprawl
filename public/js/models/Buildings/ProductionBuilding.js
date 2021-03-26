import Building from "../Building.js";

export default class ProductionBuilding extends Building {

    /**
     * @typedef {Object} Location
     * @property {number} x - The x coordinate
     * @property {number} y - The y coordinate
     */

    /**
     * 
     * @param {Location} location 
     * @param {String} type 
     */
    constructor(location, type) {

        let tileIndex
        let product
        let workNeeded
        let quantity
        let maxWorkers
        switch (type) {
            case "woodcutter":
                product = "wood";
                quantity = 10;
                workNeeded = 20;
                tileIndex = 0;
                maxWorkers = 4
                break;
            case "farm":
                product = "food";
                quantity = 10;
                workNeeded = 20;
                tileIndex = 0;
                maxWorkers = 2;
                break;
            case "quarry":
                product = "stone";
                quantity = 10;
                workNeeded = 20;
                tileIndex = 0;
                maxWorkers = 4;
                break;
            default:
                break;
        }

        super(location, tileIndex)

        this.product = product
        this.quantity = quantity
        this.workNeeded = workNeeded
        this.maxWorkers = maxWorkers

        this.workDone = 0;
        this.workers = 0
        this.type = type


    }

    destroyBuilding(buildingLayer, obstructLayer) {
        let farmTileArray;
        farmTileArray[0] = buildLayer.removeTileAt(this._location.x + 1, this._location.y)
        farmTileArray[1] = buildLayer.removeTileAt(this._location.x, this._location.y)
        farmTileArray[2] = buildLayer.removeTileAt(this._location.x + 1, this._location.y - 1)
        farmTileArray[3] = buildLayer.removeTileAt(this._location.x, this._location.y - 1)

        obstructLayer.removeTileAt(this._location.x + 1, this._location.y)
        obstructLayer.removeTileAt(this._location.x, this._location.y)
        obstructLayer.removeTileAt(this._location.x + 1, this._location.y - 1)
        obstructLayer.removeTileAt(this._location.x, this._location.y - 1)

        return farmTileArray
    }

    renderBuilding(buildLayer, obstructLayer) {
        if (this.type == "farm") {

            let farmTileIndices = {
                bottomLeft: 200,
                bottomRight: 201,
                topLeft: 184,
                topRight: 185
            }

            /**
             * @type {Array<Phaser.Tilemaps.Tile>}
             */
            let farmTileArray = [];
            farmTileArray[0] = buildLayer.putTileAt(farmTileIndices.bottomRight, this._location.x + 1, this._location.y)
            farmTileArray[1] = buildLayer.putTileAt(farmTileIndices.bottomLeft, this._location.x, this._location.y)
            farmTileArray[2] = buildLayer.putTileAt(farmTileIndices.topRight, this._location.x + 1, this._location.y - 1)
            farmTileArray[3] = buildLayer.putTileAt(farmTileIndices.topLeft, this._location.x, this._location.y - 1)

            obstructLayer.putTileAt(177, this._location.x + 1, this._location.y)
            obstructLayer.putTileAt(177, this._location.x, this._location.y)
            obstructLayer.putTileAt(177, this._location.x + 1, this._location.y - 1)
            obstructLayer.putTileAt(177, this._location.x, this._location.y - 1)

            return farmTileArray;

        } else {
            super.renderBuilding(layer)
        }
    }

    addWorker() {
        console.log("Workers: ", this.workers, " Max Workers ", this.maxWorkers)
        if (this.workers >= this.maxWorkers) {
            return 0
        }
        this.workers++
        return 1
    }

    onTick() {
        console.log(`Starting tick...\n Starting work done is ${this.workDone} and there are ${this.workers} working here.`)
        let quantity = 0;
        this.workDone += this.workers
        console.log(`Work done is now ${this.workDone}`)
        if (this.workDone >= this.workNeeded) {
            console.log(`Produced!`)
            quantity = this.quantity
            this.workDone %= this.workNeeded
        }

        return { product: this.product, quantity: quantity, progress: Number((100 * this.workDone / this.workNeeded).toFixed(0)) }
    }
}


// |-|-----|----------| --| -|
// 0 1     6          16  18 19

// 0+1+6+16+18 = 41
// 41/5 = 8.2