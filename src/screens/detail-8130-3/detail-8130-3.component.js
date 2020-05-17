import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Content, View, Text } from 'native-base';
import { branch } from "baobab-react/higher-order";
import { EventAccessRequestModel } from "../../models/avent-access-request";
import { EventModel } from "../../models/eventModel";
import { EventAccessRequests } from "../event-detail/event-access-requests.component";
import { FormSplitter } from "../../components/form-splitter.component";
import { eventDetailStyle } from "../../styles/evetn-detail.style";
import { commonStyle } from "../../styles/common.style";
import { FormCheckbox } from "../../components/form-checkbox.component";
import { VerificationKey } from "../../components/verification-key.component";
import { FollowBtn, ShareBtn } from "../../components/interaction-buttons";
import { Event81303View } from "../../models/event81303View";
import { Detail81303Info } from "./detail-8130-1-info.component";
import { FormButton } from "../../components/form-button.component";
import { CreatedDate } from "../../components/created-date.component";
import { PdfView } from "../pdf-view/pdw-view.component";
import properties from '../../../properties';
import { CommonEventDetailComponent } from "../../components/common-event-detail.component";
import { AuthService } from "../../services/auth.service";
import { ScreenDetector } from "../../utils/screen-detector";
import BackendApi from "../../services/backend";

type Props = {
    event: EventModel;
    requests: Array<EventAccessRequestModel>;
}

@branch({
    event: ['event'],
    requests: ['eventAccessRequests']
})
export class Detail81303Screen extends CommonEventDetailComponent<Props> {
    showPdf() {
        AuthService.getToken().then(token => {
            this.props.navigation.navigate('PdfView', {
                url: `${properties.baseUrl}v1/events/${this.props.event.eventId}/pdf?token=${token}`
            });
        });
    }

    renderHeader() {
        const { event } = this.props;

        return (
            <View style={eventDetailStyle.container}>
                <View style={commonStyle.flexRow}>
                    <View style={[commonStyle.flex(0.5), commonStyle.justifyEnd]}>
                        <View style={commonStyle.width(ScreenDetector.isPhone() ? 120 : 240)}>
                            <FormButton text="View 8130-3" onPress={() => this.showPdf()}/>
                        </View>
                    </View>
                    <View style={[commonStyle.flex(0.5), commonStyle.alignEnd]}>
                        <View style={commonStyle.indent(10)}>
                            <CreatedDate date={event.createdAt}/>
                        </View>
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
        );
    }

    render() {
        if (!this._eventIsLoaded()) {
            return (<ActivityIndicator />);
        }

        const { event, requests } = this.props;

        let event81303: Event81303View = {};

        try {
            event81303 = JSON.parse(event.data);
        } catch (e) {
            console.log(e);
        }

        return (
            <Content>
                <EventAccessRequests requests={requests}/>
                <FormSplitter text={event.eventTypeName}/>
                {this.renderHeader()}
                <Detail81303Info navigation={this.props.navigation} event81303={event81303}/>
                <View style={eventDetailStyle.container}>
                    {
                        event.owner && this.renderUserInfo('CREATED AND DIGITALLY SIGNED BY', event.owner)
                    }
                    {this.renderSharedUsers()}

                    <View style={commonStyle.indent(15)}>
                        <VerificationKey hash={event.hash} blockchainAddress={event.blockchainAddress}/>
                    </View>
                </View>
            </Content>
        );
    }
}
