// import Phaser from "phaser"

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("game");
    }


    preload() {
        this.load.image("tiles", "../assets/tilemaps/MasetTilesetExtruded.png");
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/island_map.json");
    }

    create() {

        this.scene.setActive("ui");
        this.scene.bringToTop("ui")
        this.scene.launch("ui")

        this.socket = io();
        this.brush = 1;
        this.zoom = 1;

        console.log("test log")


        this.map = this.make.tilemap({ key: "map" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        console.log("test log")

        const tileset = this.map.addTilesetImage("MasterTileset1.0", "tiles");

        this.obstruct = this.map.createStaticLayer("Obstruct", tileset, 0, 0)
        console.log("test log")

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        this.ground = this.map.createStaticLayer("Ground", tileset, 0, 0)

        this.buildings = this.map.createDynamicLayer("Buildings", tileset, 0, 0)
        console.log(this.buildings)




        this.path = this.map.createDynamicLayer("Path", tileset, 0, 0)

        const socketInitCB = (updateArray) => {
            console.log(updateArray)
            updateArray.forEach(newTile => {
                let tileTest = this.path.putTileAt(newTile.index, newTile.x, newTile.y).properties = newTile.properties
                console.log(newTile.properties)
            });
        }

        const boundSocketInitCB = socketInitCB.bind()

        this.socket.on('connect', () => {
            console.log("Connected!")

        })

        this.socket.on('mapInit', socketInitCB)

        const updateMapCallback = (tile) => {
            // console.log("got,", tile)
            this.path.putTileAt(tile.index, tile.x, tile.y).properties = tile.properties
        }

        const boundUpdateMapCallback = updateMapCallback.bind()

        this.socket.on('updateMap', boundUpdateMapCallback)
        console.log(this.map.widthInPixels)
        this.cameras.main.setBounds(0, 0, 2112, 2112);

        // Phaser supports multiple cameras, but you can access the default camera like this:

        this.marker = this.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        this.marker.lineStyle(3, 0xff4f78, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);

        // Set up the arrows to control the camera
        const cursors = this.input.keyboard.createCursorKeys();
        this.controls = new Phaser.Cameras.Controls.Fixed({
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            disableCull: true,
            down: cursors.down,
            speed: 0.5
        });
        this.cameras.main.setZoom(8)

        const clickCallback = () => {
            // console.log(this)
            // const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
            // let tile = this.path.putTileAtWorldXY(157, worldPoint.x, worldPoint.y);
            // this.getTileProperties()
            // console.log(`tile: `, this.path.getTileAtWorldXY(worldPoint.x, worldPoint.y).properties)

            // // ...
        }

        const boundClickCallback = clickCallback.bind()

        this.input.on('pointerdown', boundClickCallback);

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, "Arrow keys to scroll", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);


        const zoomIn = (event) => {
            console.log(event)
            console.log(this)
            if (event.key == 'q') {
                console.log()
                if (this.zoom < 4) {
                    this.zoom *= 2
                    this.cameras.main.setZoom(this.zoom)
                    console.log("Zooming in")
                    // this.cameras.main.setBounds(-400, -250, this.map.widthInPixels, this.map.heightInPixels)
                }

            } else {
                if (this.zoom > 1) {
                    this.zoom /= 2
                    this.cameras.main.setZoom(this.zoom)
                    console.log("Zooming in")

                }
            }
        }

        let boundZoomCB = zoomIn.bind()

        this.drawSelect = (event) => {
            console.log(event)
            this.brush = parseInt(event.key)
            console.log(this.brush)
        }

        this.input.keyboard.on('keydown_Q', boundZoomCB)
        this.input.keyboard.on('keydown_E', boundZoomCB)


        this.input.keyboard.on('keydown_ONE', this.drawSelect)
        this.input.keyboard.on('keydown_TWO', this.drawSelect)

        this.input.keyboard.on('keydown_THREE', this.drawSelect)

        this.input.keyboard.on('keydown_FOUR', this.drawSelect)

        this.input.keyboard.on('keydown_FIVE', this.drawSelect)



        this.cameras.main.setZoom(1)

        this.keypress = this.input.keyboard.addKeys({ 'zoomIn': Phaser.Input.Keyboard.KeyCodes.Q, 'zoomOut': Phaser.Input.Keyboard.KeyCodes.E });


        //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
        // this.minimap = this.cameras.add(500, 500, this.map.widthInPixels * 0.2, this.map.heightInPixels * 0.2).setZoom(0.4).setName('mini');
        // this.minimap.setBackgroundColor(0x002244);
        // this.minimap.scrollX = this.map.widthInPixels / 2;
        // this.minimap.scrollY = this.map.heightInPixels / 2;
    }





    update(time, delta) {
        // Apply the controls to the camera each update tick of the game
        this.controls.update(delta);

        // Convert the mouse position to world position within the camera
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

        const pointerTileXY = this.path.worldToTileXY(worldPoint.x, worldPoint.y);
        const snappedWorldPoint = this.path.tileToWorldXY(pointerTileXY.x, pointerTileXY.y)
        this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y)
        if (this.obstruct.getTileAtWorldXY(worldPoint.x, worldPoint.y)) {
            this.marker.lineStyle(2, 0xff4f78, 1);
            this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        } else {
            this.marker.lineStyle(2, 0x2fff28, 1);
            this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        }
        if (this.input.activePointer.isDown) {
            this.cameras.main.scrollX = -400
        }




        // Draw tiles (only within the groundLayer)
        if (this.input.manager.activePointer.isDown) {
            console.log(this.brush)
            if (!this.obstruct.getTileAtWorldXY(worldPoint.x, worldPoint.y)) {
                switch (this.brush) {
                    case 1:
                        console.log("Brush is 1")
                        if (!this.path.getTileAtWorldXY(worldPoint.x, worldPoint.y)) {
                            let tile = this.placePath(pointerTileXY)

                            this.getTileProperties()
                            // console.log(`tile: `, this.path.getTileAtWorldXY(worldPoint.x, worldPoint.y).index)
                            this.socket.emit("mapUpdate", { index: tile.index, x: tile.x, y: tile.y, properties: tile.properties })
                        }
                        break;

                    case 2:

                        break;
                    default:
                        break;
                }
            } else {
                if (this.brush == 5) {
                    let pier = null;
                    let index;
                    if (this.ground.getTileAt(pointerTileXY.x, pointerTileXY.y)?.index != 82) { // Down
                        console.log("Boarder!!!!")
                        pier = this.path.putTileAt(93, pointerTileXY.x, pointerTileXY.y)
                        pier.properties.surround = "0010"
                        pier.properties.pier = true

                        this.updatePath(2, pointerTileXY.x, pointerTileXY.y - 1)

                    } else if (this.ground.getTileAt(pointerTileXY.x + 1, pointerTileXY.y)?.index != 82) { // Left
                        console.log(`Index: ${17}`)
                        pier = this.path.putTileAt(108, pointerTileXY.x, pointerTileXY.y)
                        pier.properties.surround = "0001"
                        pier.properties.pier = true

                        this.updatePath(3, pointerTileXY.x + 1, pointerTileXY.y)

                    } else if (this.ground.getTileAt(pointerTileXY.x - 1, pointerTileXY.y)?.index != 82) { // Right
                        console.log(`Index: ${19}`)
                        pier = this.path.putTileAt(109, pointerTileXY.x, pointerTileXY.y)
                        pier.properties.surround = "0100"
                        pier.properties.pier = true

                        this.updatePath(1, pointerTileXY.x - 1, pointerTileXY.y)

                    } else if (this.ground.getTileAt(pointerTileXY.x, pointerTileXY.y + 1)?.index == 2) { // Up
                        console.log(`Index: ${2}`)
                        pier = this.path.putTileAt(77, pointerTileXY.x, pointerTileXY.y)
                        pier.properties.surround = "1000"
                        pier.properties.pier = true

                        this.updatePath(0, pointerTileXY.x, pointerTileXY.y + 1)
                    }
                    if (pier) {
                        this.socket.emit("mapUpdate", { index: pier.index, x: pier.x, y: pier.y, properties: pier.properties })
                    }
                }
            }

        }
    }


    setCharAt(str, index, chr) {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + chr + str.substring(index + 1);
    }



    updatePath(dir, x, y) {
        let tile
        if (tile = this.path.getTileAt(x, y)) {
            if (!tile.properties.pier) {
                // console.log(tile)
                let surround = this.setCharAt(tile.properties.surround, dir, 1)
                let index = this.getPathIndex(surround)
                let newTile = this.path.putTileAt(index, x, y)
                console.log("NEW TILE PROPERTIES", newTile.properties.surround = surround)
                this.socket.emit("mapUpdate", { index: index, x: x, y: y, properties: newTile.properties })
            }
        }


    }

    placePath(tileXY) {
        let surround = "0000";
        if (this.path.getTileAt(tileXY.x, tileXY.y + 1)) { // up
            console.log("Down")
            surround = this.setCharAt(surround, 2, "1")
            this.updatePath(0, tileXY.x, tileXY.y + 1)
        }
        if (this.path.getTileAt(tileXY.x + 1, tileXY.y)) { // right
            console.log("Right")
            surround = this.setCharAt(surround, 1, "1")
            this.updatePath(3, tileXY.x + 1, tileXY.y)



        }
        if (this.path.getTileAt(tileXY.x, tileXY.y - 1)) { // down
            console.log("Up")
            surround = this.setCharAt(surround, 0, "1")
            this.updatePath(2, tileXY.x, tileXY.y - 1)



        }
        if (this.path.getTileAt(tileXY.x - 1, tileXY.y)) { // left
            console.log("Left")
            surround = this.setCharAt(surround, 3, "1")
            this.updatePath(1, tileXY.x - 1, tileXY.y)



        }
        let index = this.getPathIndex(surround)
        let tile = this.path.putTileAt(index, tileXY.x, tileXY.y)
        tile.properties.surround = surround
        console.log("surround ", surround)
        // console.log("PlaceTile", tile)
        return tile
    }

    getPathIndex(surround) {
        switch (surround) {
            case "0000":
                return 173 + 1
            case "0001":
                return 174 + 1
            case "0010":
                return 158 + 1
            case "0011":
                return 124 + 1
            case "0100":
                return 175 + 1
            case "0101":
                return 142 + 1
            case "0110":
                return 123 + 1
            case "0111":
                return 172 + 1
            case "1000":
                return 159 + 1
            case "1001":
                return 140 + 1
            case "1010":
                return 141 + 1
            case "1011":
                return 156 + 1
            case "1100":
                return 139 + 1
            case "1101":
                return 171 + 1
            case "1110":
                return 155 + 1
            case "1111":
                return 157 + 1

            default:
                break;
        }
    }

    getTileProperties() {
        // console.log(this.path)
        const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        const pointerTileXY = this.path.worldToTileXY(worldPoint.x, worldPoint.y);

        var tile = this.map.getTileAt(pointerTileXY.x, pointerTileXY.y, this.path);
        if (tile) {
            // Note: JSON.stringify will convert the object tile properties to a string
            console.log(JSON.stringify(tile.properties));
            console.log(tile.index)

            tile.properties.wibble = true;
        }
    }
}
