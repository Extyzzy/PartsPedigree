import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
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
import LinearGradient from 'react-native-linear-gradient';
import {tabsHeaderStyle} from '../../components/tabs-header/tabs-heaeder.style';

type Props = {
    notifications: Array<Notification>;
}

@branch({
    notifications: ['notifications']
})
export class NotificationsList extends ListingBase<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };
    cursorNext = null;

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            loading: false,
            activeTab: 'Share Requests',
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

        this.cursorNext = await BackendApi.getNotificationsList(cursorNext);

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
        BackendApi.deleteNotification(item.notificationId);
    }

    deleteNotification(notificationId) {
        BackendApi.deleteNotification(notificationId);
    }

    renderItem(item: Notification) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onPressItem(item)}
            >
                <View style={style.notificationContainer}>
                    <View style={{flexBasis: '70%'}}>
                        <Text style={style.notificationTitleText}>{item.title}</Text>
                        <Text style={style.notificationText}>{item.text}</Text>
                    </View>
                    <CreatedDate date={item.createdAt}/>
                </View>
            </TouchableOpacity>
        )
    }

    getNode(item) {
        let shares = [];
        let requests = [];
        requests = this.props.notifications && this.props.notifications.filter(notification => notification.title === 'Access Request');
        shares = this.props.notifications && this.props.notifications.filter(notification => notification.title === 'Share');
        switch (item) {
            case 'Share Requests':
                return (
                    <FlatList
                        ref={ref => this.list = ref}
                        data={shares}
                        renderItem={({item}) => this.renderItem(item)}
                        keyExtractor={item => item.notificationId.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.refreshData()}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={this.onEndReachedThreshold}
                        initialNumToRender={this.initialNumToRender}
                        ListFooterComponent={() => this.state.loading && (<ActivityIndicator/>)}
                        onMomentumScrollBegin={() => this.onMomentumScrollBegin()}
                        ItemSeparatorComponent={() => (<View style={{height: 4}}/>)}
                    />);
            case 'Request Access':
                return (
                    <FlatList
                        ref={ref => this.list = ref}
                        data={requests}
                        renderItem={({item}) => this.renderItem(item)}
                        keyExtractor={item => item.notificationId.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.refreshData()}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={this.onEndReachedThreshold}
                        initialNumToRender={this.initialNumToRender}
                        ListFooterComponent={() => this.state.loading && (<ActivityIndicator/>)}
                        onMomentumScrollBegin={() => this.onMomentumScrollBegin()}
                        ItemSeparatorComponent={() => (<View style={{height: 4}}/>)}
                    />);
            default:
                return null;
        }
    }

    render() {
        if (!this.props.notifications) {
            return null;
        }

        if (!this.props.notifications.length) {
            return (<NoResulstsText/>);
        }
        const tabs = ['Share Requests', 'Request Access'];
        return (
            <View style={[commonStyle.flex(1), {flexDirection: 'column'}]}>
                <LinearGradient
                    start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                    colors={['#40576e', '#b5bec8']}
                >
                    <ScrollView
                        style={tabsHeaderStyle.tabsContainerScroll}
                        horizontal
                        contentContainerStyle={{
                            alignItems: 'stretch',
                            flex: 1
                        }}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 10,
                        }}>
                            {tabs.map(tab => (
                                <TouchableOpacity key={tab} activeOpacity={0.5}
                                                  onPress={() => this.setState({activeTab: tab})  }>
                                    <Text
                                        style={[
                                            {
                                                color: '#ffffff',
                                                fontSize: 15,
                                                marginLeft: 10
                                            },
                                            this.state.activeTab === tab && tabsHeaderStyle.activeTabText,
                                        ]}
                                        accessibilityLabel={"Tab: " + tab.toUpperCase()}
                                    >{tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </LinearGradient>
                {this.getNode(this.state.activeTab)}
            </View>
        );
    }
}
