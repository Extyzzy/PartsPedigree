import {User} from "../models/user";
import {state} from '../state';
import {SearchPartsItem} from "../models/search-parts-item";
import {Country} from "../models/country";
import {PartMaster} from "../models/part-master";
import {PartInstance} from "../models/part-instance";
import {Organization} from "../models/organization";
import {ImageModel} from "../models/image";
import {EventModel} from "../models/eventModel";
import {EventAccessRequestModel} from "../models/avent-access-request";
import {ShipPartView} from "../models/ship-part-view";
import {ShipPartItem} from "../models/ship-part-item";
import {OrganizationAddress} from "../models/organization-address";
import {ShipPartItemView} from "../models/ship-part-item-view";
import {ShipPartEvent} from "../models/ship-part-event";

export class StateService {
  static setEvent(event: EventModel) {
    state.select('event').set(event);
  }
  static setPoNumber(poNumber) {
    state.select('poNumber').set(poNumber)
  }

  static setLastShipmentEvent(event: EventModel) {
    state.select('lastShipmentEvent').set(event);
  }

  static addEventToHistory(event: any) {

    let currentHistory = JSON.parse(
        JSON.stringify(state.select('eventHistory').get()));

    if (!currentHistory) {
      currentHistory = [];
    }
    currentHistory.push(
        {eventId: event.eventId, eventTypeId: event.eventTypeId});
    state.select('eventHistory').set(currentHistory);
  }

  static deleteLastEventFromHistory() {
    let currentHistory = JSON.parse(
        JSON.stringify(state.select('eventHistory').get()));
    if (currentHistory) {
      currentHistory.pop();
      state.select('eventHistory').set(currentHistory);
    }
  }

  static resetEventFromHistory() {
    state.select('eventHistory').set([]);
  }

  static getEventFromHistory() {
    return state.select('eventHistory').get();
  }

  static getLastShipmentEvent() {
    return state.select('lastShipmentEvent').get();
  }

  static setEventAccessRequest(requests: EventAccessRequestModel) {
    state.select('eventAccessRequests').set(requests);
  }

  static setReceiveReasons(reasons) {
    state.select('receiveReasons').set(reasons);
  }

  static removeRequestFromList(eventRequestId: string) {
    state.select('eventAccessRequests', {eventRequestId}).unset();
  }

  static setPartInstanceTimeLine(timeLine: Array<EventModel>) {
    state.select('partInstanceTimeLine').set(timeLine);
  }

  static setPartMasterTimeLine(timeLine: Array<EventModel>) {
    state.select('partMasterTimeLine').set(timeLine);
  }

  static setOrganizationAddress(organizationAddress: OrganizationAddress) {
    state.select('organizationAddress').set(organizationAddress);
  }

  static setUser(user: User) {
    state.select('user').set(user);
  }

  static setPartMasterItems(items: Array<SearchPartsItem>) {
    state.select('partsMasterList').set(items);
  }

  static concatPartMasterItems(items: Array<SearchPartsItem>) {
    state.select('partsMasterList').concat(items);
  }

  static setPartInstanceItems(items: Array<PartInstance>) {
    state.select('partInstanceList').set(items);
  }

  static concatPartInstanceItems(items: Array<PartInstance>) {
    state.select('partInstanceList').concat(items);
  }

  static setEventsItems(items: Array<EventModel>) {
    state.select('eventsList').set(items);
  }

  static concatEventsItems(items: Array<EventModel>) {
    state.select('eventsList').concat(items);
  }

  static updatePartItem(item: PartMaster) {
    state.select('partsMasterList', {partMasterId: item.partMasterId}).set(item);
  }

  static setCountriesList(items: Array<Country>) {
    state.select('countries').set(items);
  }

  static setPartMaster(partMaster: PartMaster) {
    state.select('partMaster').set(partMaster);
  }

  static setPartMasterDetail(partMaster: PartMaster) {
    state.select('partMasterDetail').set(partMaster);
  }

  static setPartInstance(partInstance: PartInstance) {
    state.select('partInstance').set(partInstance);
  }

  static setPartInstanceDetail(partInstance: PartInstance) {
    state.select('partInstanceDetail').set(partInstance);
  }

  static setActiveTab(tab: string) {
    state.select('activeTab').set(tab);
  }
  static setAlternatePartNumbers(numbers: Array) {
    state.select('alternatePartNumbers').set(numbers);
  }

  static getActiveTab() {
    return state.select('activeTab').get();
  }

  static setActiveTabPartMaster(tab: string) {
    state.select('activeTabPartMaster').set(tab);
  }

