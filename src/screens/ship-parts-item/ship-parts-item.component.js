import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Alert, ScrollView } from 'react-native';
import { Content } from 'native-base';
import { ShipPartsItemSearch } from "./ship-parts-item-search.component";
import { ShipPartsItemForm } from "./ship-part-item-form.component";
import { partEventsStyle as style } from "../../styles/part-event.style";
import { commonStyle } from "../../styles/common.style";
import { StateService } from "../../services/state.service";
import { PartInstanceInfo } from "../../components/part-instance-info/part-instance-info.component";
import { ScreenDetector } from "../../utils/screen-detector";
import { ShipPartItem } from "../../models/ship-part-item";
import BackendApi from "../../services/backend";
import { ShipPartsAttachments } from "../ship-parts/ship-part-attachments.component";
import { FilePicker } from "../../utils/file-picker";
import PropTypes from 'prop-types';
import { Picker } from "../../components/picker/picker.component";
import { shipParts } from "../../constants/accessability";

export class ShipPartsItem extends Component {
    scrollView: ScrollView;
    form: ShipPartsItemForm;
    eventDraftId: string;
    shipItemId: string;
    isReceive = false;
    showAttaches: boolean;

    static childContextTypes = {
        getParentId: PropTypes.func,
    };

    getChildContext() {
        return {
            getParentId: () => ({ type: 'eventDraftId', id: this.props.shipPartItem.eventDraftId }),
        };
    }

    constructor(props) {
        super(props);

        const { eventDraftId, shipItemId, showAttaches } = props.navigation.state.params;

        this.showAttaches = showAttaches;
        this.eventDraftId = eventDraftId;
        this.shipItemId = shipItemId;
    }

    componentDidMount() {
        StateService.setPartInstance(null);
        StateService.setPartMaster(null);
        StateService.setShipPartItem(null);
        StateService.setShipItemAttachments(null);

        if (this.shipItemId) {
            BackendApi.getPartShipItem(this.shipItemId);
            BackendApi.getShipItemAttachments(this.shipItemId)
                .then(() => {
                    if (this.showAttaches && this.scrollView) {
                        setTimeout(() => this.scrollView.scrollToEnd(), 500);
                    }
                });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.partInstance && !this.shipItemId &&
            (!this.props.partInstance || this.props.partInstance.partInstanceId !== nextProps.partInstance.partInstanceId)) {

            StateService.setTextSearchShipParts(false);
            BackendApi.addShipPartItem(this.eventDraftId, { partInstanceId: nextProps.partInstance.partInstanceId });
        }
    }

    cancel() {
        this.props.navigation.goBack();
    }

    deleteAttachment(id) {
        BackendApi.removeShipItemAttachment(id);
    }

    attachFile() {
        this.props.navigation.navigate('AddAttachment', {
            id: this.props.shipPartItem.shipItemId,
            type: 'item',
            callback: () => BackendApi.getShipItemAttachments(this.props.shipPartItem.shipItemId),
        });
    }

    save(callback: Function) {
        const shipPartItem: ShipPartItem = this.form.validate();
        StateService.setPoNumber(shipPartItem.poNumber);
        if (!shipPartItem) {
            return;
        }

        if (shipPartItem.shipItemId) {

            if (this.isReceive && this.state.receiveReasonId !== null) {
                shipPartItem.receiveReasonId = this.state.receiveReasonId;
            }
            if ( this.props.navigation.state.params.fromReceiving){
                BackendApi.addReceivePartItem(this.eventDraftId, shipPartItem).then(() => this.getItemsList(shipPartItem.eventDraftId))
                    .then(() => {
                        Alert.alert('Success', 'Ship Parts Item was successfully updated', [{
                            text: 'OK', onPress: callback
                        }]);
                    });
            } else {
                BackendApi.updateShipPartItem(shipPartItem)
                    .then(() => this.getItemsList(shipPartItem.eventDraftId))
                    .then(() => {
                        Alert.alert('Success', 'Ship Parts Item was successfully updated', [{
                            text: 'OK', onPress: callback
                        }]);
                    });
            }
        }
    }

