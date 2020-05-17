import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, Alert, Text, BackHandler} from 'react-native';
import {Content} from 'native-base';
import {FormSplitter} from "../../components/form-splitter.component";
import {formatPartDate} from "../../utils/datetime";
import {User} from "../../models/user";
import {branch} from "baobab-react/higher-order";
import BackendApi from "../../services/backend";
import {ShipPartsItems} from "../ship-parts/ship-parts-items.component";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {ShipPart} from "../../models/ship-part";
import {Organization} from "../../models/organization";
import {ShipPartView} from "../../models/ship-part-view";
import {OrganizationAddress} from "../../models/organization-address";
import {StateService} from "../../services/state.service";
import {ShipPartsItem} from "../ship-parts-item/ship-parts-item.component";
import {ShipPartItemView} from "../../models/ship-part-item-view";
import {ShipPartsAttachments} from "../ship-parts/ship-part-attachments.component";
import {Attachment} from "../../models/attachment";
import {ShipPartsBtns} from "../ship-parts/ship-parts-btns.component";
import {AddAttachment} from "../save-attachment/save-attachment.component";
import {ReceivePartsNonApiForm} from "./receive-parts-non-api-form";
import {ReceivePartView} from "../../models/receive-part-view";
import Moment from "moment/moment";

type Props = {
    event: ['event'],
    receivePart: ReceivePartView;
    user: User;
    shipPart: ShipPartView;
    organizations: Array<Organization>;
    organizationAddress: OrganizationAddress;
    shipPartItems: Array<ShipPartItemView>;
    shiPartAttachments: Array<Attachment>;
}

