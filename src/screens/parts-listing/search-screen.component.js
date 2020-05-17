import React from 'react';
import { branch } from "baobab-react/higher-order";
import { SEARCH_TABS } from "../../home.navigation";
import { PartInstance } from "../../models/part-instance";
import { SearchPartsItem } from "../../models/search-parts-item";
import { SearchScreenCommon } from "./search-screen-common.component";

@branch({
    activeTab: ['activeTab'],
})
export class SearchScreen extends SearchScreenCommon {
    constructor(props) {
        super(props);
        this.SEARCH_TABS = SEARCH_TABS;
    }

    onPressInstanceItem(item: PartInstance) {
        this.props.navigation.navigate('PartInstance', item);
    }

    onPressMasterItem(item: SearchPartsItem) {
        this.props.navigation.navigate('PartMaster', { partMasterId: item.partMasterId });
    }
}