    getItemsList(eventDraftId) {
        return BackendApi.getPartShipItemsList(eventDraftId);
    }

    saveBack() {
        this.save(() => this.cancel());
    }

    saveNext() {
        this.save(() => {
            this.shipItemId = null;
            StateService.setShipPartItem(null);
            StateService.setShipItemAttachments(null);
            // this.props.navigation.goBack();
            return <ShipPartsItemSearch
                listingScreen={this.isReceive ? 'PartInstanceItemsListing' : 'PartItemsListing'}/>
        });
    }

    updateAttachment() {
        BackendApi.getShipItemAttachments(this.shipItemId);
    }

    renderReasons() {
        const { receiveReasons } = this.props;
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter, style.padding]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={shipParts.reasonForChangesLabel}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        Reason for Changes:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.6)}>
                    <Picker
                        items={receiveReasons && receiveReasons.map(c => ({
                            title: c.reason,
                            value: c.receiveReasonId
                        }))}
                        title="Reason"
                        error={''}
                        defaultText="Select Reason"
                        selected={this.state.receiveReasonId}
                        onSelect={({ title, value }) => this.setState({ receiveReasonId: value })}
                        onCancel={() => {}}
                    />
                </View>
            </View>
        )
    }

    renderBtns() {
        return (
            <View style={style.btnContainer}>
                <TouchableOpacity
                    onPress={() => this.saveBack()}
                    style={[style.btn, commonStyle.flex(0.3)]}
                    activeOpacity={0.5}
                    accessibilityLabel={shipParts.saveAndBackButton}
                >
                    <Text style={style.btnText}>Save & Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.attachFile()}
                    style={[style.btn, commonStyle.flex(0.2)]}
                    activeOpacity={0.5}
                    accessibilityLabel={shipParts.attachmentsButton}
                >
                    <Image
                        style={ScreenDetector.isPhone() && commonStyle.size(15, 16)}
                        source={require('../../assets/icons/paperclip_white_icon.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.saveNext()}
                    style={[style.btn, commonStyle.flex(0.3)]}
                    activeOpacity={0.5}
                    accessibilityLabel={shipParts.saveAndNextButton}
                >
                    <Text style={style.btnText}>Save & Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.cancel()}
                    style={[style.btn, commonStyle.whiteBg, commonStyle.flex(0.2)]}
                    activeOpacity={0.5}
                    accessibilityLabel={shipParts.cancelButton}
                >
                    <Text style={style.text}>Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { partInstance, partMaster, shipPartItem, shipItemAttachments } = this.props;

        return (
            <View style={style.container}>
                <Content innerRef={ref => this.scrollView = ref}>
                    {!this.shipItemId && <ShipPartsItemSearch
                        listingScreen={this.isReceive ? 'PartInstanceItemsListing' : 'PartItemsListing'}/>}
                    {(!!partInstance || !!partMaster) && !!shipPartItem &&
                    <View>
                        {this.isReceive && this.renderReasons()}
                        <PartInstanceInfo partInstance={partInstance || { partMaster }}/>
                        <ShipPartsItemForm
                            zeroPossibleQty={this.isReceive && !!this.shipItemId}
                            fixedQty={!!partInstance && partInstance.serialNumber && !this.isReceive}
                            shipPartItem={shipPartItem}
                            ref={form => this.form = form}
                        />
                    </View>
                    }
                    <ShipPartsAttachments
                        deleteAttachment={id => this.deleteAttachment(id)}
                        attachments={shipItemAttachments}
                        updateAttachment={() => this.updateAttachment()}
                    />
                </Content>
                {(!!partInstance || !!partMaster) && !!shipPartItem && this.renderBtns()}
            </View>
        );
    }
}
