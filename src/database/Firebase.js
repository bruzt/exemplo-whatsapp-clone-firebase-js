const firebase = require('firebase');
require('firebase/firestore');


export class Firebase {

    constructor(){

        this._config = {
            apiKey: "AIzaSyBJEu0C9bDa180xFAwvgX0m3EIF4uW0xTg",
            authDomain: "whatsapp-clone-edaad.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-edaad.firebaseio.com",
            projectId: "whatsapp-clone-edaad",
            storageBucket: "whatsapp-clone-edaad.appspot.com",
            messagingSenderId: "893525775449",
            appId: "1:893525775449:web:932a945a53e12b3c"
          };

        this.init();

    }

    init(){

        if(! window._initilizedFirebase){

            firebase.initializeApp(this._config);

            firebase.firestore().settings({
                //timestampsInSnapshots: true
            });

            window._initilizedFirebase = true;
        }
    }

    static store(){
        return firebase.firestore();
    }

    static storage(){
        return firebase.storage();
    }

    initAuth(){

        return new Promise( async (resolve, reject) => {

            let provider = new firebase.auth.GoogleAuthProvider();

            try {

                let result = await firebase.auth().signInWithPopup(provider); // .signInWithRedirect // firebase.auth.Auth.getRedirectResult
                
                let token = result.credential.accessToken;

                let user = result.user;

                resolve({
                    user,
                    token
                });
                
            } catch (error) {
                reject(error);
            }
        });
    }

}