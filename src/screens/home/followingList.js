import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { ListingBase } from "../parts-listing/lists/listing-base.component";
import BackendApi from "../../services/backend";
import { homeStyle as style } from "./home.style";
import { NoResulstsText } from "../../components/no-results.component";
import { commonStyle } from "../../styles/common.style";
import { branch } from "baobab-react/higher-order";
import { Notification } from "../../models/notification";
import { CreatedDate } from "../../components/created-date.component";
import { CrossBtn } from "../../components/cross-btn.component";
import { Event } from "../../components/event/event.component";
import {PartInstanceListItem} from "../parts-listing/items/part-instance.list-item";
import {PartMasterListItem} from "../parts-listing/items/part-master-list-item";
import {SearchPartsItem} from "../../models/search-parts-item";
import {PartInstance} from "../../models/part-instance";

type Props = {
    notifications: Array<Notification>;
}

@branch({
  followingList: ['followingList']
})
export class FollowingList extends ListingBase<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };
    cursorNext = null;

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            loading: false
        };
    }

    async onEndReached() {
        if (!this.scrollEventIsBlocking && !this.state.loading && this.cursorNext) {
            this.scrollEventIsBlocking = true;
            this.getData();
        }
    }

    async getData() {
        if (this.state.loading) {
            return false;
        }

        const { cursorNext } = this;

        this.setState({ loading: true });

        this.cursorNext = await BackendApi.getFollowingList(cursorNext);

        this.setState({
            loading: false,
            refreshing: false
        });

        return true;
    }

    refreshData() {
        this.cursorNext = null;
        this.setState({ refreshing: true }, () => this.getData());
    }

    onPressItem(item: Notification) {
        const screen = Event.getScreenNameByEventypeId(item.entityTypeId);
        this.context.getNavigation().navigate(screen, { eventId: item.entityId });
    }

      onPressMasterItem(data: SearchPartsItem) {
        this.context.getNavigation().navigate('PartMaster', { partMasterId: data.item.partMasterId });
      }

      onPressInstanceItem(data: PartInstance) {
        this.context.getNavigation().navigate('PartInstance', { partInstanceId: data.item.partInstanceId});
      }

    renderItem(data) {
        if (data.item.typeOfObject === 'partInstance') {
            return (
              <PartInstanceListItem
                key={data.partInstanceId}
                onPress={() => this.onPressInstanceItem(data)}
                item={data.item}
              />
            )
        } else if (data.item.typeOfObject === 'partMaster') {
            return (
              <PartMasterListItem
                key={data.partMasterId}
                onPress={() => this.onPressMasterItem(data)}
                item={data.item}
              />
            )
        }

        // Event Item
        // return (
        //     <TouchableOpacity
        //         activeOpacity={0.5}
        //         onPress={() => this.onPressItem(data)}
        //     >
        //         <View style={style.notificationContainer}>
        //             <View style={{flexBasis: '70%'}}>
        //                 <Text style={style.notificationTitleText}>{data.title}</Text>
        //                 <Text style={style.notificationText}>{data.text}</Text>
        //             </View>
        //             <CreatedDate date={item.createdAt}/>
        //         </View>
        //     </TouchableOpacity>
        // )
    }

    render() {
        const {followingList} = this.props;

        if (!this.props.followingList) {
            return null;
        }

        if (!followingList.length) {
            return (<NoResulstsText/>);
        }

        return (
            <View style={commonStyle.flex(1)}>
                <FlatList
                    ref={ref => this.list = ref}
                    data={this.props.followingList}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => item.date}
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshData()}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold={this.onEndReachedThreshold}
                    initialNumToRender={this.initialNumToRender}
                    ListFooterComponent={() => this.state.loading && (<ActivityIndicator/>)}
                    onMomentumScrollBegin={() => this.onMomentumScrollBegin()}
                    ItemSeparatorComponent={() => (<View style={{ height: 4 }}/>)}
                />
            </View>
        );
    }
}
