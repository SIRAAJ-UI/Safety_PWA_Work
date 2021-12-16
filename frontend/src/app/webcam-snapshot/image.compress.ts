import { SafetyService } from "@app/_services/safety.service";

const MAX_WIDTH = 600;
const MAX_HEIGHT = 600;
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
            const [newWidth, newHeight] = this.calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
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

}