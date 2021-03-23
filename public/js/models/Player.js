import Town from "./Town"

export default class Player {

    constructor(userID, userName) {

        this.userID = userID
        this.userName = userName




    }
    constructor(savedPlayer) {
        this.userID = savedPlayer.userID
        this.userName = savedPlayer.userName
        this.resources = savedPlayer.resources
    }

}