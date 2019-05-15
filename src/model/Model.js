import { ClassEvent } from "../utils/ClassEvent";


export class Model extends ClassEvent {

    constructor(){

        super();

        this._data = {};

    }

    fromJSON(json){

        this._data = Object.assign(this._data, json);

        this.trigger('datachange', this.toJSON()); // metodo 'trigger' vem da classe ClassEvent 
    }

    toJSON(){
        return this._data;
    }

}