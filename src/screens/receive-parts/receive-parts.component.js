import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, Alert, BackHandler} from 'react-native';
import {Content} from 'native-base';
import {partEventsStyle as style} from "../../styles/part-event.style";
import {FormSplitter} from "../../components/form-splitter.component";
import BackendApi from "../../services/backend";
import {branch} from "baobab-react/higher-order";
import {ShipPartInfoBlock} from "../ship-part-detail/ship-part-info-block.component";
import {ShipPartsItems} from "../ship-parts/ship-parts-items.component";
import {ShipPartsAttachments} from "../ship-parts/ship-part-attachments.component";
import {ShipPartsBtns} from "../ship-parts/ship-parts-btns.component";
import {ReceivePartView} from "../../models/receive-part-view";
import {Attachment} from "../../models/attachment";
import {ReceivePartItem} from "../../models/receive-part-item";
import {formatPartDate} from "../../utils/datetime";
import {StateService} from "../../services/state.service";
import Moment from "moment/moment";

type Props = {
    receivePart: ReceivePartView;
    receivePartAttachments: Array<Attachment>;
    shipPartItems: Array<ReceivePartItem>;
}

@branch({
    receivePart: ['receivePart'],
    receivePartAttachments: ['shiPartAttachments'],
    shipPartItems: ['shipPartItems'],
})
export class ReceiveParts extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            initialChecked: this.props.navigation.state.params.partInstanceIds ? [...this.props.navigation.state.params.partInstanceIds] : [],
            checked: [],
            draft: false,
            allChecked: false
        };
        this.updateChecked = this.updateChecked.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    static childContextTypes = {
        getParentId: PropTypes.func,
    };


    getChildContext() {
        return {
            getParentId: () => ({type: 'eventDraftId', id: this.props.receivePart.eventDraftId}),
        };
    }

    componentDidMount() {
        StateService.setShipPartItems(null);
        StateService.setShipPartAttachments(null);
        const {params} = this.props.navigation.state;

        if (params && params.eventId) {
            BackendApi.createReceiveEventDraft(+params.eventId);
        } else if (params && params.eventDraftId) {
            BackendApi.getReceiveEventDraft(+params.eventDraftId);
            BackendApi.getReceivePartItemsList(+params.eventDraftId);
            BackendApi.getReceivePartAttachments(+params.eventDraftId);
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.state.draft) {
                this.props.navigation.navigate('PartsListing');
                BackendApi.deleteReceiveDraft(this.props.receivePart.eventDraftId).then(() => {
                    BackendApi.getDrafts().then(() => {
                        BackendApi.refreshPartInstanceTimeLine();
                    })
                })
            } else {
                Alert.alert(
                    'Confirmation',
                    'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                    [{
                        text: 'Yes', onPress: () => {
                            BackendApi.getEventById(this.props.navigation.state.params.eventId).then(() => {
                                this.props.navigation.navigate('PartsListing');
                                BackendApi.deleteReceiveDraft(this.props.receivePart.eventDraftId).then(() => {
                                    BackendApi.getDrafts().then(() => {
                                        BackendApi.refreshPartInstanceTimeLine();
                                    })
                                })
                            });

                        }
                    }, {
                        text: 'No', onPress: () => {
                        },
                    }]
                );
            }
            return true;
        });
        this.props.navigation.setParams({
            cancel: this.cancel
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    onPressItem(item, showAttaches: boolean = false) {
        if (!item) {
            return;
        }

        const {shipItemId, eventDraftId} = item;
        this.props.navigation.navigate('ReceivePartsItem', {shipItemId, eventDraftId, showAttaches});
    }

    attachFile() {
        const {eventDraftId} = this.props.receivePart;

        this.props.navigation.navigate('AddAttachment', {
            id: eventDraftId,
            type: 'event',
            callback: () => BackendApi.getReceivePartAttachments(eventDraftId),
        });
    }

    deleteAttachment(id) {
        BackendApi.removeShipPartAttachment(id);
    }

    updateAttachment() {
        BackendApi.getReceivePartAttachments(this.props.receivePart.eventDraftId);
    }

    addItem() {
        const {eventDraftId} = this.props.receivePart;

        if (eventDraftId) {
            this.props.navigation.navigate('ReceivePartsItem', {eventDraftId});
        }
    }

    checkForItems() {
        if (!this.props.shipPartItems || !this.props.shipPartItems.length) {
            Alert.alert('Error', 'At least one item required');
            return true;
        }

        return false;
    }

    cancel() {
        if (this.state.draft === true) {
            this.props.navigation.navigate('PartsListing');
            BackendApi.getDrafts().then(() => {
                BackendApi.refreshPartInstanceTimeLine();
            })
        } else {
            if (JSON.stringify((this.state.checkedGot) !== JSON.stringify((this.state.initialChecked)))) {
                Alert.alert(
                    'Confirmation',
                    'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                    [{
                        text: 'Yes', onPress: () => {
                            this.props.navigation.navigate('PartsListing');
                            BackendApi.deleteReceiveDraft(this.props.receivePart.eventDraftId).then(() => {
                                BackendApi.getDrafts().then(() => {
                                    BackendApi.refreshPartInstanceTimeLine();
                                })
                            })
                        }
                    }, {
                        text: 'No', onPress: () => {
                        },
                    }]
                )
            } else {
                this.props.navigation.navigate('PartsListing');
                BackendApi.deleteReceiveDraft(this.props.receivePart.eventDraftId).then(() => {
                    BackendApi.getDrafts().then(() => {
                        BackendApi.refreshPartInstanceTimeLine();
                    })
                })
            }
        }
    }

    deleteDraft() {
        const {receivePart, navigation} = this.props;
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete Receiving Event Draft?',
            [{
                text: 'Yes', onPress: () => {
                    navigation.goBack();
                    BackendApi.deleteReceiveDraft(receivePart.eventDraftId).then(() => {
                        BackendApi.refreshPartInstanceTimeLine();
                        BackendApi.getDrafts();
                    })
                }
            }, {
                text: 'No', onPress: () => {
                },
            }]
        );
    }

    save() {
        if (this.checkForItems()) {
            return;
        }
        this.setState({
            draft: true
        });
        let historicalDate = Moment().format();
        const timestamp = Moment(historicalDate).format('x');
        BackendApi.updateReceiveEventDraft( this.props.receivePart ? this.props.receivePart.eventDraftId : this.props.navigation.state.params.eventDraftId, {historicalDate: timestamp});
        Alert.alert('Success', 'Receive Parts Draft was successfully saved');
    }

    submit() {
        if (this.checkForItems()) {
            return;
        }

        const {receivePart} = this.props;
        if (this.state.checked.length > 0) {
            BackendApi.submitReceivedItems(this.state.checked, this.props.receivePart.shippingEventId).then(() => {
                // BackendApi.submitReceiveDraft(receivePart.eventDraftId).then(() => {
                Alert.alert('Success', 'Receiving Event successfully submitted',
                    [{
                        text: 'OK', onPress: () => {
                            BackendApi.getDrafts();
                            this.props.navigation.navigate('Home');
                            BackendApi.refreshPartInstanceTimeLine();
                        }
                    }]);
            });
        } else {
            Alert.alert('Failed', 'No items selected');
        }

    }

    updateChecked(shipItemId) {
        // this.state.checked.push(shipItemId);
        this.setState({
            checked: [...this.state.checked, shipItemId]
        })
    }

    deleteChecked = (shipItemId) => {
        const checked = [...this.state.checked];

        for (let i = 0; i < checked.length; i++) {
            if (checked[i] === shipItemId) {
                checked.splice(i, 1);
            }
        }

        this.setState({
            checked: checked,
        })
    };
    updateAllChecked = () => {
        let items = this.props.shipPartItems ? this.props.shipPartItems : [];
        if (this.state.allChecked) {
            this.setState({checked: []})
        } else {
            items = items.filter((item) => {
                return this.state.initialChecked.map((e) => e.toString()).indexOf(item.partInstance.partInstanceId.toString()) === -1
            });
            items.map(item => {
               this.state.checked.push(item.partInstance.partInstanceId);
            });
        }
        this.setState({allChecked: !this.state.allChecked});

    };

    render() {
        if (!this.props.receivePart) {
            return (<ActivityIndicator/>);
        }
        let items = this.props.shipPartItems ? this.props.shipPartItems : [];

        items = items.filter((item) => {
            return this.state.initialChecked.map((e) => e.toString()).indexOf(item.partInstance.partInstanceId.toString()) === -1
        });
        const receiveInfo = {
            ...this.props.receivePart,
            items: this.props.shipPartItems ? [...this.props.shipPartItems] : []
        };
        return (
            <View style={style.container}>
                <Content>
                    <FormSplitter
                        text={`EVENT ID: ${this.props.receivePart.eventDraftId}`}
                        additionalText={formatPartDate(this.props.receivePart.ready)}
                    />
                    <View style={style.padding}>
                        <ShipPartInfoBlock partEvent={receiveInfo}/>
                    </View>
                    <ShipPartsItems
                        updateAllChecked={this.updateAllChecked}
                        deleteChecked={this.deleteChecked}
                        updateChecked={this.updateChecked}
                        checked={this.state.checked}
                        receive="receive"
                        formTitle="ITEMS TO BE RECEIVED"
                        onPressItem={(item, showAttaches) => this.onPressItem(item, showAttaches)}
                        items={items}
                        allChecked={ this.state.allChecked}
                    />
                    <ShipPartsAttachments
                        updateAttachment={() => this.updateAttachment()}
                        deleteAttachment={id => this.deleteAttachment(id)}
                        attachments={this.props.receivePartAttachments}
                    />
                </Content>
                <ShipPartsBtns
                    save={() => this.save()}
                    delete={() => this.deleteDraft()}
                    attach={() => this.attachFile()}
                    addItem={() => this.addItem()}
                    submit={() => this.submit()}
                    cancel={() => this.cancel()}
                />
            </View>
        );
    }
}
