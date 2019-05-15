import { Model } from "./Model";
import { Firebase } from "../database/Firebase";


export class Chat extends Model {

    constructor(){

        super();

    }

    static getChatCollectionReference(){
        return Firebase.store().collection('/chats');
    }

    static find(myEmail, contactEmail){

        return Chat.getChatCollectionReference()
            .where(btoa(myEmail), '==', true) // btoa transforma em base64
            .where(btoa(contactEmail), '==', true)
            .get();
    }

    static create(myEmail, contactEmail){

        return new Promise( async (resolve, reject) => {

            try {

                let users = {};

                users[btoa(myEmail)] = true;
                users[btoa(contactEmail)] = true;

                let doc = await Chat.getChatCollectionReference().add({
                    users,
                    timeStamp: new Date()
                });
    
                let chat = await Chat.getChatCollectionReference().doc(doc.id).get();

                resolve(chat);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    static createIfNotExists(myEmail, contactEmail){

        return new Promise( async (resolve, reject) => {

            try {

                let chats = await Chat.find(myEmail, contactEmail);

                if(chats.empty){ // firebase retorna propriedade empty caso não encontre nada

                    let chat = await Chat.create(myEmail, contactEmail);

                    resolve(chat);

                } else {

                    chats.forEach( (chat) => { // chats é uma coleção, chat um documento dessa coleção

                        resolve(chat);

                    });
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    //////////////////////////////

    get users(){
        return this._data.users;
    }

    set users(value){
        this._data.users = value;
    }

    get timeStamp(){
        return this._data.timeStamp;
    }

    set timeStamp(value){
        this._data.timeStamp = value;
    }


}