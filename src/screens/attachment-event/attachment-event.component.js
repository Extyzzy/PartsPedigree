import React from 'react';
import PropTypes from 'prop-types';
import { Content } from 'native-base';
import { View, Text, ActivityIndicator } from 'react-native';
import { EventAccessRequestModel } from "../../models/avent-access-request";
import { EventModel } from "../../models/eventModel";
import { branch } from "baobab-react/higher-order";
import BackendApi from "../../services/backend";
import { EventAccessRequests } from "../event-detail/event-access-requests.component";
import { eventDetailStyle } from "../../styles/evetn-detail.style";
import { AttachmentEvent } from "../../models/attachment-event";
import { commonStyle } from "../../styles/common.style";
import { EmailLink } from "../../components/email-link.component";
import { FormCheckbox } from "../../components/form-checkbox.component";
import { VerificationKey } from "../../components/verification-key.component";
import { detail81303Style as style } from "../detail-8130-3/detail-8130-3.style";
import { formatPartDate } from "../../utils/datetime";
import { FollowBtn, ShareBtn } from "../../components/interaction-buttons";
import { ShipPartsAttachments } from "../ship-parts/ship-part-attachments.component";
import { CommonEventDetailComponent } from "../../components/common-event-detail.component";

type Props = {
    requests: Array<EventAccessRequestModel>;
    event: EventModel;
}

@branch({
    event: ['event'],
    requests: ['eventAccessRequests'],
})
export class AttachmentEventDetail extends CommonEventDetailComponent<Props> {
    static childContextTypes = {
        getParentId: PropTypes.func,
    };

    getChildContext() {
        return {
            getParentId: () => ({ type: 'eventId', id: this.props.event.eventId }),
        };
    }

    render() {
        if (!this._eventIsLoaded()) {
            return (<ActivityIndicator />);
        }

        const { event, requests } = this.props;

        let attachmentEvent: AttachmentEvent = {};

        try {
            attachmentEvent = JSON.parse(event.data);
        } catch (e) {
            console.log(e);
        }

        return (
            <Content>
                <EventAccessRequests requests={requests}/>

                <View style={eventDetailStyle.container}>
                    <View style={commonStyle.flexRow}>
                        <View style={commonStyle.flex(0.5)}>
                            <Text style={eventDetailStyle.infoTitleText}>
                                {formatPartDate(event.createdAt)}
                            </Text>
                        </View>
                        <View style={commonStyle.flex(0.5)}>
                            <View
                                style={[commonStyle.rowBetween, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                                {event.canShare &&
                                <View style={commonStyle.paddingHorizontal(10)}>
                                    <ShareBtn onPress={() => this.share()}/>
                                </View>
                                }
                            </View>
                        </View>
                    </View>
                </View>

                <ShipPartsAttachments event={event} noTitle isDetail eventId={event.eventId} attachments={attachmentEvent.attachments}/>

                <View style={eventDetailStyle.container}>
                    {this.renderUserInfo('OWNER', event.owner)}
                    {this.renderSharedUsers()}
                    <View style={commonStyle.indent(15)}>
                        <VerificationKey hash={event.hash} blockchainAddress={event.blockchainAddress}/>
                    </View>
                </View>
            </Content>
        );
    }
}
