import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { branch } from 'baobab-react/higher-order';
import { partListingStyle as style } from '../part-listing.style';
import BackendApi from '../../../services/backend';
import { ListingBase } from "./listing-base.component";
import { EventModel } from "../../../models/eventModel";
import { Event } from "../../../components/event/event.component";
import { NoResulstsText } from "../../../components/no-results.component";

type Props = {
    eventsList: Array<EventModel>;
};

@branch({
    eventsList: ['eventsList'],
    textSearch: ['textSearch'],
})
export class EventsListing extends ListingBase<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.backendApi = (...args) => BackendApi.getEventsLists.apply(BackendApi, args);
        this.state = {
            refreshing: false,
            loading: false,
            page: 1,
            hasNext: true,
        };
    }

    renderItem(item: EventModel) {
        return (
            <Event event={item} />
        )
    }

    render() {
        if (!this.props.eventsList) {
            return <ActivityIndicator />;
        }

        if (!this.props.eventsList.length) {
            return (<NoResulstsText/>);
        }
        return (
            <View style={[style.container]}>
                <FlatList
                    ref={ref => this.list = ref}
                    data={this.props.eventsList}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={(item,index) => index}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshData()}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={this.onEndReachedThreshold}
                    initialNumToRender={this.initialNumToRender}
                    onMomentumScrollBegin={() => this.onMomentumScrollBegin()}
                    ListFooterComponent={() => this.state.loading ? (<ActivityIndicator/>) : <View style={{height: 200}}/>}
                    ItemSeparatorComponent={() => (<View style={{height: 4}}/>)}
                />
            </View>
        );
    }
}
