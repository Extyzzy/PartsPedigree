import React from 'react';
import { PART_ITEMS_TABS } from "../../home.navigation";
import { SearchPartsItem } from "../../models/search-parts-item";
import { PartInstance } from "../../models/part-instance";
import BackendApi from "../../services/backend";
import { branch } from "baobab-react/higher-order";
import { SearchScreenCommon } from "./search-screen-common.component";
import { StateService } from "../../services/state.service";

@branch({
    activeTab: ['activeTab'],
})
export class PartItemsSearch extends SearchScreenCommon {
    constructor(props) {
        super(props);
        this.SEARCH_TABS = PART_ITEMS_TABS;
        this.notSerializedPartMaster = true;
    }

    componentDidMount() {
        StateService.setActiveTab(this.SEARCH_TABS[0]);
    }

    onPressInstanceItem(item: PartInstance) {
        StateService.setPartMaster(null);
        BackendApi.getPartInstance(item.partInstanceId);
        this.props.navigation.goBack();
    }

    onPressMasterItem(item: SearchPartsItem) {
        StateService.setPartInstance(null);
        BackendApi.getPartMaster(item.partMasterId);
        this.props.navigation.goBack();
    }
}