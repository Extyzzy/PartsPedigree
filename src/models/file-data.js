//@flow
export class FileData {
    uri: string;
    name: string;
    type: string;
    description: string;
    tags: Array<number>;

    constructor(uri: string, name: string = 'image.jpg', type: string = 'image/jpeg') {
        this.uri = uri;
        this.name = name;
        this.type = type
    }
}