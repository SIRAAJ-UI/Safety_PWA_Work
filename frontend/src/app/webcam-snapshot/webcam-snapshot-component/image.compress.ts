import { SafetyService } from "@app/_services/safety.service";

const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.7;

export class ImageCompress {
    public CaptureImages: Array<any> = [];
    private captureIndex: number = 0;
    constructor(private safetyService: SafetyService) { }
    onCustomImageLoad(__file) {
        const file = __file // get the file
        const blobURL = URL.createObjectURL(file);
        const img = new Image();
        img.src = blobURL;
        img.onerror = function () {
            URL.revokeObjectURL(this.src);
            // Handle the failure properly
            console.log("Cannot load image");
        };
        img.onload = ($event) => {
            // URL.revokeObjectURL(event.target.src);
            const [newWidth, newHeight] = this.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            canvas.toBlob(
                (blob) => {
                    // Handle the compressed image. es. upload or save in local state
                    // this.displayInfo('Original file', file);
                    // this.displayInfo('Compressed file', blob);
                },
                MIME_TYPE,
                QUALITY
            );
            const record = { id: ++this.captureIndex, source: canvas.toDataURL("image/png") }
            this.safetyService.CaptureUpdates(record);
        };
    }

    private calculateSize(img, maxWidth, maxHeight) {
        let width = img.width;
        let height = img.height;
        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }
        }
        return [width, height];
    }
    // Utility functions for demo purpose
    private displayInfo(label, file) {
        // const p = document.createElement('p');
        return console.log(`${label} - ${this.readableBytes(file.size)}`);
        // document.getElementById('root').append(p);
    }
    private readableBytes(bytes) {
        const i = Math.floor(Math.log(bytes) / Math.log(1024)),
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    }

}