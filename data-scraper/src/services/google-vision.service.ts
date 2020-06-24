import { IGoogleVision } from "../container/interfaces";
import { injectable } from "inversify";

const vision = require('@google-cloud/vision');

@injectable()
export class GoogleVision implements IGoogleVision {
    public async analyze(imageUrl: string): Promise<Array<string>> {
        try {
            const client = new vision.ImageAnnotatorClient();
            const [result] = await client.labelDetection(imageUrl);

            return result.labelAnnotations.map((label) => label.description);
        } catch (err) {
            console.error('ERROR in fire:', err);
        }
    }
}