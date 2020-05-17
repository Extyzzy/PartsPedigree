import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Content, View, Text } from 'native-base';
import { eventDetailStyle as style } from '../../styles/evetn-detail.style';
import { FormSplitter } from "../../components/form-splitter.component";
import { branch } from "baobab-react/higher-order";
import { EventModel } from "../../models/eventModel";
import { commonStyle } from "../../styles/common.style";
import { CreatedDate } from "../../components/created-date.component";
import { FollowBtn, ShareBtn } from "../../components/interaction-buttons";
import { VerificationKey } from "../../components/verification-key.component";
import { FormCheckbox } from "../../components/form-checkbox.component";
import { User } from "../../models/user";
import { EventAccessRequests } from "./event-access-requests.component";
import { EventAccessRequestModel } from "../../models/avent-access-request";
import { EmailLink } from "../../components/email-link.component";
import { CommonEventDetailComponent } from "../../components/common-event-detail.component";
import BackendApi from "../../services/backend";

type Props = {
    event: EventModel;
    requests: Array<EventAccessRequestModel>;
}

@branch({
    event: ['event'],
    requests: ['eventAccessRequests']
})
export class EventDetail extends CommonEventDetailComponent<Props> {
    renderChangedValues() {
        return (
            <View style={style.infoContainer}>
                <Text style={style.infoTitleText}>CHANGED VALUES</Text>
                <Text style={style.text}>{this.props.event.data}</Text>
            </View>
        );
    }

    render() {
        if (!this._eventIsLoaded()) {
            return (<ActivityIndicator />);
        }

        const { event, requests } = this.props;

        return (
            <Content>
                <EventAccessRequests requests={requests}/>
                <FormSplitter text={event.eventTypeName}/>
                <View style={style.container}>
                    <View style={[commonStyle.rowBetween, commonStyle.indent(5)]}>
                        <Text style={style.titleText}>
                            {(event.partMaster && event.partMaster.partName) ||
                            (event.partInstance && event.partInstance.name)}
                        </Text>
                        <CreatedDate date={event.createdAt}/>
                    </View>
                    <View style={[commonStyle.rowBetween, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                        {event.canShare &&
                        <View style={commonStyle.paddingHorizontal(10)}>
                            <ShareBtn onPress={() => this.share()}/>
                        </View>
                        }
                    </View>
                    {[3,4,6].indexOf(event.eventTypeId) > -1 && this.renderChangedValues()}
                    {[1,2,5].indexOf(event.eventTypeId) > -1 && event.owner && this.renderUserInfo('CREATED BY', event.owner)}
                    {[3,4,6].indexOf(event.eventTypeId) > -1 && event.owner &&  this.renderUserInfo('CHANGED BY', event.owner)}
                    { event.owner && this.renderUserInfo('OWNER', event.owner)}
                    {this.renderSharedUsers()}
                    <View style={commonStyle.indent(15)}>
                        <VerificationKey hash={event.hash} blockchainAddress={event.blockchainAddress}/>
                    </View>
                </View>
            </Content>
        );
    }
}
