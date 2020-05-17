import React from 'react';
import PropTypes from 'prop-types';
import {FormSplitter} from "../../components/form-splitter.component";
import {EventAccessRequestModel} from "../../models/avent-access-request";
import {EventAccessRequests} from "../event-detail/event-access-requests.component";
import {ShipPartsAttachments} from "../ship-parts/ship-part-attachments.component";
import {View, Text, ActivityIndicator, Alert, TouchableOpacity} from 'react-native';
import {Content} from 'native-base';
import {partEventsStyle as style} from "../../styles/part-event.style";
import {commonStyle} from "../../styles/common.style";
import {ShipPartsItems} from "../ship-parts/ship-parts-items.component";
import {ShipPartEvent} from "../../models/ship-part-event";
import {branch} from "baobab-react/higher-order";
import {EventModel} from "../../models/eventModel";
import {formatPartDate} from "../../utils/datetime";
import {FollowBtn, ShareBtn} from "../../components/interaction-buttons";
import {ShipPartInfoBlock} from "./ship-part-info-block.component";
import {StateService} from "../../services/state.service";
import {CommonEventDetailComponent} from "../../components/common-event-detail.component";
import {FormButton} from "../../components/form-button.component";
import {ArrivalEventModal} from "./arrival-event-modal.component";
import BackendApi from "../../services/backend";
import {VerificationKey} from "../../components/verification-key.component";
import {CreatedDate} from "../../components/created-date.component";
import {events} from "../../constants/accessability";
import {EventTypes} from "../../utils/EventTypes";
import {isEqual} from 'lodash';
import {state} from "../../state";

type Props = {
    requests: Array<EventAccessRequestModel>;
    event: EventModel;
}

@branch({
    event: ['event'],
    requests: ['eventAccessRequests'],
    shipPartItems: ['shipPartItems'],
})
export class ShipPartsDetail extends CommonEventDetailComponent<Props> {
    title: string;
    itemsTitle: string;

    constructor(props) {
        super(props);
        const {routeName} = props.navigation.state;
        if (routeName === 'ReceivePartsDetail') {
            this.title = 'Receive Parts';
            this.itemsTitle = 'ITEMS TO BE RECEIVED';
        } else {
            this.title = 'Ship Parts';
            this.itemsTitle = 'ITEMS TO BE SHIPPED';
        }
        this.attachFile = this.attachFile.bind(this);
    }

    static childContextTypes = {
        getParentId: PropTypes.func,
    };

    state = {
        modal: false,
        eventDraftId: '',
        containerReceived: 0
    };

    getChildContext() {
        return {
            getParentId: () => ({type: 'eventId', id: this.props.event.eventId}),
        };
    }

    changeContainerCount = (containerReceived) => {
        this.setState({containerReceived: containerReceived})
    };

    receivePart() {
        const {eventId} = this.props.event;
        let partInstanceIds = [];
        this.props.event.receivingEvents.map((event) => {
            event.partInstanceIds.map((id) => {
                partInstanceIds.push(id);
            })
        });
        this.props.navigation.navigate('ReceiveParts', {eventId, partInstanceIds});
    }

    openModal() {
        this.setState({modal: true});
    }

    closeModal() {
        this.setState({modal: false});
    }

    arrivalEvent() {
        if (this.state.containerReceived > this.props.event.data.containerCount || this.state.containerReceived === this.props.event.data.containerCount) {
            Alert.alert('Failed', 'Arrival event already recorded for this shipment.',
                [{
                    text: 'OK', onPress: () => {
                        BackendApi.refreshPartInstanceTimeLine();
                        this.props.navigation.goBack();
                    }
                }])
        } else {
            BackendApi.arrivalEvent(this.props.event.eventId)
                .then(() => {
                        Alert.alert('Success', 'Arrival event has been successfully created',
                            [{
                                text: 'OK', onPress: () => {
                                    BackendApi.refreshPartInstanceTimeLine();
                                    this.props.navigation.goBack();
                                }
                            }])
                    }
                );
        }
    }


    onPressItem(item) {
        StateService.setShipPartItem({...item, eventId: this.props.event.eventId});
        this.props.navigation.navigate(this.props.event.eventTypeId === 7 ? 'ShipPartsItemDetail' : 'ReceivePartsItemDetail');
    }

