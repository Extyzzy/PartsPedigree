//@flow
import { PartMaster } from "./part-master";
import { PartInstance } from "./part-instance";
import { User } from "./user";
import { EventAccessRequestModel } from "./avent-access-request";

export class EventModel {
    eventId: string;
    eventTypeId: number;
    eventTypeName: string;
    data: string;
    createdAt: string;
    hash: string;
    isRestricted: boolean;
    partMaster: PartMaster;
    partInstance: PartInstance;
    owner: User;
    users: Array<User>;
    blockchainAddress: string;
    canShare: boolean;
    canCreateReceiveEvent: boolean;
    isFollowed: boolean;
}