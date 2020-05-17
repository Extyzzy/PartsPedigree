import { Image } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import { FileData } from "../models/file-data";
import ImagePicker from "react-native-image-picker";

export class ImageUtils {
    static getSize(uri: string): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
        })
    }

    static resizeImage(uri: string, w: number, h?: number, rotation: number = 0): string {
        if (!h) {
            h = w;
        }

        return ImageResizer.createResizedImage(uri, w, h, 'JPEG', 60, rotation);
    }

    static showImagePicker(): Promise<FileData> {
        return new Promise((resolve, reject) => {
            const options = {
                title: 'Select Image',
                rotation: 360
            };

            ImagePicker.showImagePicker(options, async (response) => {
                if (response.didCancel) {
                    return reject();
                }

                if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                    return reject();
                }

                const { uri, fileName, type, originalRotation } = response;

                let rotation = 0;

                if (originalRotation === 90) {
                    rotation = 0;
                } else if (originalRotation === 270) {
                    rotation = -90;
                }

                const resizedImage = await ImageUtils.resizeImage(uri, 1024, 1024, rotation);

                const image = new FileData(resizedImage.uri, fileName, type);

                return resolve(image);
            });
        });
    }
}