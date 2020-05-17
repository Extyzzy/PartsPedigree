import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity} from 'react-native';
import {Content} from 'native-base';
import {partEventsStyle as style} from "../../styles/part-event.style";
import {commonStyle, COLORS} from "../../styles/common.style";
import {branch} from "baobab-react/higher-order";
import {ShipPartItemView} from "../../models/ship-part-item-view";
import {ShipPartsAttachments} from "../ship-parts/ship-part-attachments.component";
import Moment from "moment/moment";
import {shipParts} from "../../constants/accessability";
import {FormSplitter} from "../../components/form-splitter.component";

type Props = {
    shipPartItem: ShipPartItemView;
}

@branch({
    shipPartItem: ['shipPartItem'],
})
export class ShipPartsItemDetail extends Component<Props> {
    static childContextTypes = {
        getParentId: PropTypes.func,
    };

    getChildContext() {
        return {
            getParentId: () => ({type: 'eventId', id: this.props.shipPartItem.eventId}),
        };
    }

    renderItem(title, text, last = false) {
        if (!text) {
            return null;
        }

        return (
            <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        accessibilityLabel={title + " Title"}
                        style={[style.text, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        accessibilityLabel={title + " Title"}
                        style={style.text}>
                        {text}
                    </Text>
                </View>
            </View>
        );
    }

    renderDate(title, value) {
        if (!value) {
            return null;
        }

        return (
            <View style={[commonStyle.flexRow, commonStyle.indent(15)]}>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        accessibilityLabel={shipParts.cureDateLabel}
                        style={[style.text, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        accessibilityLabel={shipParts.cureDateValue}
                        style={style.text}>
                        {Moment(+value).format('DD/MMM/YY HH[h]mm')}
                    </Text>
                </View>
            </View>
        );
    }

    renderTaxValue(title, text, currency, last = false) {
        if (!text || !currency) {
            return null;
        }

        return (
            <View>
                <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                    <View style={commonStyle.flex(0.5)}>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={[style.text, commonStyle.textBold]}>
                            {title}:
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.5), {flexDirection: 'row'}]}>
                        <View style={[style.text, commonStyle.textBold, {marginRight: 10}]}>
                            {currency === 4 ? <Text>GBP</Text> : <Text>USD</Text> }
                        </View>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={style.text}>
                            {text}
                        </Text>
                    </View>
                </View>
            </View>)
    }

    renderSubTotal(title, text, currency, last = false) {
        if (!text) {
            return null;
        }

        return (
            <View>
                <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                    <View style={commonStyle.flex(0.5)}>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={[style.text, commonStyle.textBold]}>
                            {title}:
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.5), {flexDirection: 'row'}]}>
                        <View style={[style.text, commonStyle.textBold, {marginRight: 10}]}>
                            {currency === 4 ? <Text>GBP</Text> : <Text>USD</Text> }
                        </View>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={style.text}>
                            {text ? (text / 100).toFixed(2) : 0}
                        </Text>
                    </View>
                </View>
            </View>)
    }

    renderTotal(title, text, currency, last = false) {
        if (!text) {
            return null;
        }

        return (
            <View>
                <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                    <View style={commonStyle.flex(0.5)}>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={[style.text, commonStyle.textBold]}>
                            {title}:
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.5), {flexDirection: 'row'}]}>
                        <View style={[style.text, commonStyle.textBold, {marginRight: 10}]}>
                            {currency === 4 ? <Text>GBP</Text> : <Text>USD</Text> }
                        </View>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={style.text}>
                            {text ? (text / 100).toFixed(2) : 0}
                        </Text>
                    </View>
                </View>
            </View>)
    }

    navigateToScreen(screen, id) {
        if (screen === 'PartInstance') {
            this.props.navigation.navigate(screen, {partInstanceId: id});
        }
        if (screen === 'PartMaster') {
            this.props.navigation.navigate(screen, {partMasterId: id});
        }

    }

    renderPartNumber(title, text, last = false) {

        const {shipPartItem} = this.props;
        const {partInstance = {}} = shipPartItem;
        const partMaster = (partInstance && partInstance.partMaster) || shipPartItem.partMaster || {};

        if (!text) {
            return null;
        }

        return (
            <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        accessibilityLabel={title + " Title"}
                        style={[style.text, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <TouchableOpacity
                    style={commonStyle.flex(0.5)}
                    onPress={() => this.navigateToScreen('PartMaster', partMaster && partMaster.partMasterId)}>
                    <View>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={[style.text, commonStyle.color(COLORS.blue)]}>
                            {text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderSerialNumber(title, text, last = false) {
        const {shipPartItem} = this.props;
        const {partInstance = {}} = shipPartItem;

        if (!text) {
            return null;
        }

        return (
            <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        accessibilityLabel={title + " Title"}
                        style={[style.text, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <TouchableOpacity
                    style={commonStyle.flex(0.5)}
                    onPress={() => this.navigateToScreen('PartInstance', partInstance && partInstance.partInstanceId)}>
                    <View>
                        <Text
                            accessibilityLabel={title + " Title"}
                            style={[style.text, commonStyle.color(COLORS.blue)]}>
                            {text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {shipPartItem, navigation} = this.props;
        const {partInstance = {}} = shipPartItem;
        const partMaster = (partInstance && partInstance.partMaster) || shipPartItem.partMaster || {};
        const {routeName} = navigation.state;
        const subTotal = shipPartItem.unitPrice && shipPartItem.quantity && shipPartItem.unitPrice * shipPartItem.quantity;
        const total = subTotal + shipPartItem.lineTaxValue;
        return (
            <View style={commonStyle.flex(1)}>
                <Content>
                    <View style={style.padding}>
                        {shipPartItem.reason && this.renderItem('Reason for Changes', shipPartItem.reason.reason)}
                        {this.renderPartNumber('Part #', partMaster && partMaster.mpn)}
                        {this.renderItem('Part Name', partMaster && partMaster.partName)}
                        {this.renderItem('Description', partMaster && partMaster.description)}
                        {this.renderItem('UOM', partMaster && partMaster.uom && partMaster && partMaster.uom.name)}
                        {this.renderItem('CAGE Code', partMaster && partMaster.manufacturerCage)}
                        {this.renderItem('Country of Origin', partMaster && partMaster.country.name)}
                        {this.renderSerialNumber('Serial #', partInstance && partInstance.serialNumber)}
                        {this.renderSerialNumber('Batch #', partInstance && partInstance.batchNumber)}
                        {this.renderItem('Internal tracking number', shipPartItem && shipPartItem.internalTrackingNumber)}
                        {this.renderItem('Quantity', shipPartItem.quantity)}
                        {this.renderItem('P.O. Number', shipPartItem.poNumber)}
                        {this.renderItem('Issue', shipPartItem.issue)}
                        {this.renderItem('Material Spec', shipPartItem.materialSpec)}
                        {this.renderItem('Cure Date Code', shipPartItem.cureDateCode)}
                        {this.renderDate('Cure Date', (shipPartItem.cureDate || +new Date()))}
                        {this.renderItem('151 DFMELT Clause', shipPartItem.clause_151_dfmelt)}
                        {this.renderItem('002C MERC Clause', shipPartItem.clause_002c_merc)}
                        {this.renderItem('Advice Note', shipPartItem.adviceNote, true)}
                        {
                            shipPartItem.invoiceNumber || shipPartItem.invoiceDate || shipPartItem.unitPrice || subTotal || shipPartItem.taxRateApplied || shipPartItem.lineTaxValue || total ?
                                <View style={{marginTop: 15, marginBottom: 15}}>
                                    <FormSplitter text="INVOICING DETAILS"/>
                                </View> : null }
                        { shipPartItem.invoiceNumber ? this.renderItem('Invoice Number/Reference', shipPartItem.invoiceNumber) : null}
                        { shipPartItem.invoiceDate ? this.renderDate('Invoice date', shipPartItem.invoiceDate) : null}
                        { shipPartItem.unitPrice ? this.renderItem('Unit Price', shipPartItem.unitPrice && (shipPartItem.unitPrice / 100).toFixed(2)) : null}
                        { subTotal ? this.renderSubTotal('Sub-total', subTotal, shipPartItem.invoiceCurrency) : null}
                        { shipPartItem.invoiceCurrency ? this.renderItem('Invoice Currency', shipPartItem.invoiceCurrency && shipPartItem.invoiceCurrency.name) : null}
                        { shipPartItem.taxRateApplied ? this.renderItem('Tax Rate Applied', shipPartItem.taxRateApplied + '%') : null}
                        { shipPartItem.lineTaxValue ? this.renderTaxValue('Tax value', (shipPartItem.lineTaxValue / 100).toFixed(2), shipPartItem.invoiceCurrency) : null}
                        { total ? this.renderTotal('Total', total, shipPartItem.invoiceCurrency) : null}
                    </View>
                    {routeName !== 'ArrivalItemDetail' ?
                        <ShipPartsAttachments isDetail attachments={shipPartItem.attachments}/> : null
                    }
                </Content>
            </View>
        );
    }
}
