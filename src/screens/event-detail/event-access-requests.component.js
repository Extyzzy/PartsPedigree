import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'native-base';
import { eventDetailStyle as style } from '../../styles/evetn-detail.style';
import { FormSplitter } from "../../components/form-splitter.component";
import BackendApi from "../../services/backend";
import { commonStyle } from "../../styles/common.style";
import { EventAccessRequestModel } from "../../models/avent-access-request";
import { formatPartDate } from "../../utils/datetime";

type Props = {
    requests: Array<EventAccessRequests>;
}

export class EventAccessRequests extends PureComponent<Props> {
    acceptRequest(requestId: string) {
        BackendApi.acceptEventRequest(requestId);
    }

    rejectRequest(requestId: string) {
        BackendApi.rejectEventRequest(requestId);
    }

    renderRequest(request: EventAccessRequestModel) {
        const { user } = request;
        return (
            <View style={style.requestContainer} key={request.eventRequestId}>
                <Text style={commonStyle.indent(10)}>
                    Access to this event was requested by
                    User {user.firstName} {user.lastName} on {formatPartDate(request.createdAt)}
                </Text>
                <View style={[commonStyle.flexRow, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                    <TouchableOpacity
                        onPress={() => this.acceptRequest(request.eventRequestId)}
                        style={[style.requestBtn, commonStyle.marginHorizontal(10)]}
                        activeOpacity={0.5}
                    >
                        <Text style={style.requestBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.rejectRequest(request.eventRequestId)}
                        style={[style.requestBtn, commonStyle.marginHorizontal(10)]}
                        activeOpacity={0.5}
                    >
                        <Text style={style.requestBtnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        if (!this.props.requests || !this.props.requests.length) {
            return null;
        }

        return (
            <View>
                <FormSplitter text="Access requests"/>
                {this.props.requests.map(request => this.renderRequest(request))}
            </View>
        );
    }
}