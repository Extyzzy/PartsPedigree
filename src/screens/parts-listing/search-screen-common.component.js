import React, { Component } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { MastersListing } from './lists/masters-listing.component';
import { InstancesListing } from './lists/instances-listing.component';
import { CommonListing } from "./lists/common-listing.component";
import { EventsListing } from "./lists/events-listing.component";
import { ScreenDetector } from "../../utils/screen-detector";
import { commonStyle } from "../../styles/common.style";
import { StateService } from "../../services/state.service";
import { PlusButton } from "../../components/pluss-button.component";
import { HomeMenuModal } from "../home/home-menu.component";

export class SearchScreenCommon extends Component {
    state = {
        modalVisible: false
    };
    SEARCH_TABS: Array<string>;
    onPressInstanceItem: Function;
    onPressMasterItem: Function;
    notSerializedPartMaster: boolean = false;

    componentDidUpdate(oldProps) {
        if (oldProps.activeTab !== this.props.activeTab) {
            try {
                const index = this.SEARCH_TABS.indexOf(this.props.activeTab);
                if (index > -1) {
                    this.listRef.scrollToIndex({ index });
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    onSelectMenu(route: string) {
        if (route) {
            this.setModalVisible(false);
            this.props.navigation.navigate(route);
        }
    }

    getNode(item) {
        switch (item) {
            case 'all':
                return (<CommonListing/>);
            case 'part master':
                return (<MastersListing
                    notSerialized={this.notSerializedPartMaster}
                    onPressItem={item => this.onPressMasterItem(item)}/>);
            case 'part instance':
                return (<InstancesListing onPressItem={(item) => this.onPressInstanceItem(item)}/>);
            case 'events' :
                return (<EventsListing/>);
            default:
                return null;
        }
    }

    renderItem(item) {
        return (
            <View style={[commonStyle.flex(1), { width: ScreenDetector.ScreenWidth() }]}>
                {this.props.activeTab === item ? this.getNode(item) : (<ActivityIndicator/>)}
            </View>
        );
    }

    onScroll(e) {
        const { contentOffset } = e.nativeEvent;
        let selectedItem = Math.round(
            contentOffset.x / ScreenDetector.ScreenWidth());
        StateService.setActiveTab(this.SEARCH_TABS[selectedItem]);
    }

    render() {
        return (
            <View style={commonStyle.flex(1)}>
                <FlatList
                    data={this.SEARCH_TABS}
                    renderItem={({ item }) => this.renderItem(item)}
                    horizontal
                    showsVerticalScrollIndicator={false}
                    pagingEnabled
                    keyExtractor={item => item}
                    ref={(list) => {
                        this.listRef = list;
                    }}
                    onMomentumScrollEnd={e => this.onScroll(e)}
                />
                <PlusButton onPress={() => this.setModalVisible(true)}/>
                <HomeMenuModal
                    selectMenu={(item) => this.onSelectMenu(item)}
                    closeModal={() => this.setModalVisible(false)}
                    visible={this.state.modalVisible}
                />
            </View>
        )
    }
}
