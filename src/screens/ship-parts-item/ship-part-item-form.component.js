import React from 'react';
import {Image, View} from 'react-native';
import Moment from "moment/moment";
import {Text} from 'native-base';
import {commonStyle} from "../../styles/common.style";
import TextInputValid from "../../components/TextInputValid";
import {DateTimePicker} from "../../components/datetime-picker/datetime-picker.component";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {ShipPartItem} from "../../models/ship-part-item";
import {ScreenDetector} from "../../utils/screen-detector";
import {ShipPartItemView} from "../../models/ship-part-item-view";
import {CommonForm} from "../../components/common-form.component";
import {Picker} from "../../components/picker/picker.component";
import {valueUOMS} from "../../constants/uoms";
import {validationErrorText} from "../../styles/Common";
import {FormSplitter} from "../../components/form-splitter.component";
import {shipParts} from "../../constants/accessability";

type Props = {
    shipPartItem: ShipPartItemView;
    fixedQty: boolean;
    zeroPossibleQty: boolean;
}

export class ShipPartsItemForm extends CommonForm<Props> {
    constructor(props: Props) {
        super(props);

        let priceVal = null;
        let lineTaxVal = null;

        const model = props.shipPartItem ? {...props.shipPartItem} : new ShipPartItem();

        if (!model.invoiceCurrency) {
            model.invoiceCurrency = valueUOMS.GBP;
        }

        if (model.unitPrice) {
            priceVal = this.formatCurrency((model.unitPrice / 100).toFixed(2));
        }

        if (model.lineTaxValue) {
            lineTaxVal = this.formatCurrency((model.lineTaxValue / 100).toFixed(2));
        }


        this.state = {
            model: this.clearObjData(model), //toDo: jrpc architectural solution
            priceVal,
            lineTaxVal,
            maxPriceLng: null,
            currency: 'GBP'
        };
        this.state.model['materialSpec'] = props.shipPartItem.partInstance.materialSpec || '';
    }

    // componentDidMount() {
    //     if (this.props.fixedQty) {
    //         this.setValue('quantity', 1);
    //     }
    // }

    //validations
    validateQuantity() {
        return this.validateField('quantity', 'Quantity') ||
            (this.props.zeroPossibleQty ?
                this.validateForZeroPossibleInteger('quantity', 'Quantity', 'integer greater than or equal to 0') :
                this.validateForInteger('quantity', 'Quantity', 'integer greater than or equal to 1'));
    }

    validatePoNumber() {
        return this.validateField('poNumber', 'P.O. Number');
    }

    validateMerc() {
        return this.validateField('clause_002c_merc', '002С MERC Clause');
    }

    validateAdviceNote() {
        return this.validateField('adviceNote', 'Advice Note');
    }

    validateUnitPrice() {
        return this.validateField('unitPrice', 'Unit Price') || this.validateForInteger('unitPrice', 'Unit Price');
    }

    validateLineTaxValue() {
        return this.validateField('lineTaxValue', 'Line Tax Value') || this.validateForFloat('lineTaxValue', 'Line Tax Value');
    }

    validateTaxRateApplied() {
        return this.validateField('taxRateApplied', 'Tax rate applied');
    }

    validateInvoiceNumber() {
        return this.validateField('invoiceNumber', 'Invoice Number/Reference');
    }

    validateInvoiceDate() {
        return this.validateField('invoiceDate', 'Invoice date:');
    }

    validate() {
        const haveErr = [
            this.validateQuantity(),
            this.validatePoNumber(),
            this.validateMerc(),
            this.validateAdviceNote(),
            // this.validateUnitPrice(),
            // this.validateLineTaxValue(),
            // this.validateInvoiceNumber(),
            // this.validateInvoiceDate(),
            // this.validateTaxRateApplied()
        ].reduce((err, val) => val ? ++err : err, 0);

        if (haveErr) {
            return null;
        }

        const model = this.trimModel();

        if (model.lineTaxValue) {
            model.lineTaxValue = +model.lineTaxValue.toFixed(2);
        }

        return this.trimModel();
    }

