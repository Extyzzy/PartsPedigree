import React, { Component } from 'react';
import Moment from 'moment';
import { View, Text, Linking } from 'react-native';
import { Content } from 'native-base';
import properties from '../../../properties';
import { Attachment } from "../../models/attachment";
import { attachmentDetailstyle as style } from './attachment-detail.style';
import { AuthService } from "../../services/auth.service";
import { commonStyle } from "../../styles/common.style";
import { Tag } from "../../models/tag";
import { TagItem } from "../../components/tag-item.component";
import { FormButton } from "../../components/form-button.component";
import { events } from "../../constants/accessability";
import { ScreenDetector } from "../../utils/screen-detector";
import { COLORS } from "../../styles/variables";

export class AttachmentDetail extends Component {
    attachment: Attachment;
    type: string;
    parentId: string;

    constructor(props) {
        super(props);
        const { attachment, type, parentId } = this.props.navigation.state.params;

        this.attachment = attachment;
        this.type = type;
        this.parentId = parentId;
    }

    openAttachment() {
        AuthService.getToken().then(token => {
            Linking.openURL(`${properties.baseUrl}v1/attachments/${this.attachment.attachmentId}/download?token=${token}&${this.type}=${this.parentId}`);
        });
    }

    renderTags() {
        if (!this.attachment.tags || !this.attachment.tags.length) {
            return null;
        }

        return (
            <View>
                <Text style={style.title} accessibilityLabel={events.tagsTitle}>Tags:</Text>
                <View style={style.tagContainer}>
                    {this.attachment.tags.map((tag: Tag) => (
                        <TagItem key={tag.tagId} active text={tag.name}/>
                    ))}
                </View>
            </View>
        )
    }

    render() {
        if (!this.attachment) {
            return null;
        }

        const { user, description, name, type, size, createdAt, organization } = this.attachment;

        return (
            <Content>
                <View style={style.container}>
                    <View style={[commonStyle.rowBetween, commonStyle.alignCenter, commonStyle.indent(20)]}>
                        <Text
                            style={style.nameText}
                            accessibilityLabel={events.attachmentDescription}>
                            {description}
                        </Text>
                        <View style={commonStyle.width(ScreenDetector ? 100 : 200)}>
                            <FormButton text="View" onPress={() => this.openAttachment()}/>
                        </View>
                    </View>

                    <Text style={style.text} accessibilityLabel={events.attachmentFilename}>Filename: {name}</Text>
                    <Text style={style.text} accessibilityLabel={events.attachmentFileType}>File type: {type}</Text>
                    <Text style={[style.text, commonStyle.indent()]} accessibilityLabel={events.attachmentFileSize}>
                        File size: {(size / 1024).toFixed(2)} KB
                    </Text>

                    <Text style={style.text} accessibilityLabel={events.attachmentDate}>
                        Uploaded on: {Moment(new Date(createdAt)).format('DD MMM YY HH[h]mm')}
                    </Text>
                    {!!user &&
                    <Text style={style.text} accessibilityLabel={events.attachmentUploadedBy}>
                        By: <Text style={commonStyle.color(COLORS.blue)}>{user.firstName} {user.lastName} </Text>
                        from <Text style={commonStyle.color(COLORS.blue)}>{organization && organization.name}</Text>
                    </Text>
                    }
                    <View style={commonStyle.indent(20)}/>
                    {this.renderTags()}
                </View>
            </Content>
        );
    }
}
