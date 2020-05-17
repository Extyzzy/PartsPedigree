import React, { Component } from 'react';
import { Content } from 'native-base';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { commonStyle } from "../../styles/common.style";
import { SaveAttachmentStyle as style } from './save-attachment.style';
import { Tag } from "../../models/tag";
import { TagItem } from "../../components/tag-item.component";

type Props = {
    closeModal: Function;
    tags: Array<Tag>;
    selectedTags: Array<string>;
    select: Function;
}

export class TagsSelecter extends Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedTags: props.selectedTags ? [...props.selectedTags]: []
        }
    }

    renderTitle() {
        return (
            <View style={commonStyle.indent(15)}>
                <Text style={style.modalTitle}>Tags</Text>
                <View style={commonStyle.line}/>
            </View>
        )
    }

    renderButtons() {
        return (
            <View style={style.modalBtnsContainer}>
                <View style={[commonStyle.line, commonStyle.indent(15)]}/>
                <View style={commonStyle.rowBetween}>
                    <View style={commonStyle.width(50)}/>
                    <TouchableOpacity
                        onPress={() => this.props.select && this.props.select(this.state.selectedTags)}
                    >
                        <Text style={style.modalOkBtnText}>OK</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.props.closeModal}
                    >
                        <Text style={style.modalCancelBtnText}>cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderTagsList() {
        return (
            <View style={style.tagsContainer}>
                {!!this.props.tags &&
                this.props.tags.map(tag =>
                    <TagItem
                        active={this.state.selectedTags.indexOf(tag.tagId) > -1}
                        onPress={() => this.onPressTag(tag)}
                        text={tag.name}
                        key={tag.tagId}
                    />)
                }
            </View>
        )
    }

    onPressTag(tag: Tag) {
        const { selectedTags } = this.state;
        const index = selectedTags.indexOf(tag.tagId);
        if (index > -1) {
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(tag.tagId);
        }

        this.setState({ selectedTags });
    }

    render() {
        return (
            <Modal
                visible={true}
                onRequestClose={this.props.closeModal}
                transparent
            >
                <View style={commonStyle.modal}>
                    <View style={commonStyle.modalContainer}>
                        {this.renderTitle()}
                        <Content>
                            {this.renderTagsList()}
                        </Content>
                        {this.renderButtons()}
                    </View>
                </View>
            </Modal>
        )
    }
}
