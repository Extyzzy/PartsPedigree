import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { ListingBase } from "../parts-listing/lists/listing-base.component";
import BackendApi from "../../services/backend";
import { homeStyle as style } from "./home.style";
import { NoResulstsText } from "../../components/no-results.component";
import {COLORS, commonStyle} from "../../styles/common.style";
import { branch } from "baobab-react/higher-order";
import { Notification } from "../../models/notification";
import { Draft } from "../../models/draft";
import { CreatedDate } from "../../components/created-date.component";
import { CrossBtn } from "../../components/cross-btn.component";
import { Event } from "../../components/event/event.component";
import {ScreenDetector} from "../../utils/screen-detector";
import {events} from "../../constants/accessability";
import {ServerImage} from "../../components/server-image.component";

type Props = {
  drafts: Draft;
}

@branch({
  drafts: ['drafts']
})
export class Drafts extends ListingBase<Props> {
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

        this.cursorNext = await BackendApi.getDrafts(cursorNext);

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

    onPressDraft(item) {
      const { eventDraftId, eventTypeId } = item;

      let screen;
      switch (eventTypeId)  {
        case 7:
          screen = 'ShipParts';
          break;
        case 8:
          screen = 'ReceiveParts';
          break;
        case 10:
          screen = 'SaveAttachmentEvent';
          break;
        default:
          screen = 'ShipParts';
      }

      this.context.getNavigation().navigate(screen, { eventDraftId });
    }

    renderItem(item: Draft) {
        //Shipping --> 7
        //Receiving --> 8
        //Attachment --> 10

        if (item.eventTypeId === 10) {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.onPressDraft(item)}
              style={[style.container, style.grayBg, {padding: 10}]}
            >
              {
                item.createdAt !== "-1" &&(
                  <View style={{position: 'absolute', right: 3, top: 20}}>
                    <CreatedDate date={item.createdAt} fontSize={12}/>
                  </View>
                )
              }
              <View style={{marginTop: 10, marginBottom: 20}}>
                <View style={[commonStyle.rowBetween]}>
                  <Text
                    style={[commonStyle.textBold, {marginRight: 5}]}
                    accessibilityLabel={events.event81303Name}>
                    ATTACHMENT(S)
                  </Text>
                  <Text
                    style={[commonStyle.textBold, commonStyle.color(COLORS.red)]}
                    accessibilityLabel={events.draftLabel}>
                    ---DRAFT---
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }
        if (item.eventTypeId === 8)  {
          return(
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.onPressDraft(item)}
              style={[style.container, style.grayBg]}
            >
              {
                item.createdAt !== "-1" &&(
                  <View style={{position: 'absolute', right: 3, top: 10}}>
                    <CreatedDate date={item.createdAt} fontSize={12}/>
                  </View>
                )
              }
              <ServerImage
                style={{ width: 90, height: 70, marginRight: 5 }}
                uri={item.toOrganization && item.toOrganization.logoPath}
              />
              <View style={{marginTop: 10}}>
                <View style={[commonStyle.rowBetween]}>
                  <Text
                    style={[commonStyle.textBold, {marginRight: 5}]}
                    accessibilityLabel={events.event81303Name}>
                    RECEIVING
                  </Text>
                  <Text
                    style={[commonStyle.textBold, commonStyle.color(COLORS.red)]}
                    accessibilityLabel={events.draftLabel}>
                    ---DRAFT---
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[commonStyle.textBold, {marginRight: 5}]}
                    accessibilityLabel={events.event81303Name}>
                    SHIPMENT #:
                  </Text>
                  <Text
                    accessibilityLabel={events.event81303Name}>
                    {item.shipment}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[commonStyle.textBold, {marginRight: 5}]}
                    accessibilityLabel={events.event81303Name}>
                    FROM:
                  </Text>
                  <Text
                    accessibilityLabel={events.event81303Name}>
                    {item.fromOrganization.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        }

        if ( item.eventTypeId === 7) {
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onPressDraft(item)}
                style={[style.container, style.grayBg]}
              >
                {
                  item.createdAt !== "-1" &&(
                    <View style={{position: 'absolute', right: 3, top: 10}}>
                      <CreatedDate date={item.createdAt} fontSize={12}/>
                    </View>
                  )
                }
                <ServerImage
                  style={{ width: 90, height: 70, marginRight: 5 }}
                  uri={item.toOrganization && item.toOrganization.logoPath}
                />
                <View style={{marginTop: 10}}>
                <View style={[commonStyle.rowBetween]}>
                  <Text
                    style={[commonStyle.textBold, {marginRight: 5}]}
                    accessibilityLabel={events.event81303Name}>
                    SHIPPING
                  </Text>
                  <Text
                    style={[commonStyle.textBold, commonStyle.color(COLORS.red)]}
                    accessibilityLabel={events.draftLabel}>
                    ---DRAFT---
                  </Text>
                </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[commonStyle.textBold, {marginRight: 5}]}
                      accessibilityLabel={events.event81303Name}>
                      SHIPMENT #:
                    </Text>
                    <Text
                      accessibilityLabel={events.event81303Name}>
                      {item.shipment}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[commonStyle.textBold, {marginRight: 5}]}
                      accessibilityLabel={events.event81303Name}>
                      TO:
                    </Text>
                    <Text
                      accessibilityLabel={events.event81303Name}>
                       {item.toOrganization.name}
                    </Text>
                  </View>
                  </View>
              </TouchableOpacity>
            )
        }

    }

    render() {
        const {drafts} = this.props;

        if ( ! drafts) {
            return null;
        }

        if ( ! drafts.length) {
            return (<NoResulstsText title='No drafts'/>);
        }

        return (
            <View style={commonStyle.flex(1)}>
                <FlatList
                    ref={ref => this.list = ref}
                    data={this.props.drafts}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => item.eventDraftId.toString()}
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
