import { IGoogleVision } from "../container/interfaces";
import { injectable } from "inversify";

const Path = require('path')
const Axios = require('axios')
var bluebird = require('bluebird');

var fs = bluebird.promisifyAll(require('fs'));

const vision = require('@google-cloud/vision');

@injectable()
export class GoogleVision implements IGoogleVision {
    private path: string;

    constructor() {
        this.path = Path.resolve(__dirname, 'image.jpg');
    }

    public async analyze(imageUrl: string): Promise<Array<string>> {
        try {
            const client = new vision.ImageAnnotatorClient();
            let [result] = await client.labelDetection(imageUrl);

            if (result.error) {
                const path = this.getNewFileName();

                await this.donloadImage(imageUrl, path);
                const imgData = await fs.readFileAsync(path);

                [result] = await client.labelDetection(imgData);
                fs.unlinkSync(path);
            }

            return result.labelAnnotations.map((label) => label.description);
        } catch (err) {
            console.error('ERROR in fire:', err);
        }
    }

    private async donloadImage(url: string, path: string): Promise<string> {
        const writer = fs.createWriteStream(path)

        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    }

    private getNewFileName() {
        return Path.resolve(__dirname, `image-${Date.now().toString()}-${Math.random() * 127419846}.jpg`);
    }
}