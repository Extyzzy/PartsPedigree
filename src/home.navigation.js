//@flow
import React from 'react';
import {StackNavigator} from 'react-navigation';
import {navbar} from "./styles/Common";
import {EditProfileBtn} from './components/EditProfileBtn'
import {Home} from './screens/home/home.component';
import {UserProfile} from './screens/user-profile/user-profile.component';
import {UserProfileEdit} from './screens/user-profile-edit/user-profile-edit.component';
import {SearchScreen} from './screens/parts-listing/search-screen.component';
import {CreatePartMaster} from './screens/save-part-master/create-part-master.component';
import {PartMasterScreen} from "./screens/part-master/part-master.screen.component";
import {SavePartInstance} from "./screens/save-part-instance/save-part-instance.component";
import {PartInstanceDetail} from "./screens/part-instance/part-instance.component";
import {ImageAndFill} from "./screens/image-and-fill/image-and-fill.component";
import {TabsHeader} from "./components/tabs-header/tabs-header.component";
import {BackBtn} from "./components/back-btn.component";
import {ShareEvent} from "./screens/share-event/share-event.component";
import {EventDetail} from "./screens/event-detail/event-detail.component";
import {ShipParts} from "./screens/ship-parts/ship-parts.component";
import {ShipPartItemScreen} from "./screens/ship-parts-item/ship-part-item-screen.component";
import {MenuBtn} from "./components/menu-btn.component";
import {PartInstanceItemsListing} from "./screens/parts-listing/part-instance-items-search.component";
import {PartItemsSearch} from "./screens/parts-listing/part-items-search.component";
import {ImageView} from "./screens/image-view/image-view.component";
import {ShipPartsDetail} from "./screens/ship-part-detail/ship-parts-detail.component";
import {ShipPartsItemDetail} from "./screens/ship-parts-item/ship-part-item-detail.component";
import {ReceiveParts} from "./screens/receive-parts/receive-parts.component";
import {ReceivePartsNonApi} from "./screens/ReceivePartsNonApi/receive-parts-non-api.component.js"
import {ReceivePartItemScreen} from "./screens/receive-parts/receive-parts-item.component";
import {Save8130Screen} from "./screens/save-8130-3/save-8130-3.component";
import {Save8130Item} from "./screens/save-8130-3-item/save-8130-3-item.component";
import {Detail81303Screen} from "./screens/detail-8130-3/detail-8130-3.component";
import {AddAttachment} from "./screens/save-attachment/save-attachment.component";
import {AttachmentDetail} from "./screens/attachment-detail/attachment-detail.component";
import {SaveAttachmentEvent} from "./screens/save-attachment-event/save-attachment-event.component";
import {PdfView} from "./screens/pdf-view/pdw-view.component";
import {AttachmentEventDetail} from "./screens/attachment-event/attachment-event.component";
import {ArrivalEventDetail} from "./screens/arrival-detail/arrival-event.component";
import {HelpBtn} from "./components/help-btn.component";
import {StateService} from "./services/state.service";
import {Text} from "react-native";
import {CofC} from "./screens/c-of-c/c-of-c.component";
import {CofCItem} from "./screens/c-of-c/c-of-c-item";

export const HOME_TABS = ['Stats', 'Inbound', 'Outbound', 'following', 'notifications', 'drafts'];
export const SEARCH_TABS = ['all', 'part master', 'part instance', 'events'];
export const PART_ITEMS_TABS = ['part instance', 'part master'];

const getScreenNameByEventypeId = (eventTypeId) => {
    let screen;
    switch (eventTypeId) {
        case 7:
            screen = 'ShipPartsDetail';
            break;
        case 8:
            screen = 'ReceivePartsDetail';
            break;
        case 11:
            screen = 'ArrivalEventDetail';
            break;
        default:
            screen = 'ShipPartsDetail';
    }
    return screen;
};

