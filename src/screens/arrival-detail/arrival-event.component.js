import React from 'react';
import Moment from "moment";
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import { Content, View, Text } from 'native-base';
import { EventAccessRequestModel } from "../../models/avent-access-request";
import { EventModel } from "../../models/eventModel";
import { branch } from "baobab-react/higher-order";
import { CommonEventDetailComponent } from "../../components/common-event-detail.component";
import { EventAccessRequests } from "../event-detail/event-access-requests.component";
import { FormSplitter } from "../../components/form-splitter.component";
import { eventDetailStyle as style } from "../../styles/evetn-detail.style";
import { commonStyle } from "../../styles/common.style";
import { CreatedDate } from "../../components/created-date.component";
import { ShareBtn } from "../../components/interaction-buttons";
import { VerificationKey } from "../../components/verification-key.component";
import { ShipPartEvent } from "../../models/ship-part-event";
import { ShipPartsItems } from "../ship-parts/ship-parts-items.component";
import { StateService } from "../../services/state.service";
import {EventTypes} from "../../utils/EventTypes";
import {ArrivalAttachments} from "./arrival-attachments";

type Props = {
    event: EventModel;
    requests: Array<EventAccessRequestModel>;
}

@branch({
    event: ['event'],
    requests: ['eventAccessRequests']
})
export class ArrivalEventDetail extends CommonEventDetailComponent<Props> {
    onPressItem(item) {
        StateService.setShipPartItem({ ...item, eventId: this.props.event.eventId });
        this.props.navigation.navigate('ArrivalItemDetail');
    }

  viewShippingEvent() {
    const shippingEventId = this.props.event.shippingEventId;
    StateService.addEventToHistory(
      {eventId: shippingEventId, eventTypeId: EventTypes.SHIPMENT});
    this.props.navigation.navigate('ShipPartsDetail', {
      eventId: shippingEventId,
      eventTypeId: EventTypes.SHIPMENT
    });
  }

    render() {
        if (!this._eventIsLoaded()) {
            return (<ActivityIndicator/>);
        }

        const { event, requests } = this.props;
        const { owner, createdAt } = event;

        let shipPartEvent: ShipPartEvent = {};

        try {
            shipPartEvent = JSON.parse(event.data);
        } catch (e) {
            console.log(e);
        }

        return (
            <Content>
                <EventAccessRequests requests={requests}/>
                <FormSplitter text="Arrival"/>
                <View style={style.container}>
                    <View style={[commonStyle.rowBetween, commonStyle.indent(5)]}>
                        <View>
                            <Text style={[style.titleText, commonStyle.textItalic]}>EVENT
                                ID: {this.props.event.eventId}</Text>
                        </View>
                        <CreatedDate date={createdAt}/>
                    </View>
                    <View style={[commonStyle.rowBetween, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                        {event.canShare &&
                        <View style={commonStyle.paddingHorizontal(10)}>
                            <ShareBtn onPress={() => this.share()}/>
                        </View>
                        }
                    </View>
                    <View style={style.infoContainer}>
                        <Text style={style.infoTitleText}>ARRIVAL DETAILS</Text>
                        <Text style={style.text}>
                            <Text style={commonStyle.textBold}>Date: </Text>
                            <Text>{Moment(+createdAt).format('DD MMM YYYY')}</Text>
                        </Text>
                        <Text style={style.text}>
                            <Text style={commonStyle.textBold}>Time: </Text>
                            <Text>{Moment(+createdAt).format('HH[h]mm')}</Text>
                        </Text>
                    </View>
                    {this.renderUserInfo('ARRIVAL RECORDED BY', owner)}
                    {this.renderSharedUsers()}


                    <View style={commonStyle.indent(15)}>
                        <VerificationKey hash={event.hash} blockchainAddress={event.blockchainAddress}/>
                    </View>

                  <View style={[{flexDirection: 'row'}, commonStyle.marginHorizontal(10), commonStyle.indent(20)]}>
                    <Text style={[{fontWeight: 'bold'}, style.textTitle, commonStyle.textItalic]}>Shipping event: </Text>
                    <TouchableOpacity
                      onPress={() => this.viewShippingEvent()}
                      activeOpacity={0.5}>
                      <Text> >> view details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ShipPartsItems
                    paperClip={false}
                    detail
                    formTitle="ARRIVED ITEMS"
                    eventId={event.eventId}
                    onPressItem={item => this.onPressItem(item)}
                    items={shipPartEvent.items || []}
                />
                <ArrivalAttachments isDetail eventId={this.props.event.eventId}
                                      attachments={shipPartEvent.attachments}/>
            </Content>
        );
    }
}
