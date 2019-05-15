

const pdfjsLib = require('pdfjs-dist');
const path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export class DocumentPreviewController {

    constructor(file){

        this._file = file;
    }

    getPreviewData(){

        return new Promise( (resolve, reject) => {

            let reader = new FileReader();

            switch(this._file.type){

                case 'image/jpeg':
                case 'image/jpg':
                case 'image/jif':
                case 'image/jfif':
                case 'image/jp2':
                case 'image/jpx':
                case 'image/j2k':
                case 'image/j2c':
                case 'image/fpx':
                case 'image/pcd':
                case 'image/png':
                case 'image/gif':
                case 'image/tiff':
                case 'image/tif':

                    reader.onload = () => {
                        resolve({
                            src: reader.result,
                            info: this._file.name                        
                        });
                    };

                    reader.onerror = (err) => {
                        reject(err);
                    };

                    reader.readAsDataURL(this._file);

                break;

                case 'application/pdf':

                    reader.onload = async () => {

                        try {

                            let pdf = await pdfjsLib.getDocument(new Uint8Array(reader.result));

                            let page = await pdf.getPage(1);

                            let viewport = page.getViewport(1);

                            let canvas = document.createElement('canvas');
                            let canvasContext = canvas.getContext('2d');

                            canvas.width = viewport.width;
                            canvas.height = viewport.height;

                            await page.render({
                                canvasContext,
                                viewport
                            });

                            let s = (pdf.numPages) > 1 ? 's' : '';

                            resolve({
                                src: canvas.toDataURL('image/png'),
                                info: `${pdf.numPages} página${s}`
                            });
                            
                        } catch (error) {
                            reject(error);
                        }
                    };

                    reader.onerror = (err) => {
                        reject(err);
                    };

                    reader.readAsArrayBuffer(this._file);

                break;

                default:
                    reject();
                break;


            }
        });
    }
}