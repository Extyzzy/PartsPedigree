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
import { events } from "../../constants/accessability";
import { ScreenDetector } from "../../utils/screen-detector";

type Props = {
    event: ShipPartView;
}

export class DraftEvent extends PureComponent<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    onPressDraft() {
        const { eventDraftId, eventTypeId } = this.props.event;

        let screen;
        switch (eventTypeId)  {
            case 7:
                screen = 'ShipParts';
                break;
            case 8:
                screen = 'ReceiveParts';
                break;
            case 10:
                screen = 'SaveAttachmentEvent';
                break;
            default:
                screen = 'ShipParts';
        }

        this.context.getNavigation().navigate(screen, { eventDraftId });
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

        const { event } = this.props;

        let eventName;
        switch (event.eventTypeId)  {
            case 7:
                eventName = 'SHIP PARTS';
                break;
            case 8:
                eventName = 'RECEIVE PARTS';
                break;
            case 10:
                eventName = 'ATTACHMENTS';
                break;
            default:
                eventName = 'SHIP PARTS';
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
                        accessibilityLabel={eventName}>
                        {eventName}
                    </Text>
                    <Text
                        style={[commonStyle.textBold, commonStyle.color(COLORS.red)]}
                        accessibilityLabel={events.draftLabel}>
                        ---DRAFT---
                    </Text>
                  {
                    (this.props.event.createdAt !== '-1' &&(
                      <CreatedDate date={this.props.event.createdAt}/>
                    )) || (
                      <View />
                    )
                  }

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
