import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity, Image, Text, Alert, Linking} from 'react-native';
import {FormSplitter} from "../../components/form-splitter.component";
import {Attachment} from "../../models/attachment";
import {COLORS, commonStyle} from "../../styles/common.style";
import {ScreenDetector} from "../../utils/screen-detector";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {AttachmentDetail} from "../attachment-detail/attachment-detail.component";
import {events} from "../../constants/accessability";
import {formatPartDate} from "../../utils/datetime";

type Props = {
    attachments: Array<Attachment>;
    deleteAttachment: Function;
    updateAttachment: Function;
    isDetail: boolean;
    noTitle: boolean;
}

export class ArrivalAttachments extends PureComponent<Props> {
    static contextTypes = {
        getParentId: PropTypes.func,
        getNavigation: PropTypes.func,
    };

    deleteAttachment(id: string) {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete attachment?',
            [{
                text: 'Yes', onPress: () => {
                    if (this.props.deleteAttachment) {
                        this.props.deleteAttachment(id);
                    }
                }
            }, {
                text: 'No', onPress: () => {
                },
            }]
        );
    }

    pressItem(item: Attachment) {
        // const {type, id} = this.context.getParentId();

        if (this.props.isDetail) {
            this.context.getNavigation().navigate('AttachmentDetail', {attachment: item, type:'eventId', parentId: this.props.eventId});
        } else {
            this.context.getNavigation().navigate('AddAttachment', {
                attachmentId: item.attachmentId,
                callback: this.props.updateAttachment,
                type,
                id
            });
        }
    }

    renderItem(item: Attachment) {
        return (
            <View style={[commonStyle.rowBetween, style.attachment, commonStyle.marginHorizontal(-5)]}
                  key={item.attachmentId}>
                <View style={[commonStyle.flex(0.4), commonStyle.paddingHorizontal(4)]}>
                    <Text
                        accessibilityLabel={events.attachmentDescription}
                        onPress={() => this.pressItem(item)}
                        numberOfLines={1} style={[style.text, commonStyle.color(COLORS.blue)]}
                    >
                        {item.description}
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.2), commonStyle.paddingHorizontal(4)]}>
                    <Text
                        accessibilityLabel={events.tagsTitle}
                        onPress={() => this.pressItem(item)}
                        style={[style.text, commonStyle.color(COLORS.lightGreen)]}
                    >
                        {item.tags.map(t => t.name).join(", ")}
                    </Text>
                </View>
                <View style={[commonStyle.flex(0.4), commonStyle.alignEnd, commonStyle.paddingHorizontal(4)]}>
                    <Text>
                        {this.props.event ? formatPartDate(this.props.event.historicalDate) : formatPartDate(item.createdAt)}
                    </Text>
                </View>
                {/*<View style={[commonStyle.flex(0.1), commonStyle.paddingHorizontal(4)]}>*/}
                {/*{!this.props.isDetail && !!this.props.deleteAttachment &&*/}
                {/*<TouchableOpacity*/}
                {/*accessibilityLabel={events.attachmentDeleteButton}*/}
                {/*onPress={() => this.deleteAttachment(item.attachmentId)}*/}
                {/*style={commonStyle.marginHorizontal(10)}*/}
                {/*activeOpacity={0.5}*/}
                {/*>*/}
                {/*<Image*/}
                {/*style={commonStyle.size(ScreenDetector.isPhone() ? 15 : 30)}*/}
                {/*source={require('../../assets/icons/delete_photo_icon.png')}*/}
                {/*/>*/}
                {/*</TouchableOpacity>*/}
                {/*}*/}
                {/*</View>*/}
            </View>
        )
    }

    render() {
        if (!this.props.attachments || !this.props.attachments.length) {
            return null;
        }

        return (
            <View>
                {!this.props.noTitle &&
                <FormSplitter text="ATTACHMENTS"/>
                }
                <View style={[commonStyle.rowBetween, style.attachment, commonStyle.marginHorizontal(-5)]}>
                    <View style={[commonStyle.flex(0.4), commonStyle.paddingHorizontal(4)]}>
                        <Text
                            accessibilityLabel={events.attachmentDescription}
                            numberOfLines={1} style={[style.text, commonStyle.textBold]}
                        >
                            {events.attachments}
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.2), commonStyle.paddingHorizontal(4)]}>
                        <Text
                            accessibilityLabel={events.tagsTitle}
                            onPress={() => this.pressItem(item)}
                            style={[style.text, commonStyle.textBold]}
                        >
                            {events.tags}
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.3), commonStyle.paddingHorizontal(4)]}>
                        <Text style={[style.text, commonStyle.textBold]}>
                            Image Date
                        </Text>
                    </View>
                </View>
                {this.props.attachments.map(attachment => this.renderItem(attachment))}
            </View>
        );
    }
}
