import React from 'react';
import { View } from 'react-native';
import Moment from "moment/moment";
import { Text, Textarea } from 'native-base';
import { partEventsStyle as style } from "../../styles/part-event.style";
import { commonStyle, COLORS } from "../../styles/common.style";
import TextInputValid from "../../components/TextInputValid";
import { Picker } from "../../components/picker/picker.component";
import { DateTimePicker } from "../../components/datetime-picker/datetime-picker.component";
import { User } from "../../models/user";
import { ShipPart } from "../../models/ship-part";
import { weightUOMS, valueUOMS } from "../../constants/uoms";
import { validationErrorText } from "../../styles/Common";
import { ScreenDetector } from "../../utils/screen-detector";
import { Organization } from "../../models/organization";
import { ShipPartView } from "../../models/ship-part-view";
import BackendApi from "../../services/backend";
import { OrganizationAddress } from "../../models/organization-address";
import { CommonForm } from "../../components/common-form.component";
import { shipParts } from "../../constants/accessability";

type Props = {
    organizations: Array<Organization>;
    user: User;
    shipPart: ShipPartView;
    organizationAddress: OrganizationAddress;
    poNumbers: Array<string>;
}

export class ShipPartsForm extends CommonForm<Props> {
    constructor(props: Props) {
        super(props);
        let model;
        let priceVal = null;
        const { shipPart } = this.props;

        if (shipPart) {
            model = { ...shipPart };

            if (model.toOrganization) {
                model.toOrganizationId = model.toOrganization.organization_id;
            }

            if (model.valueUOM) {
                model.valueUOMId = model.valueUOM.uomId;
            }

            if (model.weightUOM) {
                model.weightUOMId = model.weightUOM.uomId;
            }

            if (model.totalValue) {
                priceVal = this.formatCurrency((model.totalValue / 100).toFixed(2));
            }
        } else {
            model = new ShipPart(props.user.organizationId);
        }

      this.state = {
        model: this.clearObjData(model),
        initialModel: JSON.parse(JSON.stringify(this.clearObjData(model))),
        priceVal,
        maxPriceLng: null
      };
    }

  formChanged(): boolean {
    const {model, initialModel} = this.state;
    return JSON.stringify(this.clearObjData(model)) !== JSON.stringify(
        initialModel)
    }

    //validations
    validateOrganization(): boolean {
        return this.validateField('toOrganizationId', 'Organization');
    }

    validateReady(): boolean {
        return this.validateField('ready', 'Ready');
    }

    validateContainerCount() {
        return this.validateForInteger('containerCount', 'Container Count')
    }

    validatePriceVal() {
        return this.validateForInteger('priceVal', 'Total Value')
    }

    validate() {
        const haveErr = [
            this.validateOrganization(),
            this.validateReady(),
            this.validateContainerCount(),
            this.validatePriceVal(),
    ].reduce((err, val) => val ? ++err : err, 0);

        if (haveErr) {
            return null;
        }

        return this.trimModel();
    }

