import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {eventStyle as style} from './event.style';
import {EventModel} from "../../models/eventModel";
import {commonStyle} from "../../styles/common.style";
import {CreatedDate} from "../created-date.component";
import {InteractionPanel} from "../interaction-buttons";
import BackendApi from "../../services/backend";
import {VerificationKey} from "../verification-key.component";
import {Detail81303Screen} from "../../screens/detail-8130-3/detail-8130-3.component";
import {events, general} from "../../constants/accessability";
import {AttachmentEventDetail} from "../../screens/attachment-event/attachment-event.component";
import {ScreenDetector} from "../../utils/screen-detector";
import {ServerImage} from "../server-image.component";
import {StateService} from "../../services/state.service";
import {EventTypes} from "../../utils/EventTypes";

type Props = {
    event: EventModel;
}

export class Event extends PureComponent<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    static getScreenNameByEventypeId(eventTypeId) {
        let screen;
        switch (eventTypeId) {
            case 7:
                screen = 'ShipPartsDetail';
                break;
            case 8:
                screen = 'ReceivePartsDetail';
                break;
            case 9:
                screen = 'Detail81303Screen';
                break;
            case 10:
                screen = 'AttachmentEventDetail';
                break;
            case 11:
                screen = 'ArrivalEventDetail';
                break;
            default:
                screen = 'EventDetail';
        }
        return screen;
    }

    share() {
        this.context.getNavigation().navigate('ShareEvent', {eventId: this.props.event.eventId});
    }

    viewMore() {
        const screen = Event.getScreenNameByEventypeId(this.props.event.eventTypeId);
        StateService.resetEventFromHistory();
        StateService.addEventToHistory({
            eventId: this.props.event.eventId,
            eventTypeId: this.props.event.eventTypeId
        });
        this.context.getNavigation().navigate(screen, {
            eventId: this.props.event.eventId,
            eventTypeId: this.props.event.eventTypeId,
            fromArrival: true
        });
    }

    requestAccess() {
        BackendApi.requestEventAccess(this.props.event.eventId)
            .then(() => {
                Alert.alert('Success', 'Request was successfully sent');
            });
    }

    renderKey() {
        const {event} = this.props;

        return <VerificationKey
            eventsCard
            hash={event.hash}
            blockchainAddress={event.blockchainAddress}/>
    }

    renderRestrictedPanel() {
        return (
                <View style={[commonStyle.alignCenter, {flexGrow: 1, marginRight: 10}]}>
                    <Image
                        style={[style.restrictedIcon, commonStyle.indent(10)]}
                        source={require('../../assets/icons/icon_restricted.png')}
                        accessibilityLabel={events.restrictedAccessIcon}/>
                    <Text
                        style={style.restrictedBtnText}
                        accessibilityLabel={events.restrictedAccessText}>
                        RESTRICTED
                    </Text>
                </View>
        );
    }

    renderInterActionPanel() {
        return (
            <InteractionPanel
                event = {'event'}
                isFollowed={this.props.event.isFollowed}
                onFollow={() => BackendApi.followEvent(this.props.event.eventId)}
                onUnfollow={() => BackendApi.unfollowEvent(this.props.event.eventId)}
                noShare={!this.props.event.canShare}
                onPressShare={() => this.share()}
            />
        );
    }

    renderPartInfo() {
        const {event} = this.props;
        const typeEvent = event.eventTypeId === EventTypes.SHIPMENT ||
          event.eventTypeId === EventTypes.ARRIVAL ||
          event.eventTypeId === EventTypes.SHIPMENT;

        return (
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
                <View>
                  {
                    event.partInstance && event.partMaster  &&(
                      <View>
                        <Text
                          accessibilityLabel={
                            "PART #: " + (event.partMaster && event.partMaster.mpn) || (event.partInstance && event.partInstance.partMaster.orgPartNumber || event.partInstance.partMaster.mpn)
                          }>
                          PART
                          #: {(event.partMaster && event.partMaster.mpn) || (event.partInstance && event.partInstance.partMaster.orgPartNumber || event.partInstance.partMaster.mpn)}
                        </Text>
                        <Text
                          accessibilityLabel={
                            "NAME: " + (event.partMaster && event.partMaster.partName) || (event.partInstance && event.partInstance.name)
                          }>
                          NAME: {(event.partMaster && event.partMaster.partName) || (event.partInstance && event.partInstance.name)}
                        </Text>
                      </View>
                    )
                  }

                {
                  ! event.isRestricted && typeEvent ?
                    <View>
                      {
                        event.fromOrganization && (event.eventTypeId === EventTypes.RECEIVING || event.eventTypeId === EventTypes.ARRIVAL) &&(
                          <Text
                            accessibilityLabel={
                              "From: " + (event.fromOrganization && event.fromOrganization.name)
                            }>
                            From: {event.fromOrganization.name}
                          </Text>
                        )
                      }
                      {
                        event.toOrganization && (event.eventTypeId === EventTypes.SHIPMENT || event.eventTypeId === EventTypes.ARRIVAL) &&(
                          <Text
                            accessibilityLabel={
                              "To: " + (event.toOrganization && event.toOrganization.name)
                            }>
                            To: {event.toOrganization.name}
                          </Text>
                        )
                      }

                        {
                            (EventTypes.ARRIVAL === event.eventTypeId &&(
                                <Text
                                    accessibilityLabel={
                                        "Shipment #: " + event.shippingEventId
                                    }>
                                    Shipment #: {event.shippingEventId}
                                </Text>
                            )) || (event.shipmentId !== '' &&(
                                <Text
                                    accessibilityLabel={
                                        "Shipment #: " + event.shipmentId
                                    }>
                                    Shipment #: {event.shipmentId}
                                </Text>
                            )) || (event.eventId &&(
                                <Text
                                    accessibilityLabel={
                                        "Shipment #: " + event.shipmentId
                                    }>
                                    Shipment #: {event.eventId}
                                </Text>
                            ))
                        }
                    </View> : null
                }
                </View>
            </View>
        );
    }

    renderLogo() {
        const {event} = this.props;
        console.log(event);
        if ( ! event.partInstance && !event.partMaster && event.owner.organizationLogoPath !== '' || event.owner.organizationLogoPath) {
            return (
              <ServerImage
                style={{width: 70, height: 50, marginRight: 10,flexGrow: 1}}
                uri={event.owner.organizationLogoPath}
              />
              )
        } else {
            return(
              <View style={{width: 70, height: 50, marginRight: 10, flexGrow: 1,justifyContent: "center",alignItems: "center"}}>
                <Text>{this.props.event.owner.organization}</Text>
              </View>
           )
        }
    }

    render() {
        const {event} = this.props;
        let arrayOfIds = [];
        event.receivingEvents.map(event => {
            arrayOfIds.push(event.partInstanceIds)
        });
        if (!this.props.event) {
            return null;
        }

        const {isRestricted} = event;

        const hashFinger = !event.hash || !event.blockchainAddress;

        return (
            <TouchableOpacity onPress={() => isRestricted ? null : this.viewMore()}
                              style={[style.container, commonStyle.rowBetween]}>
              {
                (isRestricted && this.renderRestrictedPanel() || ((
                  this.renderLogo()
                  ))
                )
              }

              <View style={{flexGrow: 1 }}>
                <View style={[commonStyle.rowBetween, commonStyle.indent(ScreenDetector.isPhone() ? 5 : 15)]}>
                  <View style={[commonStyle.rowBetween, {flexGrow: 1 }]}>
                    <Text
                        style={[commonStyle.textBold, {width: 100}]}
                        accessibilityLabel={event.eventTypeName.toUpperCase()}>
                        {event.eventTypeName.toUpperCase()}
                    </Text>

                  </View>
                    <CreatedDate date={event.createdAt}/>
                </View>
                {
                    event.eventTypeId === EventTypes.SHIPMENT && (
                        <View style={[commonStyle.flexRow, commonStyle.indent(5)]}>
                            {
                                event.arrivalEvent && (
                                    <Text style={[{marginRight: 10}]}>ARV</Text>
                                )
                            }

                            {
                                event.receivingEvents.length > 0 && event.partInstanceIds.length > 0 && arrayOfIds.length < event.partInstanceIds.length &&
                                (
                                    <Text>PRCV</Text>
                                )
                            }
                            {
                                event.receivingEvents.length > 0 && event.partInstanceIds.length > 0 &&
                                arrayOfIds.length === event.partInstanceIds.length  &&
                                (
                                  <Text>RCV</Text>
                                )
                            }
                        </View>
                    )
                }
                {this.renderPartInfo()}
                { hashFinger && (
                  <Text
                    style={{
                        color: '#8F9CAB',
                      fontSize: ScreenDetector.isPhone() ? 11 : 18
                    }}
                    accessibilityLabel={general.signatureNoSign}>
                        Not Yet Verified
                  </Text>
                )}

                <View style={[commonStyle.flexRow, commonStyle.justifyEnd, {
                      position: 'absolute',
                      bottom: 0,
                      right: 10
                    }]}>
                  { hashFinger ?  null : this.renderKey()}
                  {
                    (isRestricted &&(
                      <TouchableOpacity
                        onPress={() => this.requestAccess()}
                        activeOpacity={0.5}
                        style={[commonStyle.flexRow, commonStyle.alignCenter, commonStyle.paddingHorizontal(10)]}
                        accessibilityLabel={events.requestAccessButton}
                      >
                        <Image
                          style={style.requestAccessIcon}
                          source={require('../../assets/icons/icon_request_access.png')}
                          accessibilityLabel={events.requestAccessIcon}/>
                        <Text
                          style={style.requestAccessBtnText}
                          accessibilityLabel={events.requestAccessText}>
                          Request Access
                        </Text>
                      </TouchableOpacity>
                    )) || (
                      this.renderInterActionPanel()
                    )
                  }
                </View>
              </View>
            </TouchableOpacity>
        )
    }
}
