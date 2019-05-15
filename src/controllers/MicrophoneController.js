import { ClassEvent } from "../utils/ClassEvent";


export class MicrophoneController extends ClassEvent {

    constructor(){

        super();

        this._available = false;
        
        this._audioType = 'webm'
        this._mimeType = `audio/${this._audioType}`;

        this.startMicrophone();

    }

    async startMicrophone(){
        try {

            this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this._available = true;

            /*
            let audio = new Audio();

            audio.srcObject = this._stream;

            //audio.src = URL.createObjectURL(this._stream);

            audio.play();
            */

            this.trigger('ready', this._stream);

        } catch (error) {
            console.error(error);
        }
    }

    stop(){

        this._stream.getTracks().forEach( (track) => {
            track.stop();
        });
    }

    isAvailable(){
        return this._available;
    }

    startRecorder(){

        if(this.isAvailable()){

            this._mediaRecorder = new MediaRecorder(this._stream, { type: this._mimeType });

            this._recordedChuncks = [];

            this._mediaRecorder.addEventListener('dataavailable', (event) => {

                if(event.data.size > 0){
                    this._recordedChuncks.push(event.data);
                }
            });

            this._mediaRecorder.addEventListener('stop', (event) => {
               
                let blob = new Blob(this._recordedChuncks, { mimeType: this._mimeType });

                let filename = `rec-${Date.now()}.${this._audioType}`;

                let audioContext = new AudioContext();

                let reader = new FileReader();

                reader.onload = async () => {
                    
                    let decode = await audioContext.decodeAudioData(reader.result);

                    let file = new File([blob], filename, {
                        type: this._mimeType,
                        lastModified: Date.now()
                    });

                    this.trigger('recorded', file, decode);

                }

                reader.readAsArrayBuffer(blob); 


                /* // Toca o audio
                let reader = new FileReader();

                reader.onload = () => {

                    let audio = new Audio (reader.result);

                    audio.play();

                }

                reader.readAsDataURL(file); 
                */
            });

            this.startTimer();
            this._mediaRecorder.start();
            
        }
    }

    stopRecorder(){

        if(this.isAvailable()){

            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();

        }
    }

    startTimer(){

        let start = Date.now();

        this._recordMicInterval = setInterval( () => {

            this.trigger('recordtimer', Date.now() - start);

        }, 100);
    }

    stopTimer(){
    
        clearInterval(this._recordMicInterval);
       
    }

}