export const HomeNavigator = StackNavigator({
        Home: {
            screen: Home,
            navigationOptions: (props) => {
                return {
                    header: (<TabsHeader
                        navigation={props.navigation}
                        tabs={HOME_TABS}
                    />)
                }
            },
        },
        ReceivePartsNonApi: {
            screen: ReceivePartsNonApi,
            navigationOptions: (props) => {
                return {
                    title: 'RECEIVE PARTS',
                }
            },
        },

        UserProfile: {
            screen: UserProfile,
            navigationOptions: (prop) => (
                {
                    title: 'My profile',
                    headerRight: (<EditProfileBtn onPress={() => prop.navigation.navigate('UserProfileEdit')}/>),
                }
            ),
        },
        PartsListing: {
            screen: SearchScreen,
            navigationOptions: (props) => {
                return {
                    title: 'PARTS LISTING',
                    header: (<TabsHeader
                        searchClear
                        whiteTabs
                        backBtn
                        navigation={props.navigation}
                        tabs={SEARCH_TABS}
                    />)
                }
            },
        },
        UserProfileEdit: {
            screen: UserProfileEdit,
            navigationOptions: {
                title: 'Edit profile',
                headerRight: null,
            },
        },
        CreatePartMaster: {
            screen: CreatePartMaster,
            navigationOptions: (props) => {
                return {
                    title: 'CREATE PART MASTER',
                    headerLeft: (<BackBtn onPress={() => {
                        props.navigation.state.params.cancel();
                    }}/>),
                    headerRight: (<MenuBtn/>)
                }
            },
        },
        EditPartMaster: {
            screen: CreatePartMaster,
            navigationOptions: {
                title: 'EDIT PART MASTER',
            },
        },
        PartMaster: {
            screen: PartMasterScreen,
            navigationOptions: {
                title: 'PART MASTER',
            },
        },
        CreatePartInstance: {
            screen: SavePartInstance,
            navigationOptions: (props) => {
                return {
                    title: 'CREATE PART INSTANCE',
                    headerLeft: (<BackBtn onPress={() => {
                        props.navigation.state.params.cancel();
                    }}/>),
                    headerRight: (<MenuBtn/>)
                }
            },
        },
        UpdatePartInstance: {
            screen: SavePartInstance,
            navigationOptions: {
                title: 'UPDATE PART INSTANCE',
            },
        },
        PartInstance: {
            screen: PartInstanceDetail,
            navigationOptions: {
                title: 'PART INSTANCE',
            },
        },
        ImageAndFill: {
            screen: ImageAndFill,
            navigationOptions: (props) => {
                return {
                    title: 'IMAGE AND FILL',
                    headerLeft: (<BackBtn onPress={() => {
                        props.navigation.state.params.backButton();
                    }}/>),
                    headerRight: (<HelpBtn onPress={() => StateService.setImageAndFilHelpModal(true)}/>)
                }
            },
        },
        ShareEvent: {
            screen: ShareEvent,
            navigationOptions: {
                title: 'SHARE EVENT',
            },
        },
        EventDetail: {
            screen: EventDetail,
            navigationOptions: {
                title: 'EVENT',
            },
        },
        ShipParts: {
            screen: ShipParts,
            navigationOptions: (props) => {
                return {
                    title: 'SHIP PARTS',
                    headerLeft: (<BackBtn onPress={() => {
                        props.navigation.state.params.cancel();
                    }}/>),
                    headerRight: (<MenuBtn/>)
                }
            },
        },
        ShipPartsItem: {
            screen: ShipPartItemScreen,
            navigationOptions: {
                title: 'SHIP PARTS: ITEM',
            },
        },
        PartInstanceItemsListing: {
            screen: PartInstanceItemsListing,
            navigationOptions: (props) => {
                return {
                    title: 'PARTS LISTING',
                    header: (<TabsHeader
                        backBtn
                        navigation={props.navigation}
                    />)
                }
            },
        },
        PartItemsListing: {
            screen: PartItemsSearch,
            navigationOptions: (props) => {
                return {
                    title: 'PARTS LISTING',
                    header: (<TabsHeader
                        whiteTabs
                        backBtn
                        navigation={props.navigation}
                        tabs={PART_ITEMS_TABS}
                    />)
                }
            },
        },
        ShipPartsDetail: {
            screen: ShipPartsDetail,
            navigationOptions(props) {
                return {
                    title: 'EVENT',
                    headerLeft: (<BackBtn onPress={() => {

                        if (props.navigation.state.params.fromNotification) {
                            return props.navigation.goBack()
                        }

                        const eventHistory = StateService.getEventFromHistory();
                        if (props.navigation.state.params.fromArrival) {
                            props.navigation.goBack()
                        } else if (eventHistory && eventHistory.length > 1) {
                            const previousEvent = eventHistory[eventHistory.length - 2];
                            StateService.deleteLastEventFromHistory();
                            props.navigation.navigate(
                                getScreenNameByEventypeId(previousEvent.eventTypeId), {
                                    eventId: previousEvent.eventId,
                                    eventTypeId: previousEvent.eventTypeId
                                });
                        } else if (props.navigation.state.params.fromNotification) {
                            return props.navigation.goBack()
                        } else {
                            props.navigation.navigate('Home')
                        }
                    }
                    }/>),
                    headerRight: (<MenuBtn/>)
                }
            }
        },
        ReceivePartsDetail: {
            screen: ShipPartsDetail,
            navigationOptions(props) {
                return {
                    title: 'EVENT',
                    headerLeft: (<BackBtn onPress={() => {

                        const eventHistory = StateService.getEventFromHistory();
                        if (props.navigation.state.params.fromArrival) {
                            props.navigation.goBack()
                        } else if (eventHistory && eventHistory.length > 1) {
                            const previousEvent = eventHistory[eventHistory.length - 2];
                            StateService.deleteLastEventFromHistory();
                            props.navigation.navigate(
                                getScreenNameByEventypeId(previousEvent.eventTypeId), {
                                    eventId: previousEvent.eventId,
                                    eventTypeId: previousEvent.eventTypeId
                                });
                        } else if (props.navigation.state.params.fromNotification) {
                            return props.navigation.goBack()
                        } else {
                            props.navigation.navigate('Home')
                        }
                    }
                    }/>),
                    headerRight: (<MenuBtn/>)
                }
            }
        },
        ShipPartsItemDetail: {
            screen: ShipPartsItemDetail,
            navigationOptions: {
                title: 'SHIP PARTS: ITEM',
            },
        },
        ArrivalItemDetail: {
            screen: ShipPartsItemDetail,
            navigationOptions: {
                title: 'ARRIVAL: ITEM',
            },
        },
        ReceivePartsItemDetail: {
            screen: ShipPartsItemDetail,
            navigationOptions: {
                title: 'RECEIVE PARTS: ITEM',
            },
        },
        ImageView: {
            screen: ImageView,
            navigationOptions: {
                header: null,
            }
        },
        ReceiveParts: {
            screen: ReceiveParts,
            navigationOptions: (props) => {
                return {
                    title: 'RECEIVE PARTS',
                    headerLeft: (<BackBtn onPress={() => {
                        props.navigation.state.params.cancel();
                    }}/>),
                    headerRight: (<MenuBtn/>)
                }
            },

        },
        ReceivePartsItem: {
            screen: ReceivePartItemScreen,
            navigationOptions: {
                title: 'RECEIVE PARTS: ITEM',
            },
        },
        Save8130Screen: {
            screen: Save8130Screen,
            navigationOptions: (props) => {
                return {
                    title: 'CREATE e8130-3',
                    headerLeft: (<BackBtn onPress={() => {
                        props.navigation.state.params.cancel();
                    }}/>),
                    headerRight: (<MenuBtn/>)
                }
            },
        },
        Save8130Item: {
            screen: Save8130Item,
            navigationOptions: {
                title: '8130-3: ITEM',
            },
        },
        Detail81303Screen: {
            screen: Detail81303Screen,
            navigationOptions: {
                title: '8130-3 EVENT',
            },
        },
        AddAttachment: {
            screen: AddAttachment,
            navigationOptions: {
                title: 'ADD ATTACHMENT',
            },
        },
        AttachmentDetail: {
            screen: AttachmentDetail,
            navigationOptions: {
                title: 'VIEW ATTACHMENT',
            },
        },
        SaveAttachmentEvent: {
            screen: SaveAttachmentEvent,
            navigationOptions: {
                title: 'ATTACHMENT EVENT',
            }
        },
        PdfView: {
            screen: PdfView,
            navigationOptions: {
                title: '8130-3 PDF',
            },
        },
        AttachmentEventDetail: {
            screen: AttachmentEventDetail,
            navigationOptions: {
                title: 'VIEW ATTACHMENT',
            }
        },
        ArrivalEventDetail: {
            screen: ArrivalEventDetail,
            navigationOptions(props) {
                return {
                    title: 'ARRIVAL',
                    headerLeft: (<BackBtn onPress={() => {
                        const eventHistory = StateService.getEventFromHistory();
                        if (props.navigation.state.params.fromArrival) {
                            props.navigation.goBack()
                        } else if (eventHistory && eventHistory.length > 1) {
                            const previousEvent = eventHistory[eventHistory.length - 2];
                            StateService.deleteLastEventFromHistory();
                            props.navigation.navigate(
                                getScreenNameByEventypeId(previousEvent.eventTypeId), {
                                    eventId: previousEvent.eventId,
                                    eventTypeId: previousEvent.eventTypeId
                                });
                        } else if (props.navigation.state.params.fromNotification) {
                            return props.navigation.goBack()
                        } else {
                            props.navigation.navigate('Home')
                        }

                    }
                    }/>),
                    headerRight: (<MenuBtn/>)
                }
            }
        },
        CofC: {
            screen: CofC,
            navigationOptions: {
                title: 'Certificate of Conformity',
            }
        },
        CofCItem: {
            screen: CofCItem,
            navigationOptions: {
                title: 'Certificate of Conformity Item'
            }
        }
    },
    {
        initialRouteName: 'Home',
        navigationOptions(props) {
            return {
                ...navbar,
                headerLeft: (<BackBtn onPress={() => props.navigation.goBack()}/>),
                headerRight: (<MenuBtn/>)
            }
        }
    });