import { User } from "./user";

export class EventAccessRequestModel {
    createdAt: string;
    eventId: string;
    eventRequestId: number;
    user: User;
}