//@flow
import { ImageModel } from "./image";
import { Settings } from "./settings";

export class User {
    country: string;
    countryId: number;
    email: string;
    firstName: string;
    lastName: string;
    organization: string;
    organizationId: number;
    title: string;
    titleId: number;
    username: string;
    certificates: string;
    image: ImageModel;
    authorizationNumber: string;
    settings: Settings;
}