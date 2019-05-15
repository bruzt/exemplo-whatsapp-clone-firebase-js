
export class CameraController {

    constructor(videoElement) {

        this._videoElement = videoElement;

        this.startVideo();

    }

    async startVideo(){
        try {

            this._stream = await navigator.mediaDevices.getUserMedia({ video: true });

            //this._videoElement.src = URL.createObjectURL(this._stream);

            this._videoElement.srcObject = this._stream;

            this._videoElement.play();

        } catch (error) {
            console.error(error);
        }
    }

    stop(){

        this._stream.getTracks().forEach( (track) => {
            track.stop();
        });
    }

    takePicture(mimeType = 'image/png'){

        let canvas = document.createElement('canvas');

        canvas.setAttribute('height', this._videoElement.videoHeight);
        canvas.setAttribute('width', this._videoElement.videoWidth);

        let context = canvas.getContext('2d');

        context.drawImage(this._videoElement, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL(mimeType);
    }


}