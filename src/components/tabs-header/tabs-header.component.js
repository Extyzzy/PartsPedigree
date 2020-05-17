import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Text} from 'native-base';
import { branch } from 'baobab-react/higher-order';
import PropTypes from 'prop-types';
import { tabsHeaderStyle as style } from './tabs-heaeder.style';
import { commonStyle } from "../../styles/common.style";
import { StateService } from "../../services/state.service";
import { BackBtn } from "../back-btn.component";
import { MenuBtn } from "../menu-btn.component";
import { homeScreen } from "../../constants/accessability";
import { ImageUtils } from "../../utils/image-utils";
import BackendApi from "../../services/backend";
import {Home} from "../../screens/home/home.component";

type Props = {
    activeTab: string;
    textSearch: string;
    textShipPart: boolean;
}

@branch({
    activeTab: ['activeTab'],
    textSearch: ['textSearch'],
    textShipPart: ['textShipPart'],
})
export class TabsHeader extends Component<Props> {
    static propTypes = {
        tabs: PropTypes.arrayOf(PropTypes.string),
        activeTab: PropTypes.string,
        setTab: PropTypes.func,
        backBtn: PropTypes.bool,
        whiteTabs: PropTypes.bool,
    };

    static defaultProps = {
        tabs: [],
        activeTab: null,
        setTab() {
        },
        backBtn: false,
        whiteTabs: false,
    };

    state = {
        textSearch: '',
        showErr: false,
    };

    static setTab(tab: string) {
        StateService.setActiveTab(tab);
    }

    static setSearch(text) {
        StateService.setTextSearch(text);
    }

    componentDidMount() {
        const { tabs, activeTab, textSearch } = this.props;

        if (tabs.indexOf(activeTab) === -1) {
            TabsHeader.setTab(this.props.tabs[0]);
        }

        this.setState({ textSearch });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tabs[0] !== this.props.tabs[0]) {
           TabsHeader.setTab(this.props.tabs[0]);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.textShipPart) {
            return null
        }

      if (nextProps.fromImageFill && this.props.textSearch !== nextProps.textSearch) {
        this.setState({ textSearch: nextProps.textSearch }, () => {
            TabsHeader.setSearch(nextProps.textSearch);
            this.find()
        })
      }
    }

    renderTabs() {
        const { whiteTabs } = this.props;
        const activeTabText = whiteTabs ? style.activeTabTextWhiteBg : style.activeTabText;

        return (
          <ScrollView
            style={style.tabsContainerScroll}
            horizontal
            contentContainerStyle={{
              alignItems: 'stretch',
              flex: whiteTabs ? 1 : 0,
            }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={[style.tabsContainer, whiteTabs && style.whiteBg ]}>
                {this.props.tabs.map(tab => (
                    <TouchableOpacity key={tab} activeOpacity={0.5} onPress={() => TabsHeader.setTab(tab)}>
                        <Text
                            style={[
                                style.tabText,
                                whiteTabs && style.tabTextWhiteBg,
                                this.props.activeTab === tab && activeTabText
                            ]}
                            accessibilityLabel={"Tab: " + tab.toUpperCase()}
                        >{tab.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            </ScrollView>
        )
    }

    find() {
        const { routeName } = this.props.navigation.state;
        const ignoreRoutes = ['PartsListing', 'PartInstanceItemsListing', 'PartItemsListing'];

        if (this.state.showErr) {
            this.setState({ showErr: false });
        }

        TabsHeader.setSearch(this.state.textSearch);
        if (ignoreRoutes.indexOf(routeName) === -1) {
            this.props.navigation.navigate('PartsListing');
        }
    }

    clearSearch() {
        this.setState({ textSearch: null }, () => {
            TabsHeader.setSearch(null);
        });
    }

    async filImage() {
        const image = await ImageUtils.showImagePicker();

        BackendApi.uploadRecognizaedImage(image);

        this.props.navigation.navigate('ImageAndFill', {
            type: 'search',
            feelData: ({ value }) => TabsHeader.setSearch(value),
        });
    }

    setSearchTextSearch(textSearch) {
        this.setState({ textSearch });
    }

    renderInteractions() {
        const {searchClear, navigation} =this.props;
        return (
            <View style={[commonStyle.rowBetween, commonStyle.alignCenter]}>
                {this.props.backBtn ?
                    <BackBtn onPress={() => {
                        if (searchClear) {
                          this.setState({ textSearch: null });
                          TabsHeader.setSearch(null);

                          return navigation.navigate('Home')
                        }
                        navigation.goBack()
                    }}/> : <View style={{ width: 40 }}/>
                }
                <View style={style.inputContainer}>
                    <TextInput
                        testID='search'
                        onSubmitEditing={() => this.find()}
                        style={style.textInput}
                        maxLength={32}
                        value={this.state.textSearch}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        onChangeText={(textSearch) => this.setSearchTextSearch(textSearch)}
                        accessibilityLabel={homeScreen.searchField}
                    />
                    <View style={[commonStyle.rowBetween, commonStyle.alignCenter]}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => this.clearSearch()}
                            accessibilityLabel={homeScreen.searchFieldClear}>
                            <Image style={style.clearTextBtn} source={require('../../assets/icons/cross_icon.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            testID='find'
                            activeOpacity={0.5}
                            onPress={() => this.find()}
                            accessibilityLabel={homeScreen.searchFieldSearchButton}>
                            <Image style={style.searchBtn} source={require('../../assets/icons/search_btn_icon.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[commonStyle.rowBetween, commonStyle.flex(0.25), commonStyle.alignCenter]}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.filImage()}
                        accessibilityLabel={homeScreen.searchFieldCamera}>
                        <Image style={style.cameraBtn} source={require('../../assets/icons/camera_icon.png')}/>
                    </TouchableOpacity>
                    <MenuBtn/>
                </View>
            </View>
        );
    }

    render() {
        return (
            <LinearGradient
                start={{x: 0, y: 0.5}} end={{x: 1, y: 0.5}}
                colors={['#40576e', '#b5bec8']}
                style={style.container}
            >
                {this.renderInteractions()}
                {this.state.showErr &&
                <Text
                    style={style.errText}
                    accessibilityLabel={homeScreen.searchFieldVerification}>
                    Search term should contain at least 3 characters
                </Text>
                }
                {this.renderTabs()}
            </LinearGradient>
        );
    }
}
