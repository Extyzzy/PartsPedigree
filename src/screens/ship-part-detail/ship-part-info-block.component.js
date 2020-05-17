import React, { PureComponent } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { formatPartDate } from "../../utils/datetime";
import { ScreenDetector } from "../../utils/screen-detector";
import { COLORS, commonStyle } from "../../styles/common.style";
import { partEventsStyle as style } from "../../styles/part-event.style";
import { ShipPartEvent } from "../../models/ship-part-event";
import { OrganizationAddress } from "../../models/organization-address";
import { ShipPartItem } from "../../models/ship-part-item";
import { User } from "../../models/user";
import { EmailLink } from "../../components/email-link.component";
import { ReceivePartView } from "../../models/receive-part-view";
import {general, shipParts} from "../../constants/accessability";

type Props = {
    partEvent: ShipPartEvent | ReceivePartView;
    users?: Array<User>;
}

export class ShipPartInfoBlock extends PureComponent<Props> {
    state = {
      viewAllListEmail: false,
    };

    renderBlueText(text: string) {
        return (
            <Text style={[style.textTitle, commonStyle.indent(10)]}>
                {text}
            </Text>
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

    renderPoNumbers(items: Array<ShipPartItem>) {
        if (!items || !items.length) {
            return null;
        }

        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    accessibilityLabel={shipParts.pONumbersLabel}
                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                    P.O. Numbers:
                </Text>
                <Text
                    accessibilityLabel={shipParts.pONumbersValue}
                    style={style.text}>
                    {items.map(item => `${item.poNumber}\n`)}
                </Text>
            </View>
        );
    }

    renderAddress(organizationAddress: OrganizationAddress) {
        if (!organizationAddress) {
            return null;
        }

        return (
            <View style={commonStyle.indent(10)}>
                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}
                      accessibilityLabel={shipParts.addressLabel}>Address</Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressLine1Value}>
                    {organizationAddress.addressLine1}</Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressLine2Value}>
                    {organizationAddress.addressLine2}</Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressCityAndPostalCodeValue}>
                    {organizationAddress.city}
                    {organizationAddress.postalCode && `, ${organizationAddress.postalCode }`}
                </Text>
                <Text style={style.text} accessibilityLabel={shipParts.addressStateCodeValue}>
                    {organizationAddress.stateCode}</Text>
            </View>
        );
    }

    renderSharedUsers() {

        if (!this.props.users) {
            return null;
        }

      const {viewAllListEmail} = this.state;

      let text = viewAllListEmail ? 'Hide users <' : 'Show users >';
      return (
            <View>
                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>SHARED WITH</Text>

                <TouchableOpacity
                  style={{marginBottom: 5}}
                  activeOpacity={0.5}
                  onPress={() => this.setState({viewAllListEmail: !viewAllListEmail})}
                  accessibilityLabel={general.viewMoreButton}
                >
                  <Text style={style.text}>{text}</Text>
                </TouchableOpacity>

                { viewAllListEmail && this.props.users.map(user => (
                    <Text key={user.username} style={[style.text, commonStyle.indent(5)]}>
                        {`${user.firstName} ${user.lastName}, ${user.organization || 'N/A'}, `}
                        <EmailLink style={commonStyle.color(COLORS.blue)} email={user.email}/>
                    </Text>
                ))
                }
            </View>
        );
    }

    render() {
        const { partEvent } = this.props;
        return (
                <View
                    style={[commonStyle.flexRow, commonStyle.marginHorizontal(ScreenDetector.isPhone() ? -10 : -20)]}>
                    <View
                        style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 10 : 20)]}>
                        <Text
                            accessibilityLabel={shipParts.fromOrgLabel}
                            style={[style.textTitle, commonStyle.indent(10)]}>
                            FROM:
                        </Text>
                        {this.renderBlueText(partEvent.fromOrganization && partEvent.fromOrganization.name)}
                        {this.renderField('Shipment #', partEvent.shipment)}
                            <View style={commonStyle.indent(10)}>
                                <Text
                                    style={[commonStyle.inputLabel, commonStyle.textBold]}>
                                    Creation Date:
                                </Text>
                                <Text
                                    style={style.text}>
                                    {this.props.event ? formatPartDate(this.props.event.historicalDate) : 'N/A'}
                                </Text>
                            </View>
                        {this.renderField('Carrier', partEvent.carrier)}
                        {this.renderField('Ready', formatPartDate(partEvent.ready))}
                        {this.renderField('Container Count', partEvent.containerCount)}
                        {this.renderField('Total Weight', partEvent.totalWeight ? partEvent.totalWeight  + ' ' + partEvent.weightUOM.name : partEvent.totalWeight.toFixed(2) + ' ' + partEvent.weightUOM.name)}
                    </View>
                    <View
                        style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(ScreenDetector.isPhone() ? 10 : 20)]}>
                        <Text
                            accessibilityLabel={shipParts.toOrgLabel}
                            style={[style.textTitle, commonStyle.indent(10)]}>
                            TO:
                        </Text>
                        {this.renderBlueText(partEvent.toOrganization && partEvent.toOrganization.name)}
                        {this.renderAddress(partEvent.toOrganization && partEvent.toOrganization.organizationAddress)}
                        {this.renderPoNumbers(partEvent.items)}
                        {this.renderField('Total Value',Number.isInteger(partEvent.totalValue ) ? (partEvent.totalValue / 100 + ' ' + partEvent.valueUOM.name) : (partEvent.totalValue / 100).toFixed(2) + ' ' + partEvent.valueUOM.name)}
                        {this.renderSharedUsers()}
                    </View>
                </View>
        );
    }
}