    renderTitle() {
        return (
            <View style={[commonStyle.rowBetween, commonStyle.indent(20)]}>
                <Text style={[style.textTitle, commonStyle.textItalic]}>EVENT ID: {this.props.event.eventId}</Text>
                <View>
                    <Text
                        style={[style.text, commonStyle.indent(10)]}>{formatPartDate(this.props.event.createdAt)}</Text>
                    {this.renderCommunications()}
                </View>
            </View>
        )
    }

    renderBtns() {
        const {canCreateReceiveEvent, canCreateArrivalEvent} = this.props.event;
        if (!canCreateArrivalEvent && !canCreateReceiveEvent) {
            return null;
        }
        const btnStyle = [commonStyle.width(150), commonStyle.marginHorizontal(10)];
        let partInstanceIds = [];
        this.props.event.receivingEvents.map((event) => {
            event.partInstanceIds.map((id) => {
                partInstanceIds.push(id);
            })
        });
        let shipPartEvent = JSON.parse(this.props.event.data);
        let shipPartEventItems = shipPartEvent.items;
        let shipPartEventIds = shipPartEventItems.filter((item) => {
            return partInstanceIds.map((e) => e.toString()).indexOf(item.partInstance.partInstanceId.toString()) === -1
        });
        return (
            <View style={[style.btnContainer, commonStyle.flexCenter]}>
                {canCreateArrivalEvent &&
                <View style={btnStyle}>
                    <FormButton disabled={shipPartEventIds.length === 0} text="Record Arrival"
                                onPress={() => this.openModal()}/>
                </View>
                }
                {canCreateReceiveEvent &&
                <View style={btnStyle}>
                    <FormButton disabled={shipPartEventIds.length === 0} text="Receive Parts"
                                onPress={() => this.receivePart()}/>
                </View>
                }
            </View>
        );
    }

