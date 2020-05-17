import { Tag } from "./tag";
import { User } from "./user";

export class Attachment {
    attachmentId: number;
    path: string;
    name: string;
    description: string;
    tags: Array<Tag>;
    type: string;
    size: number;
    user: User;
    createdAt: number;
}