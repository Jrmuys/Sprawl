
export default class UIScene extends Phaser.Scene {

    constructor() {
        super("ui");
    }

    preload() {

    }

    create() {
        this.brush = 0;
        var gameScene = this.scene.get('game')
        console.log(gameScene)
        // var provider = new firebase.auth.GoogleAuthProvider();

        gameScene.events.on('brushChange', function (brush) {
            this.brush = brush;
        })

        let rectangle = this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2, 400, 300, 0x222222)




    }

    update() {

    }
}