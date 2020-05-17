import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SectionList, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SearchPartsItem } from "../../../models/search-parts-item";
import { PartInstance } from "../../../models/part-instance";
import { branch } from "baobab-react/higher-order";
import { partListingStyle as style } from "../part-listing.style";
import BackendApi from "../../../services/backend/index";
import { PartMasterListItem } from "../items/part-master-list-item";
import { PartInstanceListItem } from "../items/part-instance.list-item";
import { commonStyle } from "../../../styles/common.style";
import { EventModel } from "../../../models/eventModel";
import { Event } from "../../../components/event/event.component";
import { NoResulstsText } from "../../../components/no-results.component";
import { StateService } from "../../../services/state.service";
import { SEARCH_TABS } from "../../../home.navigation";

type Props = {
    partMasterList: Array<SearchPartsItem>;
    partInstanceList: Array<PartInstance>;
    eventsList: Array<EventModel>;
    textSearch: string;
}

@branch({
    partMasterList: ['partsMasterList'],
    partInstanceList: ['partInstanceList'],
    eventsList: ['eventsList'],
    textSearch: ['textSearch'],
})
export class CommonListing extends PureComponent<Props> {
    limit = 10;
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    state = {
        loaded: false,
        refreshing: false,
        eventsLoading: false,
        eventsListPage: 1,
        eventsHasNext: true,
        masterListPage: 1,
        masterLoading: false,
        masterHasNext: true,
        instanceListPage: 1,
        instanceHasNext: true,
        instanceLoading: false,
    };

    async componentDidMount() {
        await this.getPartMasterList();
        await this.getPartInstanceList();
        await this.getEventsList();

        this.setState({ loaded: true });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.textSearch !== this.props.textSearch) {
            this.setState({
                loaded: false,
                masterListPage: 1,
                instanceListPage: 1,
            }, () => {
                this.componentDidMount();
            });
        }
    }

    refreshData() {
        this.setState({
            refreshing: true,
            masterListPage: 1,
            instanceListPage: 1,
        }, async () => {
            await this.getPartMasterList();
            await this.getPartInstanceList();
            await this.getEventsList();
            this.setState({ refreshing: false });
        })
    }

    async getPartMasterList() {
        if (this.state.masterLoading) {
            return;
        }

        const { masterListPage } = this.state;
        this.setState({ masterLoading: true });

        const masterHasNext = await BackendApi.getPartMasterList(masterListPage, this.props.textSearch, this.limit);

        this.setState({
            masterLoading: false,
            masterHasNext
        });
    }

    async getPartInstanceList() {
        if (this.state.instanceLoading) {
            return;
        }

        const { instanceListPage } = this.state;
        this.setState({ instanceLoading: true });

        const instanceHasNext = await BackendApi.getPartInstanceList(instanceListPage, this.props.textSearch, this.limit);

        this.setState({
            instanceLoading: false,
            instanceHasNext
        });
    }

    async getEventsList() {
        if (this.state.eventsLoading) {
            return;
        }

        const { eventsListPage } = this.state;
        this.setState({ eventsLoading: true });

        const eventsHasNext = await BackendApi.getEventsLists(eventsListPage, this.props.textSearch, this.limit);

        this.setState({
            eventsLoading: false,
            eventsHasNext
        });
    }

    onPressShowMore(type) {
        const field = `${type}ListPage`;
        this.setState({
            [field]: this.state[field] + 1
        }, () => {
            switch (type) {
                case 'master':
                    StateService.setActiveTab(SEARCH_TABS[1]);
                    //this.getPartMasterList();
                    break;
                case 'instance':
                    StateService.setActiveTab(SEARCH_TABS[2]);
                    //this.getPartInstanceList();
                    break;
                case 'events':
                    StateService.setActiveTab(SEARCH_TABS[3]);
                    //this.getEventsList();
                    break;
            }
        })
    }

    onPressMasterItem(item: SearchPartsItem) {
        this.context.getNavigation().navigate('PartMaster', { partMasterId: item.partMasterId });
    }

    onPressInstanceItem(item: PartInstance) {
        this.context.getNavigation().navigate('PartInstance', { partInstanceId: item.partInstanceId});
    }

    renderMasterItem(item: SearchPartsItem) {
        return (
            <PartMasterListItem
                key={item.partMasterId}
                onPress={() => this.onPressMasterItem(item)}
                item={item}
            />
        );
    }

    renderInstanceItem(item: PartInstance) {
        return (
            <PartInstanceListItem
                key={item.partInstanceId}
                item={item}
                onPress={() => this.onPressInstanceItem(item)}
            />
        );
    }

    renderEventItem(item: EventModel) {
        return (
            <Event key={item.eventId} event={item} />
        );
    }

    renderSectionHeader(title) {
        return (
            <View style={style.sectionTitleContainer}>
                <Text style={style.sectionTitleText} accessibilityLabel={title + " Search Result"}>
                    {title} Search Result
                </Text>
            </View>
        );
    }

    renderMoreBtn(title, type) {
        if (this.state[`${type}Loading`]) {
            return (<ActivityIndicator />);
        }

        if (this.state[`${type}HasNext`]) {
            return (
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={commonStyle.paddingVertical(10)}
                    onPress={() => this.onPressShowMore(type)}
                >
                    <Text style={style.viewMoreBtnText}>View more {title} search result >></Text>
                </TouchableOpacity>
            );
        }

        return null;
    }

    render() {
        if (!this.state.loaded) {
            return (<ActivityIndicator/>);
        }

        if (!this.props.partMasterList.length && !this.props.partInstanceList.length && !this.props.eventsList.length) {
            return (<NoResulstsText/>);
        }

        return (
            <View style={[style.container]}>
                <SectionList
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refreshData()}
                    renderSectionHeader={({ section: { title, data } }) => data && data.length ? this.renderSectionHeader(title) : null}
                    renderSectionFooter={({ section: { title, type } }) => this.renderMoreBtn(title, type)}
                    ItemSeparatorComponent={() => (<View style={{ height: 4 }}/>)}
                    ListFooterComponent={() => (<View style={{height: 100}}/>)}
                    accessibilityLabel={"Search scroll"}
                    sections={[
                        {
                            type: 'master',
                            title: 'Part Master',
                            data: this.props.partMasterList,
                            renderItem: ({ item }) => item && this.renderMasterItem(item),
                        },
                        {
                            type: 'instance',
                            title: 'Part Instance',
                            data: this.props.partInstanceList,
                            renderItem: ({ item }) => item && this.renderInstanceItem(item),
                        },
                        {
                            type: 'events',
                            title: 'Events',
                            data: this.props.eventsList,
                            renderItem: (data) => this.renderEventItem(data.item),
                        }
                    ]}
                />
            </View>
        );
    }
}
