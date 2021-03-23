
export default class LoginScene extends Phaser.Scene {

    constructor() {
        super("login");
    }

    preload() {

    }

    create() {
        var firebaseConfig = {
            apiKey: 'AIzaSyBNLEV1kZqisaR4ShpJE3uOCwXzdUSgFQc',
            authDomain: 'sprawl-c51a2.firebaseapp.com',
            databaseURL: 'https://sprawl-c51a2-default-rtdb.firebaseio.com',
            projectId: 'sprawl-c51a2',
            storageBucket: 'sprawl-c51a2.appspot.com',
            messagingSenderId: '300370241649',
            appId: '1:300370241649:web:e38a1cf82463c05c1753d0',
            measurementId: 'G-NF7SE064ML',
        };

        let firebaseApp = firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        var user = firebaseApp.auth().currentUser;
        if (user != null) {
            var name = user.displayName;
            var email = user.email;
            var photoUrl = user.photoURL;
            var emailVerified = user.emailVerified;
            var uid = user.uid;
            this.events.emit("login", user)
            console.log("Already signed in :", user)
        }

        const helloButton = this.add.text(window.innerWidth / 2 - 90, window.innerHeight / 2, 'Sign in with Google', { fill: '#fff' });
        helloButton.setInteractive();
        helloButton.on('pointerover', () => { console.log('pointerover'); });

        // Initialize Firebase




        var provider = new firebase.auth.GoogleAuthProvider();

        const onSignIn = function (user) {
            console.log("on signin", user)
            this.events.emit("login", user)
        }

        let savedUser;

        helloButton.on("pointerdown", async () => {
            let test = await firebaseApp.auth().signInWithPopup(provider)
            console.log("test", test)
            console.log(this.events.emit("login", user))

        });
    }

    update() {

    }
}

// .then(function (result) {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     var token = result.credential.accessToken;
//     // The signed-in user info.
//     var user = result.user;
//     savedUser = user;
//     // ...
//     console.log(user);
//     console.log(this)
//     this.events.emit("login")
//     this.scene.start("game")
//     onSignIn(user);
// }).catch(function (error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
// });