//@flow
import Baobab from 'baobab';
import { User } from "./models/user";
import { SearchPartsItem } from "./models/search-parts-item";
import { Country } from "./models/country";
import { PartMaster } from "./models/part-master";
import { EventModel } from "./models/eventModel";
import { PartInstance } from "./models/part-instance";
import { Organization } from "./models/organization";
import { ImageModel } from "./models/image";
import { EventAccessRequestModel } from "./models/avent-access-request";
import { ShipPartView } from "./models/ship-part-view";
import { ShipPartItem } from "./models/ship-part-item";
import { OrganizationAddress } from "./models/organization-address";
import { ShipPartEvent } from "./models/ship-part-event";
import { Attachment } from "./models/attachment";
import { ReceivePartView } from "./models/receive-part-view";
import { ShipPartItemView } from "./models/ship-part-item-view";
import { ReceiveReason } from "./models/receiveReason";
import { Event81303View } from "./models/event81303View";
import { Event81303ItemView } from "./models/event81303ItemView";
import { Tag } from "./models/tag";
import { AttachmentEvent } from "./models/attachment-event";
import { Draft } from "./models/draft";

class Tree {
    user: User = null;
    partsMasterList: Array<SearchPartsItem> = [];
    partInstanceList: Array<PartInstance> = [];
    receiveReasons: Array<ReceiveReason> = [];
    event: EventModel | ShipPartEvent = null;
    eventAccessRequests: Array<EventAccessRequestModel> = [];
    eventsList: Array<EventModel> = [];
    countries: Array<Country> = [];
    partMasterDetail: PartMaster = null;
    partMaster: PartMaster = null;
    partMasterTimeLine: Array<EventModel> = null;
    partMasterDrafts: Array<Draft> = null;
    organizations: Array<Organization> = [];
    partInstance: PartInstance = null;
    partInstanceDetail: PartInstance = null;
    partInstanceTimeLine: Array<EventModel> = null;
    partInstanceDrafts: Array<Draft> = null;
    attachmentsTimeline: Array<Attachment> = null;
    attachmentsTimelineByTag: Array<Attachment> = null;
    activeTab: string = 'Stats';
    activeTabPartMaster: string = 'Timeline';
    imageForFill: ImageModel = null;
    textSearch: string = null;
    textShipPart: boolean = false;

    imageAndFilHelpModal: boolean = false;

    shipPartItem: ShipPartItemView = null;
    shipPart: ShipPartView = null;
    shipPartItems: Array<ShipPartItem> = [];
    organizationAddress: OrganizationAddress = null;
    shiPartAttachments: Array<Attachment> = null;
    shipItemAttachments: Array<Attachment> = null;

    receivePart: ReceivePartView = null;

    event81303: Event81303View = null;
    event81303Items: Array<Event81303ItemView> = [];
    event81303Drafts: Array = [];

    tags: Array<Tag> = [];
    eventHistory: Array = [];

    attachmentEvent: AttachmentEvent = null;
    attachmentEventAttachments: Array<Attachment> = null;

    notifications: Array<Notification> = [];
    shipments: Array<EventModel> = null;

    urlFromBrowser: string = null;
    alternatePartNumbers: [] = null;
    poNumber: [] = null;
}

export const state = new Baobab(new Tree());
