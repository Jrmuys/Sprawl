
export default class Building {

    /**
     * 
     * @param {Location} location 
     * @param {Number} tileIndex
     */
    constructor(location, tileIndex) {

        // this._ownerID = ownerID;

        /**
         * @typedef {Object} Location
         * @property {number} x - The x coordinate
         * @property {number} y - The y coordinate
         */

        /**
         * @type {Location}
         */
        this._location = { x: location.x, y: location.y }

        this._tileIndex = tileIndex


    }

    getTileIndex() {
        return this._tileIndex
    }

    getLocation() {
        return this._location
    }

    getLocationX() {
        return this._location.x
    }

    getLocationY() {
        return this._location.y
    }

    /**
     * 
     * @param {Phaser.} layer 
     */
    renderBuilding(layer) {

    }

    // getOwnerID() {
    //     return this._ownerID
    // }

}