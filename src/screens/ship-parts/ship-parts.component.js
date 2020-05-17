import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, Alert, BackHandler} from 'react-native';
import {Content} from 'native-base';
import {FormSplitter} from "../../components/form-splitter.component";
import {formatPartDate} from "../../utils/datetime";
import {User} from "../../models/user";
import {branch} from "baobab-react/higher-order";
import BackendApi from "../../services/backend";
import {ShipPartsForm} from "./ship-parts-form.component";
import {ShipPartsItems} from "./ship-parts-items.component";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {ShipPart} from "../../models/ship-part";
import {Organization} from "../../models/organization";
import {ShipPartView} from "../../models/ship-part-view";
import {OrganizationAddress} from "../../models/organization-address";
import {StateService} from "../../services/state.service";
import {ShipPartsItem} from "../ship-parts-item/ship-parts-item.component";
import {ShipPartItemView} from "../../models/ship-part-item-view";
import {ShipPartsAttachments} from "./ship-part-attachments.component";
import {Attachment} from "../../models/attachment";
import {ShipPartsBtns} from "./ship-parts-btns.component";
import {AddAttachment} from "../save-attachment/save-attachment.component";
import Cancel from "../cancel-pop-up/cancel";
import Moment from "moment/moment";

type Props = {
    user: User;
    shipPart: ShipPartView;
    organizations: Array<Organization>;
    organizationAddress: OrganizationAddress;
    shipPartItems: Array<ShipPartItemView>;
    shiPartAttachments: Array<Attachment>;
}

@branch({
    user: ['user'],
    organizations: ['organizations'],
    shipPart: ['shipPart'],
    organizationAddress: ['organizationAddress'],
    shipPartItems: ['shipPartItems'],
    shiPartAttachments: ['shiPartAttachments'],
})
export class ShipParts extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            draft: false,
            DisplayTotal: 0,
            invoiceCurrency: null
        };
        this.formChanged = this.formChanged.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    form: ShipPartsForm;
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
            console.log(this.props.shipPartItems, 'items');
            this.props.shipPartItems.map(item => {
                let subtotal = item.quantity * item.unitPrice;
                let total = item.lineTaxValue + subtotal;
                DisplayTotal = parseFloat(DisplayTotal) + parseFloat((total / 100).toFixed(2));
                this.setState({
                    invoiceCurrency: {value:this.props.shipPartItems[0].invoiceCurrency , unitField: 'valueUOMId'},
                    DisplayTotal: DisplayTotal
                })
            })
        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        StateService.setOrganizationAddress(null);

        if (params && params.eventDraftId) {
            BackendApi.getEventDraft(params.eventDraftId);
            BackendApi.getPartShipItemsList(params.eventDraftId);
            BackendApi.getShipPartAttachments(params.eventDraftId);
        } else {
            BackendApi.createEventDraft();
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.cancel()
            return true;
        });

        this.props.navigation.setParams({
            cancel: this.cancel
        });

    }

    componentWillUnmount() {
        this.backHandler.remove();
    }
    navigateToCofC() {
        Alert.alert(
            'Confirmation',
            'Confirm all parts have been added to shipment',
            [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.navigate('CofC', { orgId: this.state.orgId, orgName: this.state.orgName, items: this.props.shipPartItems})
                }
            },
                {
                    text: 'No', onPress: () => {}
                }

            ]
        )
    }

    cancel() {
        if (this.state.draft) {
            this.props.navigation.goBack();
                BackendApi.getDrafts().then(() => {
                    BackendApi.refreshPartInstanceTimeLine();
                })
        } else {
            if(this.formChanged()){
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
            } else {
                this.props.navigation.goBack();
                BackendApi.deleteEventDraft(this.props.shipPart.eventDraftId).then(() => {
                    BackendApi.getDrafts().then(() => {
                        BackendApi.refreshPartInstanceTimeLine();
                    })
                })
            }
        }
    }

    addItem() {
        const {shipPart} = this.props;
        if (shipPart) {
            this.props.navigation.navigate('ShipPartsItem',
                {eventDraftId: shipPart.eventDraftId});
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
        this.setState({
            draft: true
        })
        const shipPart: ShipPart = this.form.trimModel();
        let historicalDate = Moment().format();
        const timestamp = Moment(historicalDate).format('x');
        shipPart['historicalDate'] = timestamp;
        if (shipPart && this.props.shipPart) {
            shipPart.fromOrganizationId = this.props.user.organizationId;
            BackendApi.updateEventDraft(this.props.shipPart.eventDraftId, shipPart)
                .then(() => {
                    Alert.alert('Success', 'Ship Parts Draft was successfully saved');
                });
        }
    }

    deleteDraft() {
        const {shipPart, navigation} = this.props;
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete Shipping Event Draft?',
            [{
                text: 'Yes', onPress: () =>
                    BackendApi.deleteEventDraft(shipPart.eventDraftId).then(() => {
                        BackendApi.getDrafts().then(() => {
                            BackendApi.refreshPartInstanceTimeLine();
                            navigation.goBack();
                        })
                    })
            }, {
                text: 'No', onPress: () => {
                },
            }]
        );
    }

    submit() {
        if (this.checkForItems()) {
            return;
        }

        const shipPart: ShipPart = this.form.validate();

        if (shipPart && this.props.shipPart) {
            shipPart.fromOrganizationId = this.props.user.organizationId;
            shipPart.submit = true;

            BackendApi.updateEventDraft(this.props.shipPart.eventDraftId, shipPart)
                .then(() => {
                    Alert.alert('Success', 'Ship Parts Draft was successfully submitted',
                        [{
                            text: 'OK', onPress: () => {
                                BackendApi.refreshPartInstanceTimeLine();
                                this.props.navigation.goBack();
                            }
                        }]);
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

    formChanged() {
        const {shipPartItems, shiPartAttachments} = this.props;
        return this.form.formChanged() || shipPartItems && shipPartItems.length > 0
            || shiPartAttachments
            && shiPartAttachments.length > 0 || this.state.draft && this.state.draft === false
    }

    backButtonPress() {
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
    }
    getOrganization = (orgId, orgName) => {
        this.setState({
            orgId: orgId,
            orgName: orgName
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
                    <ShipPartsForm
                        organizationAddress={this.props.organizationAddress}
                        shipPart={this.isNew ? null : this.props.shipPart}
                        ref={form => this.form = form}
                        organizations={this.props.organizations}
                        user={this.props.user}
                        poNumbers={this.getPoNumbers()}
                        getOrganization = {this.getOrganization}
                        priceVal = {this.state.DisplayTotal}
                        invoiceCurrency={this.state.invoiceCurrency}
                    />
                    <ShipPartsItems
                        onPressItem={(item, showAttaches) => this.onPressItem(item,
                            showAttaches)}
                        items={this.props.shipPartItems}/>
                    <ShipPartsAttachments
                        updateAttachment={() => this.updateAttachment()}
                        deleteAttachment={id => this.deleteAttachment(id)}
                        attachments={this.props.shiPartAttachments}
                    />
                </Content>
                <ShipPartsBtns
                    save={() => this.saveDraft()}
                    delete={() => this.deleteDraft()}
                    attach={() => this.attachFile()}
                    addItem={() => this.addItem()}
                    submit={() => this.submit()}
                    cancel={() => {
                        // this.navigateToCofC()
                        this.cancel()
                    }}
                />
            </View>
        );
    }
}
