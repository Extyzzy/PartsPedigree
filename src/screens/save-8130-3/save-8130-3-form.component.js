import React from 'react';
import { View, Text } from 'react-native';
import Moment from "moment/moment";
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { save81303Style as style } from '../../styles/save-8130-3.style';
import { commonStyle } from "../../styles/common.style";
import { COLORS } from "../../styles/variables";
import { CommonForm } from "../../components/common-form.component";
import { FormSplitter } from "../../components/form-splitter.component";
import { DateTimePicker } from "../../components/datetime-picker/datetime-picker.component";
import { Save8130Items } from "./save-8130-3-items.component";
import { Event81303 } from "../../models/event81303";
import { validationErrorText } from "../../styles/Common";
import { Event81303View } from "../../models/event81303View";
import { ScreenDetector } from "../../utils/screen-detector";

type Props = {
    event81303: Event81303View;
}

export class Save8130Form extends CommonForm<Props> {
    constructor(props: Props) {
        super(props);

        const event81303 = new Event81303();

        this.state = {
          model: {...event81303, ...this.props.event81303},
          initialModel: JSON.parse(
              JSON.stringify({...event81303, ...this.props.event81303}))
        }
    }

  formChanged() {
    return JSON.stringify(this.state.model) !== JSON.stringify(
        this.state.initialModel)
  }

    //validations
    validateOrderNumber() {
        return this.validateField('orderNumber', 'Work Order/Contract/Invoice Number');
    }

    validateStatus() {
        return this.validateField('status', 'Status/Work');
    }

    validateRemarks() {
        return this.validateField('remarks', 'Remarks');
    }

    validateAuthorizationNumber() {
        return this.validateField('authorizationNumber', 'Approval/Authorization Number');
    }

    validateCertificateNumber() {
        return this.validateField('certificateNumber', 'Approval/Certificate Number');
    }

    validate() {
        const haveErr = [
            this.validateOrderNumber(),
            this.validateStatus(),
            this.validateRemarks(),
            this.state.model.isApproveOrCertifyType ?
                this.validateAuthorizationNumber() :
                this.validateCertificateNumber(),
        ].reduce((err, val) => val ? ++err : err, 0);

        if (haveErr) {
            return null;
        }

        return this.trimModel();
    }

    radioBtnStatus(val) {
        if (val === true) return 0;
        if (val === false) return 1;
    }

    renderRadioBtns() {
        return (
            <View>
                <RadioGroup
                    size={ScreenDetector.isPhone() ? 16 : 24}
                    color={COLORS.black}
                    selectedIndex={this.radioBtnStatus(this.state.model.isApproveOrCertifyType)}
                    onSelect={(index, value) => this.setValue('isApproveOrCertifyType', value)}
                >
                    <RadioButton value={true}>
                        <Text style={style.text}>Approve or certify that new/used parts meet FAA conformity requirements</Text>
                    </RadioButton>

                    <RadioButton value={false}>
                        <Text style={style.text}>Certify approval for return to service following maintenance</Text>
                    </RadioButton>
                </RadioGroup>
            </View>
        );
    }

    render13a() {
        return (
            <View style={commonStyle.indent()}>
                <Text style={[commonStyle.inputLabel, style.text, commonStyle.indent()]}>
                    13a. Certifies the items identified above were manufactured in conformity to:
                </Text>
                <View style={commonStyle.paddingHorizontal(10)}>
                    <RadioGroup
                        size={ScreenDetector.isPhone() ? 16 : 24}
                        selectedIndex={this.radioBtnStatus(this.state.model.itemsApproved)}
                        color={COLORS.black}
                        onSelect={(index, value) => this.setValue('itemsApproved', value)}
                    >
                        <RadioButton value={true}>
                            <Text style={style.text}>Approved design data and are in condition for safe operation.</Text>
                        </RadioButton>

                        <RadioButton value={false}>
                            <Text style={style.text}>Non-Approved design data specified in Block 12.</Text>
                        </RadioButton>
                    </RadioGroup>
                    {this.state.itemsApprovedError &&
                    <Text style={validationErrorText} ellipsizeMode='head'>{this.state.itemsApprovedError}</Text>
                    }
                </View>
            </View>
        )
    }

    render14a() {
        return (
            <View style={[commonStyle.indent(), commonStyle.flexRow]}>
                <View style={style.a14block}>
                    <View style={commonStyle.indent()}>
                        <RadioGroup
                            size={ScreenDetector.isPhone() ? 16 : 24}
                            selectedIndex={this.radioBtnStatus(this.state.model.returnToService)}
                            color={COLORS.black}
                            onSelect={(index, value) => this.setValue('returnToService', value)}
                        >
                            <RadioButton value={true}>
                                <Text style={style.text}>14 CFR 43.9 Return to Service.</Text>
                            </RadioButton>

                            <RadioButton value={false}>
                                <Text style={style.text}>Other regulation specified in Block 12.</Text>
                            </RadioButton>
                        </RadioGroup>
                    </View>
                    <Text style={style.a14text}>
                        Certiﬁes that unless otherwise speciﬁed in Block 12, the work identiﬁed
                        in Block 11 and described in Block 12 was accomplished in accordance

                        with Title 14, Code of Federal Regulations, part 43 and in respect to that
                        work, the items are approved for return to service.
                    </Text>
                    <Text style={[style.a14title, style.text]}>14a.</Text>
                </View>
            </View>
        );
    }

    renderDate(title, value) {
        return (
            <View>
                <Text style={[commonStyle.inputLabel, commonStyle.indent()]}>{title}</Text>
                <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                    <Text style={style.dateText}>{Moment(this.state.date).format('DD / MMM / YYYY')}</Text>
                    <View style={commonStyle.marginHorizontal(5)}>
                        <DateTimePicker
                            mode="date"
                            format="dd/mmm/yyyy"
                            onDateChange={date => this.setState({ date: new Date(date) })}
                        />
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={{ backgroundColor: COLORS.white }}>
                <View style={style.container}>
                    {this.renderInput('5. *Work Order/Contract/Invoice Number', 'orderNumber', this.validateOrderNumber)}
                </View>
                <FormSplitter text="ITEM LISTING"/>
                <Save8130Items />
                <View style={style.container}>
                    {this.renderInput('11. *Status/Work', 'status', this.validateStatus)}
                    {this.renderTextArea('12. *Remarks', 'remarks', this.validateRemarks)}
                </View>
                <FormSplitter text="Which type of 8130-3 would you like to create?"/>
                {this.renderRadioBtns()}
                <View style={style.container}>
                    {this.render13a()}
                    {this.renderInput('13c. *Approval/Authorization Number', 'authorizationNumber', this.validateAuthorizationNumber)}
                    {!this.state.model.isApproveOrCertifyType && <View style={style.fade}/>}
                </View>
                <View style={style.container}>
                    {this.render14a()}
                    {this.renderInput('14c. *Approval/Certificate Number', 'certificateNumber', this.validateCertificateNumber)}
                    {this.state.model.isApproveOrCertifyType && <View style={style.fade}/>}
                </View>
            </View>
        );
    }
}
