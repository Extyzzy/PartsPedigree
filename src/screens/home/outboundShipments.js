import React from 'react';
import PropTypes from 'prop-types';
import {View, FlatList, ActivityIndicator, Text, TouchableOpacity, Image, Alert} from 'react-native';
import { ListingBase } from "../parts-listing/lists/listing-base.component";
import BackendApi from "../../services/backend";
import { homeStyle as style } from "./home.style";
import { NoResulstsText } from "../../components/no-results.component";
import { commonStyle } from "../../styles/common.style";
import { branch } from "baobab-react/higher-order";
import { EventModel } from "../../models/eventModel";
import { CreatedDate } from "../../components/created-date.component";
import { CrossBtn } from "../../components/cross-btn.component";
import { Event } from "../../components/event/event.component";
import {InteractionPanel, ShareBtn} from "../../components/interaction-buttons";
import {events, general} from "../../constants/accessability";
import { ServerImage } from "../../components/server-image.component";
import {VerificationKey} from "../../components/verification-key.component";
import {StateService} from "../../services/state.service";
import {ScreenDetector} from "../../utils/screen-detector";
import {EventTypes} from "../../utils/EventTypes";

type Props = {
  outBoundShipments: Array<EventModel>;
}

@branch({
  outBoundShipments: ['outBoundShipments']
})
export class OutboundShipments extends ListingBase<Props> {
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

        this.cursorNext = await BackendApi.getOutBoundsList(cursorNext);

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

    renderKey(item) {
      return <VerificationKey
        eventsCard
        hash={item.hash}
        blockchainAddress={item.blockchainAddress}/>
    }

    onPressItem(item: EventModel) {
      const screen = Event.getScreenNameByEventypeId(item.eventTypeId);
      StateService.resetEventFromHistory();
      StateService.addEventToHistory({
        eventId: item.eventId,
        eventTypeId: item.eventTypeId
      });
      this.context.getNavigation().navigate(screen, {
        eventId: item.eventId,
        eventTypeId: item.eventTypeId,
        fromArrival: true
      });
    }

    requestAccess(eventId) {
     BackendApi.requestEventAccess(eventId)
      .then(() => {
        Alert.alert('Success', 'Request was successfully sent');
      });
    }

  renderRestrictedPanel() {
    return (
      <View style={[commonStyle.alignCenter, {marginRight: 10}]}>
        <Image
          style={[style.restrictedIcon, commonStyle.indent(10)]}
          source={require('../../assets/icons/icon_restricted.png')}
          accessibilityLabel={events.restrictedAccessIcon}/>
        <Text
          style={style.restrictedBtnText}
          accessibilityLabel={events.restrictedAccessText}>
          RESTRICTED
        </Text>
      </View>
    );
  }
    renderLogo(event) {
      if (  event.toOrganization && event.toOrganization.logoPath !== '') {
        return (
          <ServerImage
            style={{width: 70, height: 50, marginRight: 10}}
            uri={event.toOrganization && event.toOrganization.logoPath}
          />
        )
      } else {
        return(
          <View style={{
            width: 70,
            height: 50,
            marginRight: 10,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text>{event.owner.organization}</Text>
          </View>
        )
      }
    }

    renderItem(item: EventModel) {
      const hashFinger = !item.hash || !item.blockchainAddress;
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => item.isRestricted ? null : this.onPressItem(item)}
            style={[style.shipmentsParent, commonStyle.rowBetween]}
          >
            {
              (item.isRestricted && this.renderRestrictedPanel() || ((
                  this.renderLogo(item)
                ))
              )
            }
            <View style={{flexGrow: 1, position: 'relative' }}>
              <View style={[commonStyle.rowBetween, commonStyle.indent(ScreenDetector.isPhone() ? 5 : 15)]}>
                <View style={[commonStyle.rowBetween]}>
                  <View style={{width: 150}}>
                    {
                      item.shipmentId !== '' &&(
                        <Text style={[style.shipmentsTitleText]}>Shipment #: {item.shipmentId}</Text>
                      )
                    }

                    <Text style={style.shipmentsTitleText}>To: {item.toOrganization && item.toOrganization.name}</Text>
                  </View>

                </View>
                <CreatedDate date={item.createdAt}/>
              </View>


              {
                item.eventTypeId === EventTypes.SHIPMENT && (
                  <View style={[commonStyle.flexRow]}>
                    {
                      item.arrivalEvent && (
                        <Text style={[commonStyle.indent(10), {marginRight: 10}]}>ARV</Text>
                      )
                    }

                    {
                      item.receivingEvents.length > 0 && (
                        <Text style={[commonStyle.indent(10)]}>RCV</Text>
                      )
                    }
                  </View>
                )
              }


              { hashFinger && (
                <Text
                  style={{
                    color: '#8F9CAB',
                    fontSize: ScreenDetector.isPhone() ? 11 : 18
                  }}
                  accessibilityLabel={general.signatureNoSign}>
                  Not Yet Verified
                </Text>
              )}

              <View style={[commonStyle.flexRow, commonStyle.justifyEnd, {
                  position: 'absolute',
                  bottom: 0,
                  right: 0
                }]}>
                { hashFinger ?  null : this.renderKey(item)}
                {
                  (item.isRestricted &&(
                    <TouchableOpacity
                      onPress={() => this.requestAccess(item.eventId)}
                      activeOpacity={0.5}
                      style={[commonStyle.flexRow, commonStyle.alignCenter, commonStyle.paddingHorizontal(5)]}
                      accessibilityLabel={events.requestAccessButton}
                    >
                      <Image
                        style={style.requestAccessIcon}
                        source={require('../../assets/icons/icon_request_access.png')}
                        accessibilityLabel={events.requestAccessIcon}/>
                      <Text
                        style={style.requestAccessBtnText}
                        accessibilityLabel={events.requestAccessText}>
                        Request Access
                      </Text>
                    </TouchableOpacity>
                  )) || (
                    <ShareBtn onPress={() => this.share(item.eventId)}/>
                  )
                }
              </View>
            </View>
          </TouchableOpacity>
       )
    }

    share(eventId) {
      this.context.getNavigation().navigate('ShareEvent', { eventId });
    }

    render() {
        if (!this.props.outBoundShipments) {
            return null;
        }

        if (!this.props.outBoundShipments.length) {
            return (<NoResulstsText/>);
        }

        return (
            <View style={{flex: 1, marginTop: 3}}>
                <FlatList
                    ref={ref => this.list = ref}
                    data={this.props.outBoundShipments}
                    renderItem={({ item }) => this.renderItem(item)}
                    keyExtractor={item => item.eventId.toString()}
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
