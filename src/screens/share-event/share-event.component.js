import React, { Component } from 'react';
import { Alert } from 'react-native';
import { ShareScreen } from "../share/share.component";
import { branch } from "baobab-react/higher-order";
import { ShareEventModel } from "../../models/share-event";
import BackendApi from "../../services/backend";

@branch({
    organizations: ['organizations'],
})
export class ShareEvent extends Component {
    eventId: string;
    needUpdate: boolean;

    constructor(props) {
        super(props);
        const { params } = props.navigation.state;
        this.eventId = params && params.eventId;
        this.needUpdate = params && params.needUpdate;
    }

    cancel() {
        this.props.navigation.goBack();
    }

    share(data: ShareEventModel) {
        BackendApi.shareEvent(this.eventId, data)
            .then(() => {
                Alert.alert('Success', 'Event was successfully shared', [{
                    text: 'OK', onPress: () => this.cancel()
                }]);

                if (this.needUpdate) {
                    BackendApi.getEventById(this.eventId);
                }
            })
            .catch(({ problems, message }) => {
                Alert.alert('Error', `${message}${problems ? ` ${problems.join(', ')}`: ''}`);
            });
    }

    render() {
        return (
            <ShareScreen
                onCancelPress={() => this.cancel()}
                onSharePress={(data: ShareEventModel) => this.share(data)}
                organizations={this.props.organizations}
            />
        );
    }
}