    renderCommunications() {
        const {event} = this.props;
        return (
            <View style={[commonStyle.rowBetween, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                {event.canShare &&
                <View style={commonStyle.paddingHorizontal(10)}>
                    <ShareBtn onPress={() => this.share()}/>
                </View>
                }
            </View>
        );
    }

    viewPage() {
        this.props.navigation.navigate('ArrivalEventDetail', {
            eventId: this.props.event.arrivalEvent.eventId,
            eventIdShipping: this.props.event.eventId
        });
    }

    viewPageReceivedEvent(data) {
        StateService.addEventToHistory(
            {eventId: data.eventId, eventTypeId: EventTypes.RECEIVING});
        this.props.navigation.navigate('ReceivePartsDetail', {
            eventId: data.eventId,
            eventIdShipping: this.props.event.eventId,
            eventTypeId: EventTypes.RECEIVING
        });
    }

    viewShippingEvent() {
        const shippingEventId = this.props.event.shippingEventId;
        const {event} = this.props;

        const eventHistory = state.select('eventHistory').get();

        if (!eventHistory.length) {
            StateService.addEventToHistory(
                {eventId: parseInt(event.eventId), eventTypeId: event.eventTypeId});
        }

        StateService.addEventToHistory(
            {eventId: shippingEventId, eventTypeId: EventTypes.SHIPMENT});
        this.props.navigation.navigate('ShipPartsDetail', {
            eventId: shippingEventId,
            eventTypeId: EventTypes.SHIPMENT
        });
    }

    viewArrivalEvent() {
        const lastShipingEvent = StateService.getLastShipmentEvent();
        StateService.addEventToHistory({
            eventId: lastShipingEvent.arrivalEvent.eventId,
            eventTypeId: EventTypes.ARRIVAL
        });
        this.props.navigation.navigate('ArrivalEventDetail', {
            eventId: lastShipingEvent.arrivalEvent.eventId,
            eventTypeId: EventTypes.ARRIVAL
        });
    }

    attachFile() {
        let shipPartEvent = JSON.parse(this.props.event.data);
        if (this.state.eventDraftId) {
            this.props.navigation.navigate('AddAttachment', {
                id: this.state.eventDraftId,
                type: 'event',
                callback: () => {
                }
            })
        } else {
            if (parseInt(this.state.containerReceived) > parseInt(shipPartEvent.containerCount) || parseInt(this.state.containerReceived) === parseInt(shipPartEvent.containerCount)) {
                Alert.alert('Failed', 'All containers have been received.',
                    [{
                        text: 'OK', onPress: () => {
                            BackendApi.refreshPartInstanceTimeLine();
                            this.setState({modal: false});
                        }
                    }])
            } else {
                this.setState({modal: false});
                BackendApi.arrivalEventDraft(this.props.event.eventId).then(data => {
                        this.setState({eventDraftId: data.eventDraftId});
                        this.props.navigation.navigate('AddAttachment', {
                            id: this.state.eventDraftId,
                            type: 'event',
                            fromArrival: true,
                            containerReceived: this.state.containerReceived,
                            callback: () => {
                            }
                        })
                    }
                )
            }
        }
    };

    render() {
        if (!this._eventIsLoaded()) {
            return (<ActivityIndicator/>);
        }

        const {event, requests} = this.props;
        const lastShipingEvent = StateService.getLastShipmentEvent();
        let shipPartEvent: ShipPartEvent = {};

        try {
            shipPartEvent = JSON.parse(event.data);
        } catch (e) {
            console.log(e);
        }
        return (
            <View style={commonStyle.flex(1)}>
                <Content>
                    <EventAccessRequests requests={requests}/>
                    <FormSplitter text={this.title}/>
                    <View style={style.padding}>
                        {this.renderTitle()}
                        <ShipPartInfoBlock partEvent={shipPartEvent} users={event.users} event={event}/>
                        <View style={{marginTop: 10, marginBottom: 15}}>
                            <VerificationKey hash={event.hash} blockchainAddress={event.blockchainAddress}/>
                        </View>
                    </View>
                    {
                        lastShipingEvent && lastShipingEvent.arrivalEvent && (
                            <View
                                style={[{flexDirection: 'row'}, commonStyle.marginHorizontal(10), commonStyle.indent(20)]}>
                                <Text style={[style.textTitle, commonStyle.textItalic]}>Arrived on:</Text>
                                <Text style={[style.text, commonStyle.marginHorizontal(10), commonStyle.indent(10)]}>
                                    {formatPartDate(
                                        lastShipingEvent.arrivalEvent.createdAt)}</Text>
                                <TouchableOpacity
                                    onPress={() => this.viewArrivalEvent()}
                                    activeOpacity={0.5}>
                                    <Text> >> view details</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                    {
                        this.props.navigation.state.routeName === 'ReceivePartsDetail'
                        && this.props.event.shippingEventId ?
                            <View
                                style={[{flexDirection: 'row'}, commonStyle.marginHorizontal(10), commonStyle.indent(20)]}>
                                <Text style={[style.text, commonStyle.marginHorizontal(10), commonStyle.indent(10)]}>
                                    Go To Shipping Event</Text>
                                <TouchableOpacity
                                    onPress={() => this.viewShippingEvent()}
                                    activeOpacity={0.5}>
                                    <Text> >> view details</Text>
                                </TouchableOpacity>
                            </View> : null
                    }

                    {
                        event.receivingEvents.length > 0 && (
                            <View>
                                {
                                    event.receivingEvents.map((data, key) => {
                                        return (
                                            <View key={key}
                                                  style={[{flexDirection: 'row'}, commonStyle.marginHorizontal(10), commonStyle.indent(20)]}>
                                                <Text style={[style.textTitle, commonStyle.textItalic]}>Received
                                                    on:</Text>
                                                <Text
                                                    style={[style.text, commonStyle.marginHorizontal(10), commonStyle.indent(10)]}>
                                                    {formatPartDate(data.createdAt)}</Text>
                                                <TouchableOpacity
                                                    onPress={() => this.viewPageReceivedEvent(data)}
                                                    activeOpacity={0.5}>
                                                    <Text> >> view details</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        )
                    }

                    <ShipPartsItems
                        formTitle={this.itemsTitle}
                        detail
                        eventId={this.props.event.eventId}
                        onPressItem={item => this.onPressItem(item)}
                        items={shipPartEvent.items || []}
                    />
                    <ShipPartsAttachments isDetail eventId={this.props.event.eventId}
                                          attachments={shipPartEvent.attachments}/>
                    <View style={commonStyle.indent(60)}/>
                </Content>
                {this.renderBtns()}
                <ArrivalEventModal
                    attachFile={this.attachFile}
                    visible={this.state.modal}
                    closeModal={() => this.closeModal()}
                    onConfirm={() => this.arrivalEvent()}
                    containerCount={shipPartEvent.containerCount}
                    containerReceived={this.state.containerReceived}
                    changeContainerCount={this.changeContainerCount}
                />
            </View>
        )
    }
}