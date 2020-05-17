import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import React, {Component} from 'react';
import {commonStyle, COLORS} from "../../styles/common.style";
import {ScreenDetector} from "../../utils/screen-detector";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {branch} from "baobab-react/higher-order";
import TextInputValid from "../../components/TextInputValid";
import {CommonForm} from "../../components/common-form.component";
import BackendApi from "../../services/backend";
import {FormSplitter} from "../../components/form-splitter.component";
import Moment from "moment/moment";
import {DateTimePicker} from "../../components/datetime-picker/datetime-picker.component";
import {Textarea} from 'native-base';
import {ShipPartItemView} from "../../models/ship-part-item-view";
import {CrossBtn} from "../../components/cross-btn.component";

@branch({
    user: ['user'],
    poNumber: ['poNumber']
})
export class CofC extends CommonForm<Props> {
    constructor(props) {
        super(props);
        this.state = {
            model: {
                poNumber: this.props.poNumber
            }
        };
    }

    componentDidMount() {
        if (this.props.navigation.state.params) {
            BackendApi.getOrganizationForCofC(this.props.navigation.state.params.orgId);
        }
    }

    renderInput(title, field) {
        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    {title}
                </Text>
                <TextInputValid
                    style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                    onChangeText={value => this.setValue(field, value, true)}
                    value={this.state.model[field]}
                />
            </View>
        )
    }

    renderTelephone(title, field) {
        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    {title}
                </Text>
                <TextInputValid
                    style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                    onChangeText={value => this.setValue(field, value, true)}
                    value={this.state.model[field]}
                    keyboardType={'numeric'}
                />
            </View>
        )
    }

    renderField(title: string, text: string) {
        if (!title || !text) {
            return null;
        }

        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    accessibilityLabel={title + " label"}
                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    {title}:
                </Text>
                <Text
                    accessibilityLabel={title}
                    style={style.text}>
                    {text}
                </Text>
            </View>
        );
    }

    renderDate() {
        const {ready} = this.state.model;

        return (
            <View style={commonStyle.indent(10)}>
                <View style={[commonStyle.rowBetween, {alignItems: 'center'}]}>
                    <Text
                        style={[commonStyle.inputLabel, commonStyle.textBold]}>
                        * Release Date:
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
                    <Text style={style.text}>
                        {+ready ? Moment(new Date(+ready)).format('DD/MMM/YY HH[h]mm') : ''}
                    </Text>
                </View>
            </View>
        );
    }

    renderTextArea(title, field, rowSpan = 5) {
        return (
            <View style={commonStyle.indent()}>
                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    {title}
                </Text>
                <Textarea
                    style={commonStyle.textarea}
                    rowSpan={rowSpan}
                    value={this.state.model[field]}
                    autoCapitalize="sentences"
                    maxLength={200}
                    onChangeText={value => this.setValue(field, value, true)}
                />
            </View>
        )
    }

    renderHeader() {
        return (
            <View style={style.formContainer}>
                <View
                    style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                    <Text style={[style.textTitle, commonStyle.indent(10)]}>
                        FROM COMPANY:
                    </Text>
                    <Text style={[style.textTitle, commonStyle.color(COLORS.blue), commonStyle.indent(10)]}>
                        {this.props.user.organization}
                    </Text>
                    {this.renderField('Company address:', 'to_company_address')}
                    {this.renderField('Town/City:', 'to_Town/City:')}
                    {this.renderField('POSTAL_CODE', 'to_POSTAL_CODE')}
                    {this.renderField('STATE:', 'to_STATE:')}
                    {this.renderField('COUNTRY', 'to_COUNTRY')}
                    {this.renderTelephone('TELEPHONE', 'to_TELEPHONE')}
                    {this.renderInput('COMPANY_WEBSITE', 'to_COMPANY_WEBSITE')}
                    {this.renderField('CAGE_CODE', 'to_CAGE_CODE')}
                </View>
                <View
                    style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                    <Text style={[style.textTitle, commonStyle.indent(10)]}>
                        TO COMPANY:
                    </Text>
                    <Text style={[style.textTitle, commonStyle.color(COLORS.blue), commonStyle.indent(10)]}>
                        {this.props.navigation.state.params && this.props.navigation.state.params.orgName}
                    </Text>
                    {this.renderField('Company address:', 'from_company_address')}
                    {this.renderField('Town/City:', 'from_Town/City:')}
                    {this.renderField('POSTAL_CODE', 'from_POSTAL_CODE')}
                    {this.renderField('STATE:', 'from_STATE:')}
                    {this.renderField('COUNTRY', 'from_COUNTRY')}
                    {this.renderTelephone('TELEPHONE', 'from_TELEPHONE')}
                </View>
            </View>
        )
    }

    renderCofC() {
        return (
            <View
                style={[style.formContainer,
                    {marginTop: 10},
                    commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                    {this.renderDate()}
                    {this.renderField('PO Number', this.props.poNumber)}
                </View>
                <View
                    style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15), {marginTop: 6}]}>
                    {this.renderInput('Sales Order', 'SALES_ORDER')}
                    {this.renderInput('Sales Line', 'SALES_LINE')}
                </View>
            </View>
        )
    }

    renderFooter() {
        return (
            <View style={[{
                padding: ScreenDetector.isPhone() ? 5 : 15,
                marginTop: 10
            }, commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                <View
                    style={[commonStyle.flex(1), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 10 : 20)]}>
                    {this.renderTextArea('Remarks', 'remarks')}
                </View>
                <View
                    style={[commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15), {
                        display: 'flex',
                        flexDirection: 'row'
                    }]}>
                    <View
                        style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                        {this.renderField('Approver', 'approver')}
                    </View>
                    <View
                        style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 5 : 15)]}>
                        {this.renderField('Approval numbers', 'approval_numbers')}
                    </View>
                </View>
                <View
                    style={[commonStyle.flex(1), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 10 : 30)]}>
                    {this.renderField('Conformity Statement', 'conformity_statement')}
                </View>
            </View>
        )
    }

    renderItemHeader() {
        return (
            <View style={[style.table, style.tableHeader]}>
                <View style={[commonStyle.flex(0.05), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}>#</Text>
                </View>
                <View style={[commonStyle.flex(0.2), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}>PART #</Text>
                </View>
                <View style={[commonStyle.flex(0.3), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}>PART
                        NAME</Text>
                </View>
                <View style={[commonStyle.flex(0.13), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}>QTY</Text>
                </View>
                <View style={[commonStyle.flex(0.13), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}>UOM</Text>
                </View>
            </View>
        )
    }
    pressItem(item: ShipPartItemView, showAttaches = false){
        const {shipItemId, eventDraftId} = item;
        this.props.navigation.navigate('CofCItem', {shipItemId, eventDraftId, showAttaches, item});
    };

    renderItem(item: ShipPartItemView, index: number) {
        const {partMaster} = item;
        return (
            <View style={style.table} key={item.shipItemId}>
                <View style={[commonStyle.flex(0.05), style.tableItem]}>
                    <Text
                        onPress={()=>this.pressItem(item)}
                        numberOfLines={1} style={[style.text, commonStyle.color(COLORS.blue)]}
                    >{++index}</Text>
                </View>
                <View style={[commonStyle.flex(0.2), style.tableItem]}>
                    <Text
                        onPress={()=>this.pressItem(item)}
                        numberOfLines={1}
                        style={[style.text, commonStyle.color(COLORS.blue)]}
                    >
                        {!!partMaster && partMaster.mpn}
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.3), style.tableItem]}>
                    <Text numberOfLines={1} style={style.text}>{!!partMaster && partMaster.partName}</Text>
                </View>
                <View style={[commonStyle.flex(0.30), style.tableItem, {marginLeft: 90}]}>
                    <Text numberOfLines={1} style={style.text}>{item.quantity}</Text>
                </View>
                <View style={[commonStyle.flex(0.30), style.tableItem]}>
                    <Text numberOfLines={1}
                          style={style.text}>{!!partMaster && !!partMaster.uom && partMaster.uom.name}</Text>
                </View>
                {this.props.receive ?
                    <View style={[commonStyle.flex(0.10), style.tableItem]}>
                        {this.renderCheckBox(item.partInstance && item.partInstance.partInstanceId)}
                    </View> : null}
                <View style={[commonStyle.flex(0.10), style.tableItem]}>
                    <View style={[commonStyle.flexRow, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                        {item.hasAttachments && this.props.paperClip ?
                            <TouchableOpacity
                                onPress={() => this.pressItem(item, true)}
                                style={commonStyle.marginHorizontal(25)}
                                activeOpacity={0.5}
                            >
                                <Image
                                    style={ScreenDetector.isPhone() ? commonStyle.size(15, 16) : commonStyle.size(30, 32)}
                                    source={require('../../assets/icons/paperclip_gray_icon.png')}
                                />
                            </TouchableOpacity> :
                            null
                        }
                        {!this.props.detail &&
                        <CrossBtn onPress={() => this.deleteItem(item.shipItemId)}/>
                        }
                    </View>
                </View>
            </View>
        );
    }

    renderCofCItems() {
        return (
            <View>
                <FormSplitter text={'Certificate of Conformity Items'}/>
                {this.renderItemHeader()}
                {!!this.props.navigation.state.params && this.props.navigation.state.params.items.map((item, index) => this.renderItem(item, index))}
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={{display: 'flex', flexDirection: 'column'}}>
                <View>
                    <FormSplitter
                        text={`CERTIFICATE OF CONFORMITY ID: 1`
                        }
                        additionalText={'31.07.2019'}/>
                </View>
                {this.renderHeader()}
                <View>
                    <FormSplitter
                        text={`CERTIFICATE OF CONFORMITY DETAILS: `}/>
                </View>
                {this.renderCofC()}
                {this.renderCofCItems()}
                {this.renderFooter()}
            </ScrollView>
        )
    }
}