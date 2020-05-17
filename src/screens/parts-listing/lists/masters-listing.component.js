import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { branch } from "baobab-react/higher-order";
import BackendApi from "../../../services/backend";
import { partListingStyle as style } from '../part-listing.style';
import { SearchPartsItem } from '../../../models/search-parts-item';
import { PartMasterListItem } from ".././items/part-master-list-item";
import { ListingBase } from "./listing-base.component";
import { NoResulstsText } from "../../../components/no-results.component";

type Props = {
    partsList: Array<SearchPartsItem>,
    textSearch: string;
    onPressItem: Function;
    notSerialized: boolean;
};

@branch({
    partsList: ['partsMasterList'],
    textSearch: ['textSearch'],
})
export class MastersListing extends ListingBase<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.backendApi = (...args) => BackendApi.getPartMasterList.apply(BackendApi, [...args, props.notSerialized]);

        this.state = {
            refreshing: false,
            loading: false,
            page: 1,
            hasNext: true,
        };
    }

    renderItem(item: SearchPartsItem) {
        return (
            <PartMasterListItem onPress={() => this.props.onPressItem(item)} item={item}/>
        );
    }

    render() {
        if (!this.props.partsList) {
            return null;
        }

        if (!this.props.partsList.length) {
            return (<NoResulstsText/>);
        }

        return (
            <View style={[style.container]}>
                <FlatList
                    ref={ref => this.list = ref}
                    data={this.props.partsList}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => item.partMasterId.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshData()}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={this.onEndReachedThreshold}
                    initialNumToRender={this.initialNumToRender}
                    ListFooterComponent={() => this.state.loading ? (<ActivityIndicator/>) : <View style={{height: 200}}/>}
                    onMomentumScrollBegin={() => this.onMomentumScrollBegin()}
                    ItemSeparatorComponent={() => (<View style={{height: 4}}/>)}
                />
            </View>
        );
    }
}

MastersListing.defaultProps = {
    notSerialized: false
};