    renderInput(title, field, validFn, isNumeric = false) {
        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    accessibilityLabel={title + " Label"}
                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    {title}
                </Text>
                <TextInputValid
                    accessibilityLabel={title}
                    style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                    autoCapitalize={isNumeric ? 'none' : 'sentences'}
                    onChangeText={value => this.setValue(field, isNumeric && +value ? +value : value, true)}
                    onBlur={() => validFn && validFn.call(this)}
                    value={this.state.model[field]}
                    error={this.state[`${field}Error`]}
                    maxLength={isNumeric ? 16 : 30}
                    keyboardType={isNumeric ? 'numeric' : 'default'}
                />
            </View>
        )
    }

    selectOrganization(organizationId, title) {
        this.setValue('toOrganizationId', organizationId);
        this.props.getOrganization(organizationId, title);
        this.validateOrganization();
        BackendApi.getOrganizationAddress(organizationId);
    }

    renderPicker() {
        let organizations = [...this.props.organizations];
        organizations.sort(function(a,b) {
            let x = a.name.toLowerCase();
            let y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        return (
            <View>
                <Text
                    accessibilityLabel={shipParts.organizationLabel}
                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    * Organization
                </Text>
                <Picker
                    items={organizations.map(c => ({ title: c.name, value: c.organization_id }))}
                    title="Organization"
                    error={this.state.toOrganizationIdError}
                    defaultText="Choose Organization"
                    selected={this.state.model.toOrganizationId}
                    onSelect={({ title, value }) => this.selectOrganization(value, title)}
                    onCancel={() => this.validateOrganization()}
                />
            </View>
        )
    }

    renderTextArea() {
        if (!this.props.poNumbers) {
            return null;
        }

        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    accessibilityLabel={shipParts.pONumbersLabel}
                    style={[commonStyle.inputLabel, commonStyle.textBold, commonStyle.indent(10)]}>
                    P.O. Numbers:
                </Text>
                <Textarea
                    accessibilityLabel={shipParts.pONumbersField}
                    style={[commonStyle.textarea, commonStyle.indent()]}
                    rowSpan={ScreenDetector.isPhone() ? 4 : 6}
                    value={this.props.poNumbers.join('\n')}
                    editable={false}
                    autoCapitalize="sentences"
                    maxLength={200}
                    onChangeText={value => this.setValue('PONumbers', value)}
                />
            </View>
        );
    }

    renderDate() {
        const { ready } = this.state.model;

        return (
            <View style={commonStyle.indent(10)}>
                <View style={[commonStyle.rowBetween, { alignItems: 'center' }]}>
                    <Text
                        accessibilityLabel={shipParts.readyDateLabel}
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        * Ready:
                    </Text>
                    <DateTimePicker
                        date={+ready ? new Date(+ready) : null}
                        onDateChange={(date) => {
                            this.setValue('ready', +date);
                            this.validateReady();
                        }}
                        onCloseModal={() => this.validateReady()}
                    />
                </View>
                <View style={[commonStyle.input, style.dateInput]}>
                    <Text style={style.text} accessibilityLabel={shipParts.readyDateValue}>
                        {+ready ? Moment(new Date(+ready)).format('DD/MMM/YY HH[h]mm') : ''}
                    </Text>
                </View>
                <Text
                    accessibilityLabel={shipParts.readyDateError}
                    style={validationErrorText}
                    numberOfLines={1}
                    ellipsizeMode='head'>
                    {this.state.readyError}
                </Text>
            </View>
        );
    }

    renderTotalWeight() {
        const weightField = 'totalWeight';
        const unitField = 'weightUOMId';
        const pickerItems = Object.keys(weightUOMS).map(key => ({ title: key, value: weightUOMS[key] }));

        return (
            <View>
                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>Total Weight:</Text>
                <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-5)]}>
                    <View style={[commonStyle.flex(0.7), commonStyle.paddingHorizontal(5)]}>
                        <TextInputValid
                            accessibilityLabel={shipParts.weightUOMField}
                            style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                            autoCapitalize="none"
                            onChangeText={value => this.setValue(weightField, value, true)}
                            //onBlur={() => validFn && validFn.call(this)}
                            value={this.state.model[weightField] && this.state.model[weightField].toString()}
                            error={this.state[`${weightField}Error`]}
                            maxLength={16}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={[commonStyle.flex(0.3), commonStyle.paddingHorizontal(5)]}>
                        <Picker
                            items={pickerItems}
                            title="Unit"
                            error={this.state[`${unitField}Error`]}
                            defaultText="Select unit"
                            selected={this.state.model[unitField]}
                            onSelect={({ title, value }) => this.setValue(unitField, value)}
                            onCancel={() => {
                            }}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderTotalValue() {
        const valueField = 'totalValue';
        const unitField = 'valueUOMId';
        const pickerItems = Object.keys(valueUOMS).map(key => ({ title: key, value: valueUOMS[key] }));

        return (
            <View>
                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>Total Value:</Text>
                <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-5)]}>
                    <View style={[commonStyle.flex(0.3), commonStyle.paddingHorizontal(5)]}>
                        <Picker
                            items={pickerItems}
                            title="Unit"
                            error={this.state[`${unitField}Error`]}
                            defaultText="Select unit"
                            selected={this.props.invoiceCurrency ? this.props.invoiceCurrency.value : this.state.model[unitField]}
                            onSelect={({ title, value }) => this.setValue(unitField, value)}
                            onCancel={() => {
                            }}
                        />
                    </View>
                    <View style={[commonStyle.flex(0.7), commonStyle.paddingHorizontal(5)]}>
                        <TextInputValid
                            accessibilityLabel={shipParts.valueUOMField}
                            style={[commonStyle.input, commonStyle.colorBlack]}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                this.setCurrency(text, valueField);
                                this.validatePriceVal();
                            }}
                            value={this.props.priceVal}
                            error={this.state[`${valueField}Error`]}
                            maxLength={this.state.maxPriceLng || 16}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderAddress() {
        if (!this.props.organizationAddress) {
            return <View/>;
        }

        return (
            <View style={commonStyle.indent(30)}>
                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}
                    accessibilityLabel={shipParts.addressLabel}>Address:</Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressLine1Value}>
                    {this.props.organizationAddress.addressLine1}</Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressLine2Value}>
                    {this.props.organizationAddress.addressLine2}</Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressCityAndPostalCodeValue}>
                    {this.props.organizationAddress.city}
                    {this.props.organizationAddress.postalCode && `, ${this.props.organizationAddress.postalCode }`}
                </Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressStateCodeValue}>
                    {this.props.organizationAddress.stateCode}</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={style.formContainer}>
                <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                    <Text
                        accessibilityLabel={shipParts.fromOrgLabel}
                        style={[style.textTitle, commonStyle.indent(10)]}>
                        FROM:
                    </Text>
                    <Text
                        accessibilityLabel={shipParts.fromOrgValue}
                        style={[style.textTitle, commonStyle.color(COLORS.blue), commonStyle.indent(10)]}>
                        {this.props.user.organization}
                    </Text>
                    {this.renderInput('Shipment #:', 'shipment')}
                    {this.renderInput('Carrier:', 'carrier')}
                    {this.renderDate()}
                    {this.renderInput('Container Count:', 'containerCount', this.validateContainerCount, true)}
                    {this.renderTotalWeight()}
                    {this.renderTotalValue()}
                </View>
                <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                    <Text
                        accessibilityLabel={shipParts.toOrgLabel}
                        style={[style.textTitle, commonStyle.indent(10)]}>
                        TO:
                    </Text>
                    {this.renderPicker()}
                    {this.renderAddress()}
                    {this.renderTextArea()}
                </View>
            </View>
        )
    }
}
