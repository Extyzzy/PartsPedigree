import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { branch } from 'baobab-react/higher-order';
import { partListingStyle as style } from '../part-listing.style';
import { PartInstance } from '../../../models/part-instance';
import BackendApi from '../../../services/backend/index';
import { ListingBase } from "./listing-base.component";
import { PartInstanceListItem } from "../items/part-instance.list-item";
import { NoResulstsText } from "../../../components/no-results.component";

type Props = {
    partsList: Array<PartInstance>;
    textSearch: string;
    onPressItem: Function;
};

@branch({
    partsList: ['partInstanceList'],
    textSearch: ['textSearch'],
})
export class InstancesListing extends ListingBase<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.backendApi = (...args) => BackendApi.getPartInstanceList.apply(BackendApi, args);

        this.state = {
            refreshing: false,
            loading: false,
            page: 1,
            hasNext: true,
        };
    }

    renderItem(item: PartInstance) {
        return (
            <PartInstanceListItem onPress={() => this.props.onPressItem(item)} item={item}/>
        )
    }

    render() {
        if (!this.props.partsList) {
            return <ActivityIndicator />;
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
                    keyExtractor={item => item.partInstanceId.toString()}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshData()}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={this.onEndReachedThreshold}
                    initialNumToRender={this.initialNumToRender}
                    onMomentumScrollBegin={() => this.onMomentumScrollBegin()}
                    ListFooterComponent={() => this.state.loading ? (<ActivityIndicator/>): <View style={{height: 200}}/>}
                    ItemSeparatorComponent={() => (<View style={{height: 4}}/>)}
                />
            </View>
        );
    }
}
