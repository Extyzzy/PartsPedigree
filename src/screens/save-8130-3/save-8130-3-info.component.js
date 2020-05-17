import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { save81303Style as style } from '../../styles/save-8130-3.style';
import { commonStyle } from "../../styles/common.style";
import { COLORS } from "../../styles/variables";
import { Event81303View } from "../../models/event81303View";

type Props = {
    event81303: Event81303View;
};

export class Save8130Info extends PureComponent<Props> {
    renderItem(title, text) {
        return (
            <View style={commonStyle.indent(10)}>
                <Text style={[style.text, commonStyle.indent(5)]}>{title}</Text>
                <Text style={style.text}>{text}</Text>
            </View>
        )
    }

    renderOrganizationInfo() {
        const { organizationAddress, organization } = this.props.event81303;

        return (
            <View>
                <Text style={[style.text, commonStyle.indent(10)]}>4. Organization Name and Address</Text>
                <View style={commonStyle.flexRow}>
                    <View style={commonStyle.flex(0.5)}>
                        <Text style={[style.text, commonStyle.color(COLORS.blue)]}>{organization && organization.name}</Text>
                    </View>
                    {
                        organizationAddress &&
                        <View style={commonStyle.flex(0.5)}>
                            <Text style={style.text}>{organizationAddress.addressLine1}</Text>
                            <Text style={style.text}>{organizationAddress.addressLine2}</Text>
                            <Text style={style.text}>
                                {organizationAddress.city}
                                {organizationAddress.postalCode && `, ${organizationAddress.postalCode }`}
                            </Text>
                            <Text style={style.text}>{organizationAddress.stateCode}</Text>
                        </View>
                    }
                </View>
            </View>
        );
    }

    render() {
        if (!this.props.event81303) {
            return null;
        }

        return (
            <View style={[style.container, style.grayBg]}>
                {this.renderItem('1. Approving Civil Aviation Authority/Country', 'FAA/UNITED STATES')}
                {this.renderItem('2. Authorized Release Certificate', 'FAA Form 8130–3, AIRWORTHINESS APPROVAL TAG')}
                {this.renderItem('3. Form Tracking Number', this.props.event81303.trackingNumber)}
                {this.renderOrganizationInfo()}
            </View>
        );
    }
}
