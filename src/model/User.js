import { Firebase } from '../database/Firebase';
import { Model } from './Model';


export class User extends Model {

    constructor(id){

        super();

        if(id){
            this.getById(id);
        }

    }

    getById(id){

        return new Promise( async (resolve, reject) => {

            try {

                User.findByEmail(id).onSnapshot( (doc) => { // O Email é o ID dessa coleção

                    this.fromJSON(doc.data());

                    resolve(doc);

                });

                // let doc = await User.findByEmail(id).get(); // O Email é o ID dessa coleção
                
            } catch (error) {
                reject(error);
            }
        });

    }

    save(){
        return User.findByEmail(this.email).set(this.toJSON());
    }

    static getUsersCollectionReference(){
        return Firebase.store().collection('/users');
    }

    static getContactsCollectionReference(userId){
        return User.getUsersCollectionReference().doc(userId).collection('contacts');
    }

    static findByEmail(email){
        return User.getUsersCollectionReference().doc(email);
    }

    addContact(contact){ // contact é uma instancia da classe User

        return User.getContactsCollectionReference(this.email)
            .doc(btoa(contact.email)) // btoa transforma em base64
            .set(contact.toJSON());

    }

    getContacts(filter = ''){

        return new Promise( (resolve, reject) => {

            User.getContactsCollectionReference(this.email).where('name', '>=', filter).onSnapshot( (docs) => {

                try {

                    let contacts = [];

                    docs.forEach( (doc) => {

                        let data = doc.data();

                        data.id = doc.id;

                        contacts.push(data);

                    });

                    this.trigger('contactschange', docs);

                    resolve(contacts);
                    
                } catch (error) {
                    reject(error);
                }
            });
        });

    }

    //////////////////////////////

    get name(){
        return this._data.name;
    }

    set name(value){
        this._data.name = value;
    }

    get email(){
        return this._data.email;
    }

    set email(value){
        this._data.email = value;
    }

    get photo(){
        return this._data.photo;
    }

    set photo(value){
        this._data.photo = value;
    }

    get chatId(){
        return this._data.chatId;
    }

    set chatId(value){
        this._data.chatId = value;
    }

}