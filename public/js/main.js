
import GameScene from "./scenes/GameScene.js";
import LoginScene from "./scenes/LoginScene.js";
import UIScene from "./scenes/UIScene.js"

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    pixelArt: true,
    backgroundColor: "#1d212d",
    scene: [LoginScene, GameScene, UIScene,]
};

const game = new Phaser.Game(config);
