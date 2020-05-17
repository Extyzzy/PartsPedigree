import React, {Component} from 'react';
import {FlatList, Linking, Platform, View} from 'react-native';
import {HomeMenuModal} from "./home-menu.component";
import {commonStyle} from "../../styles/common.style";
import {ScreenDetector} from "../../utils/screen-detector";
import {StateService} from "../../services/state.service";
import {HOME_TABS} from "../../home.navigation";
import {PlusButton} from "../../components/pluss-button.component";
import {homeScreen} from "../../constants/accessability";
import {NotificationsList} from "./notifications.component";
import {IncomingShipments} from "./incomingShipments";
import {OutboundShipments} from "./outboundShipments";
import {FollowingList} from "./followingList";
import {Drafts} from "./drafts";
import {branch} from "baobab-react/higher-order";
import NativeSplashScreen from "react-native-splash-screen";
import {AuthService} from "../../services/auth.service";
import {Event} from "../../components/event/event.component";
import {Stats} from "./stats";

@branch({
  activeTab: ['activeTab'],
  urlFromBrowser: ['urlFromBrowser'],
})
export class Home extends Component {
  state = {
    modalVisible: false,
    urlFromBrowser: null,
  };

  componentDidMount() {
    const {urlFromBrowser} = this.props;
    StateService.setTextSearch('');

    if (Platform.OS === 'android') {
      if (urlFromBrowser) {
        this.navigate(urlFromBrowser);
      }
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }

    setTimeout(() => NativeSplashScreen.hide(), 500);
    /*        AuthService.getToken().then(t => {
                console.log('TOKEN', t)
            })*/
    AuthService.isAuthorized()
    .then(isAuthorized => {
      if (isAuthorized) {
        this.goToHome();
      }
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => {
    this.navigate(event.url);
  };

  navigate = (url) => {
    const split = url.split('/');

    const urlId = split[split.length - 2];
    const type = split[split.length - 3];
    const typeNROfEvent = split[split.length - 1];

    if (type === 'event') {
      StateService.setUrlFromBrowser('');
      const screen = Event.getScreenNameByEventypeId(typeNROfEvent);
      this.props.navigation.navigate(screen, {eventId: urlId});
    }
  };

  componentDidUpdate(oldProps) {
    if (oldProps.activeTab !== this.props.activeTab) {
      try {
        const index = HOME_TABS.indexOf(this.props.activeTab);
        if (index > -1) {
          this.listRef.scrollToIndex({index});
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onSelectMenu(route: string) {
    if (route) {
      this.setModalVisible(false);
      this.props.navigation.navigate(route);
    }
  }

  getNode(item) {
    switch (item) {
        case 'Stats':
          return(<Stats/>);
      case 'following':
        return (<FollowingList/>);
      case 'notifications':
        return (<NotificationsList/>);
      case 'drafts':
        return (<Drafts/>);
      case 'Inbound':
        return (<IncomingShipments/>);
      case 'Outbound':
        return (<OutboundShipments/>);
      default:
        return null;
    }
  }

  renderItem(item) {
    return (
        <View style={[commonStyle.flex(1),
          {width: ScreenDetector.ScreenWidth()}]}>
          {this.props.activeTab === item ? this.getNode(item) : null}
        </View>
    );
  }

  onScroll(e) {
    const {contentOffset} = e.nativeEvent;
    let selectedItem = Math.round(
        contentOffset.x / ScreenDetector.ScreenWidth());
    StateService.setActiveTab(HOME_TABS[selectedItem]);
  }

  render() {
    return (
        <View style={commonStyle.flex(1)}>
          <FlatList
              accessibilityLabel={homeScreen.scrollName}
              data={HOME_TABS}
              renderItem={({item}) => this.renderItem(item)}
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
    );
  }
}
