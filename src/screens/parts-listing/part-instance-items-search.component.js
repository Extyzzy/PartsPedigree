import React, { Component } from 'react';
import { PartInstance } from '../../models/part-instance';
import BackendApi from '../../services/backend';
import { InstancesListing } from "./lists/instances-listing.component";

type Props = {
    partsList: Array<PartInstance>
};

export class PartInstanceItemsListing extends Component<Props> {
    onPressItem(item: PartInstance) {
        BackendApi.getPartInstance(item.partInstanceId);
        this.props.navigation.goBack();
    }

    render() {
        return (<InstancesListing onPressItem={item => this.onPressItem(item)}/>);
    }
}
