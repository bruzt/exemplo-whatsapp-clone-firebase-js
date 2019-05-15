import { Firebase } from '../database/Firebase';



export class Upload {

    constructor(){



    }

    static send(file, from){

        return new Promise( (resolve, reject) => {

            let fileRef = Firebase.storage().ref(from).child(Date.now() + '_' + file.name);
            let uploadTask = fileRef.put(file);
        
            uploadTask.on('state_changed', (progress) => {

                console.info('upload', progress);

            }, (error) => {

                reject(error);

            }, async (sucess) => {

                try {
                    
                resolve(await fileRef.getDownloadURL());
                    
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

}