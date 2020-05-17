import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Content, View, Text } from 'native-base';
import { branch } from "baobab-react/higher-order";
import { EventAccessRequestModel } from "../../models/avent-access-request";
import { EventModel } from "../../models/eventModel";
import { EventAccessRequests } from "../event-detail/event-access-requests.component";
import { FormSplitter } from "../../components/form-splitter.component";
import BackendApi from "../../services/backend";
import { eventDetailStyle } from "../../styles/evetn-detail.style";
import { commonStyle } from "../../styles/common.style";
import { FormCheckbox } from "../../components/form-checkbox.component";
import { VerificationKey } from "../../components/verification-key.component";
import { EmailLink } from "../../components/email-link.component";
import { FollowBtn, ShareBtn } from "../../components/interaction-buttons";
import { formatPartDate } from "../../utils/datetime";
import { Event81303View } from "../../models/event81303View";
import { Detail81303Info } from "./detail-8130-1-info.component";
import { detail81303Style as style } from './detail-8130-3.style';

type Props = {
    event: EventModel;
    requests: Array<EventAccessRequestModel>;
}

@branch({
    event: ['event'],
    requests: ['eventAccessRequests']
})
export class Detail81303Screen extends Component<Props> {
    componentDidMount() {
        const { params } = this.props.navigation.state;

        if (params && params.eventId) {
            BackendApi.getEventById(params.eventId);
        }
    }

    share() {
        this.props.navigation.navigate('ShareEvent', { eventId: this.props.event.eventId, needUpdate: true });
    }

    renderSharedUsers() {
        if (!this.props.event.users) {
            return null;
        }

        return (
            <View style={style.infoContainer}>
                <Text style={eventDetailStyle.infoTitleText}>SHARED WITH</Text>
                {this.props.event.users.map(user => (
                    <Text key={user.username} style={commonStyle.indent(5)}>
                        {`${user.firstName} ${user.lastName}, ${user.organization || 'N/A'}, `}
                        <EmailLink style={style.email} email={user.email}/>
                    </Text>
                ))
                }
            </View>
        );
    }

    renderResponsibilities() {
        return (
            <View style={style.container}>
                <Text style={[style.text, commonStyle.indent()]}>
                    It is important to understand that the existence of this document alone does not automatically
                    constitute authority to install the aircraft engine/propeller/article.
                </Text>
                <Text style={[style.text, commonStyle.indent()]}>
                    Where the user/installer performs work in accordance with the national regulations of an
                    airworthiness authority different than the airworthiness authority of the country specified in
                    Block 1, it is essential that the user/installer ensures that his/her airworthiness authority
                    accepts aircraft engine(s)/propeller(s)/article(s) from the airworthiness authority of the country
                    specified in Block 1.
                </Text>
                <Text style={[style.text, commonStyle.indent()]}>
                    Statements in Blocks 13a and 14a do not constitute installation certification. In all cases,
                    aircraft maintenance records must contain an installation certification issued in accordance with
                    the
                    national regulations by the user/installer before the aircraft may be flown.
                </Text>
            </View>
        );
    }

    render() {
        if (!this.props.event) {
            return (<ActivityIndicator/>);
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
                <View style={eventDetailStyle.container}>
                    <View style={commonStyle.flexRow}>
                        <View style={commonStyle.flex(0.5)}>
                            <Text style={eventDetailStyle.infoTitleText}>
                                {formatPartDate(event.createdAt)}
                            </Text>
                        </View>
                        <View style={commonStyle.flex(0.5)}>
                            <View style={[commonStyle.rowBetween, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                                {event.canShare &&
                                <View style={commonStyle.paddingHorizontal(10)}>
                                    <ShareBtn onPress={() => this.share()}/>
                                </View>
                                }
                                <View style={commonStyle.paddingHorizontal(10)}>
                                    <FollowBtn onPress={() => {}}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={eventDetailStyle.infoContainer}>
                        <Text style={eventDetailStyle.infoTitleText}>OWNER</Text>
                        <Text>{event.owner.firstName} {event.owner.lastName}</Text>
                        <Text>{event.owner.organization || 'N/A'}</Text>
                        <EmailLink style={eventDetailStyle.email} email={event.owner.email}/>
                    </View>
                    {this.renderSharedUsers()}
                    <View style={commonStyle.indent(15)}>
                        <VerificationKey hash={event.hash} blockchainAddress={event.blockchainAddress}/>
                    </View>
                </View>
                <FormSplitter text="8130-3"/>
                <Detail81303Info user={this.props.event.owner} event81303={event81303} />
                <FormSplitter text="USER/INSTALLER RESPONSIBILITIES"/>
                {this.renderResponsibilities()}
            </Content>
        );
    }
}