@branch({
    event: ['event'],
    receivePart: ['receivePart'],
    user: ['user'],
    organizations: ['organizations'],
    shipPart: ['shipPart'],
    organizationAddress: ['organizationAddress'],
    shipPartItems: ['shipPartItems'],
    shiPartAttachments: ['shiPartAttachments'],
})
export class ReceivePartsNonApi extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            eventDraftId: null,
            DisplayTotal: null,
            invoiceCurrency: null,
            totalWeight: 0
        }
    }

    form: ReceivePartsNonApiForm;
    isNew: boolean;

    static childContextTypes = {
        getParentId: PropTypes.func,
    };

    getChildContext() {
        return {
            getParentId: () => ({
                type: 'eventDraftId',
                id: this.props.shipPart.eventDraftId
            }),
        };
    }
    componentDidUpdate(prevProps) {
        let DisplayTotal = 0;
        if (this.props.shipPartItems && prevProps !== this.props) {
            this.props.shipPartItems.map(item => {
                let subtotal = item.quantity * item.unitPrice;
                let total = item.lineTaxValue + subtotal;
                DisplayTotal = parseFloat(DisplayTotal) + parseFloat((total / 100).toFixed(2));
                this.setState({
                    invoiceCurrency: {value:this.props.shipPartItems[0].invoiceCurrency , unitField: 'valueUOMId'},
                    DisplayTotal: DisplayTotal,
                })
            })
        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        StateService.setOrganizationAddress(null);

        if (params && params.eventDraftId) {
            BackendApi.createReceiveDraft().then((eventDraftId) => {this.setState({eventDraftId: eventDraftId})});
            BackendApi.getEventDraft(params.eventDraftId);
            BackendApi.getPartShipItemsList(params.eventDraftId);
            BackendApi.getShipPartAttachments(params.eventDraftId);
        } else {
            BackendApi.createReceiveDraft().then((eventDraftId) => {this.setState({eventDraftId: eventDraftId})});
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.formChanged()) {
                this.cancel()
            } else {
                this.props.navigation.goBack();
                BackendApi.deleteEventDraft(this.props.shipPart.eventDraftId).then(() => {
                    BackendApi.getDrafts().then(() => {
                        BackendApi.refreshPartInstanceTimeLine();

                    })
                })
            }
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    cancel() {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
            [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.goBack();
                    BackendApi.deleteEventDraft(this.props.shipPart.eventDraftId).then(() => {
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

    }

    addItem() {
        const {shipPart} = this.props;
        if (shipPart) {
            this.props.navigation.navigate('ShipPartsItem', {eventDraftId: shipPart.eventDraftId, fromReceiving: true});
        }
    }

    onPressItem(item, showAttaches: boolean = false) {
        const {shipItemId, eventDraftId} = item;
        this.props.navigation.navigate('ShipPartsItem', {shipItemId, eventDraftId, showAttaches});
    }

    checkForItems() {
        if (!this.props.shipPartItems || !this.props.shipPartItems.length) {
            Alert.alert('Error', 'At least one item required');
            return true;
        }

        return false;
    }

    saveDraft() {
        if (this.checkForItems()) {
            return;
        }

        const shipPart: ShipPart = this.form.trimModel();

        if (shipPart && this.props.shipPart) {
            shipPart.fromOrganizationId = this.props.user.organizationId;
            let historicalDate = Moment().format();
            const timestamp = Moment(historicalDate).format('x');
            shipPart['historicalDate'] = timestamp;
            BackendApi.updateReceiveEventDraft(this.props.shipPart.eventDraftId, shipPart)
                .then(() => {
                    Alert.alert('Success', 'Ship Parts Draft was successfully saved');
                });
        }
    }

    deleteDraft() {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete Shipping Event Draft?',
            [{
                text: 'Yes', onPress: () =>
                    BackendApi.deleteEventDraft(this.props.shipPart.eventDraftId).then(() => {
                        BackendApi.refreshPartInstanceTimeLine();
                        BackendApi.getDrafts();
                        this.props.navigation.goBack();
                    })
            }, {
                text: 'No', onPress: () => {
                },
            }]
        );
    }

    formChanged() {
        const {shipPartItems, shiPartAttachments} = this.props;
        return this.form.formChanged() || shipPartItems && shipPartItems.length > 0
            || shiPartAttachments
            && shiPartAttachments.length > 0
    }


    submit = () => {
        if (this.checkForItems()) {
            return;
        }
        const shipPart: ShipPart = this.form.validate();
        if (shipPart && this.props.shipPart) {
            shipPart.toOrganizationId = this.props.user.organizationId;
            shipPart.totalValue = this.state.DisplayTotal * 100;
            shipPart.totalWeight = this.state.totalWeight;
            BackendApi.updateReceiveingEvent(this.state.eventDraftId, shipPart).then(response => {
                BackendApi.submitReceiveDraft(this.state.eventDraftId)
            }).then( () => {
                Alert.alert('Success', 'Receiving event was created!');
                this.props.navigation.goBack();
            });
        }
    }

    getPoNumbers() {
        if (!this.props.shipPartItems || !this.props.shipPartItems.length) {
            return null;
        }

        return this.props.shipPartItems.map(item => item.poNumber);
    }

    attachFile() {
        const {eventDraftId} = this.props.shipPart;

        this.props.navigation.navigate('AddAttachment', {
            id: eventDraftId,
            type: 'event',
            callback: () => BackendApi.getShipPartAttachments(eventDraftId),
        });
    }

    deleteAttachment(id) {
        BackendApi.removeShipPartAttachment(id);
    }

    updateAttachment() {
        BackendApi.getShipPartAttachments(this.props.shipPart.eventDraftId);
    }

    setTotalWeight = (totalWeight) => {
        this.setState({
            totalWeight: totalWeight
        });
    };
    render() {
        if (!this.props.shipPart) {
            return (<ActivityIndicator/>);
        }

        return (
            <View style={style.container}>
                <Content>
                    <FormSplitter text={`EVENT ID: ${this.props.shipPart.eventDraftId}`}
                                  additionalText={formatPartDate()}/>
                    <ReceivePartsNonApiForm
                        organizationAddress={this.props.organizationAddress}
                        shipPart={this.isNew ? null : this.props.shipPart}
                        ref={form => this.form = form}
                        organizations={this.props.organizations}
                        user={this.props.user}
                        poNumbers={this.getPoNumbers()}
                        priceVal = {this.state.DisplayTotal}
                        invoiceCurrency={this.state.invoiceCurrency}
                        setTotalWeight={this.setTotalWeight}
                    />
                    <ShipPartsItems
                        onPressItem={(item, showAttaches) => this.onPressItem(item, showAttaches)}
                        items={this.props.shipPartItems}/>
                    <ShipPartsAttachments
                        updateAttachment={() => this.updateAttachment()}
                        deleteAttachment={id => this.deleteAttachment(id)}
                        attachments={this.props.shiPartAttachments}
                    />
                </Content>
                <ShipPartsBtns
                    receive = {'receive'}
                    save={() => this.saveDraft()}
                    delete={() => this.deleteDraft()}
                    attach={() => this.attachFile()}
                    addItem={() => this.addItem()}
                    submit={() => this.submit()}
                    cancel={() => {
                        if (this.formChanged()) {
                            this.cancel()
                        } else {
                            this.props.navigation.goBack();
                            BackendApi.deleteEventDraft(this.props.shipPart.eventDraftId).then(() => {
                                BackendApi.getDrafts().then(() => {
                                    BackendApi.refreshPartInstanceTimeLine();
                                })
                            })
                        }
                    }}
                />
            </View>
        );
    }
}
