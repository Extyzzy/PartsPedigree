import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { detail81303Style as style } from './detail-8130-3.style';
import { commonStyle } from "../../styles/common.style";
import { Event81303View } from "../../models/event81303View";
import { Event81303ItemView } from "../../models/event81303ItemView";
import { User } from "../../models/user";

type Props = {
    event81303: Event81303View;
    user: User;
}

export class Detail81303Info extends PureComponent<Props> {
    renderItem(title, text) {
        return (
            <View style={commonStyle.indent()}>
                <Text style={[style.text, commonStyle.textBold, commonStyle.indent(3)]}>{title}:</Text>
                <Text style={style.text}>{text}</Text>
            </View>
        );
    }

    renderAddress() {
        const { organizationAddress } = this.props.event81303;
        return (
            <View style={commonStyle.indent()}>
                <Text style={[style.text, commonStyle.textBold]}>4b. Organization Address:</Text>
                {
                    organizationAddress &&
                    <Text style={style.text}>
                        {organizationAddress.addressLine1}
                        {organizationAddress.addressLine2}
                        {organizationAddress.city}
                        {organizationAddress.postalCode}
                        {organizationAddress.stateCode}
                    </Text>
                }
            </View>
        );
    }

    renderItemsTitles() {
        return (
            <View style={[commonStyle.flexRow, commonStyle.marginHorizontal(-3), commonStyle.indent()]}>
                <View style={[commonStyle.flex(0.15), commonStyle.paddingHorizontal(3)]}>
                    <Text style={[style.text, commonStyle.textBold]} numberOfLines={1}>6.Item</Text>
                </View>
                <View style={[commonStyle.flex(0.25), commonStyle.paddingHorizontal(3)]}>
                    <Text style={[style.text, commonStyle.textBold]} numberOfLines={1}>7.Description</Text>
                </View>
                <View style={[commonStyle.flex(0.25), commonStyle.paddingHorizontal(3)]}>
                    <Text style={[style.text, commonStyle.textBold]} numberOfLines={1}>8.Part Number</Text>
                </View>
                <View style={[commonStyle.flex(0.15), commonStyle.paddingHorizontal(3)]}>
                    <Text style={[style.text, commonStyle.textBold]} numberOfLines={1}>9.Qty</Text>
                </View>
                <View style={[commonStyle.flex(0.2), commonStyle.paddingHorizontal(3)]}>
                    <Text style={[style.text, commonStyle.textBold]} numberOfLines={1}>10.Serial Number</Text>
                </View>
            </View>
        );
    }

    render81303Item(item: Event81303ItemView, index: number) {
        return (
            <View
                style={[commonStyle.flexRow, commonStyle.marginHorizontal(-3), commonStyle.indent()]}
                key={item.event81303ItemId}
            >
                <View style={[commonStyle.flex(0.15), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{index + 1}</Text>
                </View>
                <View style={[commonStyle.flex(0.25), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.name}</Text>
                </View>
                <View style={[commonStyle.flex(0.25), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.partMaster.mpn}</Text>
                </View>
                <View style={[commonStyle.flex(0.15), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.quantity}</Text>
                </View>
                <View style={[commonStyle.flex(0.2), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.serialNumber}</Text>
                </View>
            </View>
        );
    }

    render13point() {
        return (
            <View>
                {this.renderItem(
                    '13a. Certifies the items identified above were manufactured in conformity to',
                    this.props.event81303.itemsApproved ? 'Approved design data and are in condition for safe operation.' :
                        'Non-Approved design data specified in Block 12.'
                )}
                {this.renderItem('13c. Approval/Authorization Number', this.props.event81303.authorizationNumber)}
                {this.renderItem('13d. Name (Typed or Printed)', this.getUserInfo())}
            </View>
        );
    }

    render14point() {
        return (
            <View>
                {this.renderItem(
                    '14a.',
                    this.props.event81303.itemsApproved ? '14 CFR 43.9 Return to Service.' :
                        'Other regulation specified in Block 12.'
                )}
                {this.renderItem('14c. Approval/Certificate Number', this.props.event81303.certificateNumber)}
                {this.renderItem('14d. Name (Typed or Printed)', this.getUserInfo())}
            </View>
        );
    }

    getUserInfo() {
        return `Signed User: ${this.props.user.firstName} ${this.props.user.lastName} (${this.props.user.email})`
    }

    render() {
        return (
            <View style={style.container}>
                {this.renderItem('1. Approving Civil Aviation Authority/Country', 'FAA/UNITED STATES')}
                {this.renderItem('2. Authorized Release Certificate', 'FAA Form 8130–3, AIRWORTHINESS APPROVAL TAG')}
                {this.renderItem('3. Form Tracking Number', this.props.event81303.trackingNumber)}
                {this.renderItem('4a. Organization Name', this.props.event81303.organization && this.props.event81303.organization.name)}
                {this.renderAddress()}
                {this.renderItem('5. Work Order/Contract/Invoice Number', this.props.event81303.orderNumber)}
                {this.renderItemsTitles()}
                {this.props.event81303.items.map((item, index) => this.render81303Item(item, index))}
                {this.renderItem('11. Status/Work', this.props.event81303.status)}
                {this.renderItem('12. Remarks', this.props.event81303.remarks)}
                {
                    this.props.event81303.isApproveOrCertifyType ?
                        this.render13point() : this.render14point()
                }
            </View>
        );
    }
}