    renderInput(title, field, validFn, isNumeric = false, disabled = false, maxLength) {
        const msxLng = maxLength || (isNumeric ? 16 : 30);
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={title + " Label"}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.6)}>
                    <TextInputValid
                        accessibilityLabel={title + " Input Field"}
                        disabled={disabled}
                        style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                        autoCapitalize={isNumeric ? 'none' : 'sentences'}
                        onChangeText={value => this.setValue(field, isNumeric && +value ? +value : value, true)}
                        onBlur={() => validFn && validFn.call(this)}
                        value={this.state.model[field]}
                        error={this.state[`${field}Error`]}
                        maxLength={msxLng}
                    />
                </View>
            </View>
        );
    }

    renderDate(field, title, validFn) {
        const cureDate = this.state.model[field];
        const err = this.state[`${field}Error`];
        return (
            <View
                style={[commonStyle.flexRow, commonStyle.alignCenter, commonStyle.paddingVertical(6), commonStyle.indent(10)]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={title + " Label"}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        {title}
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.6), commonStyle.alignCenter]}>
                    <View style={[commonStyle.input, commonStyle.flexRow, commonStyle.alignCenter]}>
                        <DateTimePicker
                            style={!ScreenDetector.isPhone() ? commonStyle.indent(15) : null}
                            mode="date"
                            date={+cureDate ? new Date(+cureDate) : null}
                            onDateChange={date => {
                                this.setValue(field, +date);
                                validFn && validFn.call(this);
                            }}
                        />
                        {cureDate &&
                        <Text
                            accessibilityLabel={title + " Value"}
                            style={[style.text, commonStyle.paddingHorizontal(10)]}>
                            {+cureDate ? Moment(new Date(+cureDate)).format('DD-MM-YYYY') : ''}
                        </Text>
                        }
                    </View>
                    {!!err &&
                    <Text
                        accessibilityLabel={title + " Error"}
                        style={[validationErrorText, {alignSelf: 'flex-start'}]}
                        ellipsizeMode='head'>
                        {err}
                    </Text>
                    }
                </View>
            </View>
        )
    }

    renderUnitPrice() {
        const field = 'unitPrice';

        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={shipParts.unitPriceLabel}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        Unit Price
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.6), commonStyle.rowBetween]}>
                    <View style={commonStyle.flex(0.2)}>
                        {this.renderInvoiceCurrency()}
                    </View>
                    <View style={commonStyle.flex(0.7)}>
                        <TextInputValid
                            accessibilityLabel={shipParts.unitPriceValue}
                            style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                this.setCurrency(text, field, 20);
                                this.validateUnitPrice();
                            }}
                            value={this.state.priceVal}
                            error={this.state.unitPriceError}
                            maxLength={this.state.maxPriceLng}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderLineTaxValue() {
        const field = 'lineTaxValue';
        const {taxRateApplied, subtotal} = this.state.model;
        const val = taxRateApplied / 100 * subtotal;
        this.state.model['lineTaxValue'] = val;
        return (
            <View style={[commonStyle.flexRow]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={shipParts.unitPriceLabel}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        Tax value
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.6), commonStyle.rowBetween]}>
                    <View style={[commonStyle.flex(0.2)]}>
                        <Text>
                            {this.state.currency}
                        </Text>
                    </View>
                    <View style={commonStyle.flex(0.7)}>
                        <Text style={[commonStyle.colorBlack, style.text, {justifyContent: 'flex-start'}]}>
                            {val ? (val / 100).toFixed(2) : 0}
                        </Text>

                    </View>
                </View>
            </View>
        );
    }

    renderTaxRate(title, field, validFn, isNumeric = false, disabled = false, maxLength) {
        const msxLng = maxLength || (isNumeric ? 16 : 30);
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={title + " Label"}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.6), {flexDirection: 'row'}]}>
                    <TextInputValid
                        keyboardType={'numeric'}
                        accessibilityLabel={title + " Input Field"}
                        disabled={disabled}
                        style={[commonStyle.input, commonStyle.colorBlack, style.text, {width: 50}]}
                        autoCapitalize={isNumeric ? 'none' : 'sentences'}
                        onChangeText={value => this.setValue(field, isNumeric && value ? value : value, true)}
                        onBlur={() => validFn && validFn.call(this)}
                        value={this.state.model[field]}
                        error={this.state[`${field}Error`]}
                        maxLength={msxLng}
                    />
                    <Text>%</Text>
                </View>
            </View>
        );
    }

    renderInvoiceCurrency() {
        const field = 'invoiceCurrency';
        const title = 'Invoice Currency';
        const pickerItems = Object.keys(valueUOMS).map(key => ({title: key, value: valueUOMS[key]}));

        return (
            <View style={[commonStyle.flexRow, commonStyle.flexCenter, commonStyle.textarea, {
                paddingBottom: 0,
                marginBottom: 0
            }]}>
                <View style={{marginRight: 2}}>
                    <Picker
                        items={pickerItems}
                        title={title}
                        error={this.state[`${field}Error`]}
                        defaultText="Select currency"
                        selected={this.state.model[field]}
                        onSelect={({title, value}) => {
                            this.setValue(field, value, title);
                            if (value === 4) {
                                this.setState({
                                    currency: 'GBP'
                                })
                            } else {
                                this.setState({
                                    currency: 'USD'
                                })
                            }
                        }}
                        onCancel={() => {
                        }}
                    />
                </View>
                <View>
                    <Image style={{width: 10, height: 10, marginBottom: 15}}
                           source={require('../../assets/iconArrow.png')}/>
                </View>
            </View>
        );
    }


    renderLineValue() {
        const {quantity, unitPrice} = this.state.model;

        const val = quantity * unitPrice;

        this.state.model['subtotal'] = val;
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter, commonStyle.indent(5)]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={shipParts.lineValueLabel}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        Sub-total:
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.6), commonStyle.rowBetween]}>
                    <View style={[commonStyle.flex(0.2)]}>
                        <Text>
                            {this.state.currency}
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.7)]}>
                        <Text
                            accessibilityLabel={shipParts.lineValue}
                            style={[commonStyle.colorBlack, style.text, {justifyContent: 'flex-start'}]}>
                            {val ? (val / 100).toFixed(2) : 0}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    renderITN(title, field, validFn, isNumeric = false, disabled = false, maxLength) {
        const msxLng = maxLength || (isNumeric ? 16 : 30);
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={title + " Label"}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.6)}>
                    <TextInputValid
                        accessibilityLabel={title + " Input Field"}
                        disabled={disabled}
                        style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                        autoCapitalize={isNumeric ? 'none' : 'sentences'}
                        onChangeText={value => this.setValue(field, isNumeric && +value ? +value : value, true)}
                        onBlur={() => validFn && validFn.call(this)}
                        value={this.state.model[field]}
                        error={this.state[`${field}Error`]}
                        maxLength={msxLng}
                    />
                </View>
            </View>
        );
    }

    renderTotal(title, field, validFn, isNumeric = false, disabled = false, maxLength) {
        const msxLng = maxLength || (isNumeric ? 16 : 30);
        const {subtotal, lineTaxValue} = this.state.model;
        const val = subtotal + lineTaxValue;
        this.state.model['total'] = val;
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={title + " Label"}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.6), commonStyle.rowBetween]}>
                    <View style={[commonStyle.flex(0.2)]}>
                        <Text>
                            {this.state.currency}
                        </Text>
                    </View>
                    <View style={commonStyle.flex(0.7)}>
                        <Text style={[commonStyle.colorBlack, style.text, {justifyContent: 'flex-start'}]}>
                            {val ? (val / 100).toFixed(2) : 0}
                        </Text>

                    </View>
                </View>
            </View>
        );
    }
    renderQuantity(title, field, validFn, isNumeric = false, disabled = false, maxLength) {
        const msxLng = maxLength || (isNumeric ? 16 : 30);
        return (
            <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        accessibilityLabel={title + " Label"}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.6)}>
                    <TextInputValid
                        keyboardType={'numeric'}
                        accessibilityLabel={title + " Input Field"}
                        disabled={disabled}
                        style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                        autoCapitalize={isNumeric ? 'none' : 'sentences'}
                        onChangeText={value => this.setValue(field, isNumeric && +value ? +value : value, true)}
                        onBlur={() => validFn && validFn.call(this)}
                        value={this.state.model[field]}
                        error={this.state[`${field}Error`]}
                        maxLength={msxLng}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View>
                <View style={style.padding}>
                    {this.renderITN('Internal Tracking Number', 'internalTrackingNumber')}
                    {this.renderQuantity('* Quantity', 'quantity', this.validateQuantity, this.props.fixedQty)}
                    {this.renderInput('* P.O. Number', 'poNumber', this.validatePoNumber)}
                    {this.renderInput('Material Spec', 'materialSpec')}
                    {this.renderInput('Cure Date Code', 'cureDateCode')}
                    {this.renderDate('cureDate', 'Cure Date:')}
                    {this.renderInput('151 DFMELT Clause', 'clause_151_dfmelt')}
                    {this.renderInput('* 002C MERC Clause', 'clause_002c_merc', this.validateMerc)}
                    {this.renderInput('* Advice Note', 'adviceNote', this.validateAdviceNote)}
                </View>
                <FormSplitter text="INVOICING DETAILS"/>
                <View style={style.padding}>
                    {this.renderInput('Invoice Number/Reference', 'invoiceNumber', this.validateInvoiceNumber, false, false, 40)}
                    {this.renderDate('invoiceDate', 'Invoice date:', this.validateInvoiceDate)}
                    {this.renderUnitPrice()}
                    {/*{this.renderInvoiceCurrency()}*/}
                    {this.renderLineValue()}
                    {/* {this.renderInput('Line tax value', 'lineTaxValue', this.validateLineTaxValue, true)} */}
                    {this.renderTaxRate('Tax rate applied', 'taxRateApplied', this.validateTaxRateApplied, true)}
                    {this.renderLineTaxValue()}
                    {this.renderTotal('Total', 'total', this.validateQuantity)}
                </View>
            </View>
        )
    }
}
