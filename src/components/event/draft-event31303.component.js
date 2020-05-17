import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { eventStyle as style } from './event.style';
import { commonStyle } from "../../styles/common.style";
import { CreatedDate } from "../created-date.component";
import { InteractionPanel } from "../interaction-buttons";
import { VerificationKey } from "../verification-key.component";
import { ShipPartView } from "../../models/ship-part-view";
import { COLORS } from "../../styles/variables";
import { ReceiveParts } from "../../screens/receive-parts/receive-parts.component";
import { Event81303ItemView } from "../../models/event81303ItemView";
import { Save8130Screen } from "../../screens/save-8130-3/save-8130-3.component";
import { events } from "../../constants/accessability";
import { ScreenDetector } from "../../utils/screen-detector";

type Props = {
    event: Event81303ItemView;
}

export class DraftEvent31303 extends PureComponent<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    onPressDraft() {
        const { event81303DraftId } = this.props.event;
        this.context.getNavigation().navigate('Save8130Screen', { event81303DraftId });
    }

    renderKey() {
        return <VerificationKey/>
    }

    renderInterActionPanel() {
        return (
            <InteractionPanel onPressViewMore={() => this.onPressDraft()} />
        );
    }

    render() {
        if (!this.props.event) {
            return null;
        }

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onPressDraft()}
                style={[style.container, style.grayBg]}
            >
                <View style={[commonStyle.rowBetween, commonStyle.indent(ScreenDetector.isPhone() ? 5 : 15)]}>
                    <Text
                        style={commonStyle.textBold}
                        accessibilityLabel={events.event81303Name}>
                        EVENT: 8130-3
                    </Text>
                    <Text
                        style={[commonStyle.textBold, commonStyle.color(COLORS.red)]}
                        accessibilityLabel={events.draftLabel}>
                        ---DRAFT---
                    </Text>
                </View>
                <View style={commonStyle.indent(10)}>
                    {this.renderKey()}
                </View>
                <View style={[commonStyle.flexRow, commonStyle.justifyEnd]}>
                    {this.renderInterActionPanel()}
                </View>
            </TouchableOpacity>
        )
    }
}