  static setAttachmentsTimeline(attachments: Array) {
    state.select('attachmentsTimeline').set(attachments);
  }

  static setAttachmentsTimelineByTag(attachments: string, selected: string = null) {
    const filteredByTag = attachments.filter(obj => {
      return obj.tags.find(item => {
        return item.tagId === selected
      });
    });

    return state.select('attachmentsTimelineByTag').set(filteredByTag);
  }

  static setOrganization(organization: Array<Organization>) {
    state.select('organizations').set(organization);
  }

  static setImageForFill(image: ImageModel) {
    state.select('imageForFill').set(image);
  }

  static setTextSearch(str: string = null) {
    state.select('textSearch').set((str && str.toString && str.toString()) || null);
  }

  static setUrlFromBrowser(str: string = null) {
    state.select('urlFromBrowser').set((str && str.toString && str.toString()) || null);
  }

  static setTextSearchShipParts(textShipPart: boolean = false) {
    state.select('textShipPart').set(textShipPart);
  }

  static setShipPart(shipPart: ShipPartView) {
    state.select('shipPart').set(shipPart);
  }

  static setShipPartItems(items: Array<ShipPartItem>) {
    state.select('shipPartItems').set(items);
  }

  static setShipPartItem(item: ShipPartItemView) {
    if (item && item.cureDate === -1) {
      delete item.cureDate;
    }

    if (item && item.invoiceDate === -1) {
      delete item.invoiceDate;
    }
    state.select('shipPartItem').set(item);
  }

  static deleteShipItemFromList(shipItemId: string) {
    state.select('shipPartItems', {shipItemId}).unset();
  }

  static setPartInstanceDrafts(drafts: Array<ShipPartView>) {
    state.select('partInstanceDrafts').set(drafts);
  }

  static setPartMasterDrafts(drafts: Array<ShipPartView>) {
    state.select('partMasterDrafts').set(drafts);
  }

  static setShipPartAttachments(attachments) {
    state.select('shiPartAttachments').set(attachments);
  }

  static removeShipPartAttachmentFromList(attachmentId) {
    state.select('shiPartAttachments', {attachmentId}).unset();
  }

  static setShipItemAttachments(attachments) {
    state.select('shipItemAttachments').set(attachments);
  }

  static updateAttachment(attachmentId, description) {
    state.select('shiPartAttachments', {attachmentId}, 'description').set(description);
  }

  static removeShipItemAttachmentFromList(attachmentId) {
    state.select('shipItemAttachments', {attachmentId}).unset();
  }

  static setReceivePart(receivePart) {
    state.select('receivePart').set(receivePart);
  }

  static setEvent81303(event) {
    state.select('event81303').set(event);
  }

  static setEvent81303Items(items) {
    state.select('event81303Items').set(items);
  }

  static deleteEvent81303ItemFromList(event81303ItemId: string) {
    state.select('event81303Items', {event81303ItemId}).unset();
  }

  static setEvent81303Drafts(drafts) {
    state.select('event81303Drafts').set(drafts);
  }

  static setTags(tags) {
    state.select('tags').set(tags);
  }

  static setAttachmentEvent(attachmentEvent) {
    state.select('attachmentEvent').set(attachmentEvent);
  }

  static setAttachmentEventAttachments(attachments) {
    state.select('attachmentEventAttachments').set(attachments);
  }

  static removeAttachmentEventAttachmentsFromList(attachmentId) {
    state.select('attachmentEventAttachments', {attachmentId}).unset();
  }

  static setImageAndFilHelpModal(flag: boolean) {
    state.select('imageAndFilHelpModal').set(flag);
  }

  static setNotifications(notifications) {
    state.select('notifications').set(notifications);
  }

  static concatNotifications(notifications) {
    state.select('notifications').concat(notifications);
  }

  static removeNotificationFromList(notificationId) {
    state.select('notifications', {notificationId}).unset();
  }

  static concatIncomingShipments(shipments) {
    state.select('shipments').concat(shipments);
  }

  static setIncomingShipments(shipments) {
    state.select('shipments').set(shipments);
  }

  static concatOutBoundShipments(setOutBoundShipments) {
    state.select('outBoundShipments').concat(setOutBoundShipments);
  }

  static setOutBoundShipments(setOutBoundShipments) {
    state.select('outBoundShipments').set(setOutBoundShipments);
  }

  static concatFollowingList(following) {
    state.select('followingList').concat(following);
  }

  static setFollowingList(following) {
    state.select('followingList').set(following);
  }

  static concatDrafts(drafts) {
    state.select('drafts').concat(drafts);
  }

  static setDrafts(setDrafts) {
    state.select('drafts').set(setDrafts);
  }
}
