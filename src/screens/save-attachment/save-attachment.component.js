import React from 'react';
import {find} from 'lodash';
import {View, Alert, TouchableOpacity, ActivityIndicator, Linking} from 'react-native';
import {Content, Text} from 'native-base';
import {CommonForm} from "../../components/common-form.component";
import {commonStyle} from "../../styles/common.style";
import {SaveAttachmentStyle as style} from './save-attachment.style'
import {FilePicker} from "../../utils/file-picker";
import BackendApi from "../../services/backend";
import {FileData} from "../../models/file-data";
import {FormButtons} from "../../components/form-buttons";
import {Tag} from "../../models/tag";
import {branch} from "baobab-react/higher-order";
import {validationErrorText} from "../../styles/Common";
import {AuthService} from "../../services/auth.service";
import properties from "../../../properties";
import {FormButton} from "../../components/form-button.component";
import {TagsSelecter} from "./tags-selecter.component";
import {TagItem} from "../../components/tag-item.component";
import {Loader} from "../../components/loader";
import {ScreenDetector} from "../../utils/screen-detector";

type Props = {
    tags: Array<Tag>;
}

@branch({
    tags: ['tags'],
})
export class AddAttachment extends CommonForm<Props> {
    id: string;
    type: string;
    callback: Function;
    attachmentId: string;
    fromArrival: boolean;

    constructor(props: Props) {
        super(props);

        const {params} = this.props.navigation.state;
        const {id, type, callback, attachmentId, fromArrival, containerReceived} = params || {};

        this.id = id;
        this.type = type;
        this.callback = callback;
        this.attachmentId = attachmentId;
        this.containerReceived = containerReceived;
        if (fromArrival) {
            this.fromArrival = fromArrival
        }

        this.state = {
            modal: false,
            loading: false,
            query: '',
            file: null,
            tags: [],
            model: {}
        };
    }

    componentDidMount() {
        BackendApi.getUserTags();

        if (this.attachmentId) {
            this.setState({loading: true}, () => {
                BackendApi.getAttachmentById(this.attachmentId)
                    .then(({data: {name, tags, description}}) => {
                        this.setState({
                            loading: false,
                            file: new FileData(null, name),
                            tags: tags,
                            model: {description}
                        });
                    });
            })
        }
    }

    closeModal() {
        this.setState({modal: false});
    }

    openModal() {
        this.setState({modal: true});
    }

    success(text) {
        Alert.alert('Success', `Attachment has been successfully ${text}`,
            [{
                text: 'OK', onPress: () => {
                    this.setState({loading: false}, () => this.props.navigation.goBack());
                }
            }]);
    }

    cancel() {
        this.props.navigation.goBack();
    }

    add() {
        const haveErr = [
            this.validateDescription(),
            this.validateFile(),
            this.validateTags(),
        ].reduce((err, val) => val ? ++err : err, 0);

        if (haveErr) {
            return null;
        }

        const {file, model: {description}, tags} = this.state;

        file.description = description;
        file.tags = tags.map(tag => tag.tagId);
        if (this.fromArrival) {
            this.setState({loading: true}, () => {
                BackendApi.uploadFile(file, this.id, this.type)
                    .then(() => {
                        if (this.callback) {
                            this.callback();
                        }
                        BackendApi.UpdateArrivalDraft(this.id, this.containerReceived);
                        BackendApi.SubmitArrivalDraft(this.id);
                        this.success('added');
                    })
                    .catch(() => this.setState({loading: false}));
            });
        } else {
            this.setState({loading: true}, () => {
                BackendApi.uploadFile(file, this.id, this.type)
                    .then(() => {
                        if (this.callback) {
                            this.callback();
                        }
                        this.success('added');
                    })
                    .catch(() => this.setState({loading: false}));
            });
        }
    }

    save() {
        const haveErr = [
            this.validateDescription(),
            this.validateFile(),
            this.validateTags(),
        ].reduce((err, val) => val ? ++err : err, 0);


        if (haveErr) {
            return null;
        }

        const {model: {description}, tags} = this.state;

        this.setState({loading: true}, () => {
            BackendApi.updateShipPartAttachment(this.attachmentId, description, tags.map(tag => tag.tagId))
                .then(() => {
                    if (this.callback) {
                        this.callback();
                    }
                    this.success('saved');
                })
                .catch(() => this.setState({loading: false}));
        });
    }

    async attachFile() {
        const file: FileData = await FilePicker.show();
        if (file) {
            this.setState({file, model: {description: file.name}}, () => {
                this.validateFile();
                this.validateDescription();
            });
        }
    }

    selectTags(ids: Array<string>) {
        const tags = this.props.tags.filter(tag => ids.indexOf(tag.tagId) > -1);
        this.setState({tags, modal: false}, () => this.validateTags());
    }

    removeTag(index) {
        const {tags} = this.state;
        tags.splice(index, 1);

        this.setState({tags});
    }

    //validations
    validateDescription() {
        return this.validateField('description', 'Description');
    }

    validateFile() {
        const hasError = !this.state.file;

        this.setState({
            fileError: hasError ? 'Please select a file to upload' : null
        });

        return hasError;
    }

    validateTags() {
        const hasError = !this.state.tags.length;

        this.setState({
            tagsError: hasError ? 'Please select at least one tag' : null
        });

        return hasError;
    }

    renderFileBtn() {
        if (this.attachmentId) {
            return null;
        }

        return (
            <View style={commonStyle.width(ScreenDetector.isPhone() ? 100 : 200)}>
                <FormButton text="Select file" onPress={() => this.attachFile()}/>
            </View>
        );
    }

    renderAddTagBtn() {
        return (
            <View style={[commonStyle.width(ScreenDetector.isPhone() ? 100 : 200), commonStyle.indent(20)]}>
                <FormButton text="Add tags" onPress={() => this.openModal()}/>
            </View>
        );
    }

    renderFile() {
        return (
            <TouchableOpacity
                actveOpacity={0.5}
                disabled={!this.attachmentId}
                onPress={() => this.openFile()}
            >
                <Text style={style.fileNameText}>{this.state.file.name}</Text>
            </TouchableOpacity>
        )
    }

    renderTags() {
        return (
            <View style={style.tags}>
                <Text style={[style.text, commonStyle.indent(20)]}>Tags</Text>
                <View style={style.tagsContainer}>
                    {this.state.tags.map(
                        (tag, index) => <TagItem
                            key={tag.tagId}
                            active
                            text={tag.name}
                            onPressRemove={() => this.removeTag(index)}
                        />
                    )}
                </View>
                {this.state.tagsError &&
                <Text style={validationErrorText} ellipsizeMode='head'>{this.state.tagsError}</Text>
                }
            </View>
        )
    }

    openFile() {
        AuthService.getToken().then(token => {
            Linking.openURL(`${properties.baseUrl}v1/attachments/${this.attachmentId}/download?token=${token}&${this.type}=${this.id}`);
        });
    }

    render() {
        const {file} = this.state;
        return (
            <View style={commonStyle.flex(1)}>
                <Loader loading={this.state.loading}/>
                <Content>
                    <View style={style.container}>
                        <Text style={[style.text, commonStyle.indent(20)]}>Please select the file you wish to
                            attach:</Text>
                        <View
                            style={[
                                file ? commonStyle.rowBetween : commonStyle.rowAround,
                                commonStyle.alignCenter
                            ]}
                        >
                            {!!file && this.renderFile()}
                            {this.renderFileBtn()}
                        </View>
                        <View style={commonStyle.indent(20)}>
                            {!!this.state.fileError &&
                            <View style={commonStyle.flex(1)}>
                                <Text style={validationErrorText} ellipsizeMode='head'>{this.state.fileError}</Text>
                            </View>
                            }
                        </View>
                        <View style={commonStyle.indent(10)}>
                            {this.renderTextArea('*Description', 'description', this.validateDescription, 3)}
                        </View>
                        <Text style={[style.text, commonStyle.indent(20)]}>
                            Please add one or more tags that describe the file.
                        </Text>
                        <View style={commonStyle.rowAround}>
                            {this.renderAddTagBtn()}
                        </View>
                        {this.renderTags()}
                        <FormButtons
                            okBtnText={this.attachmentId ? 'SAVE' : 'Add attachment'}
                            onOkPress={() => this.attachmentId ? this.save() : this.add()}
                            onCancelPress={() => this.cancel()}
                        />
                    </View>
                    {
                        this.state.modal &&
                        <TagsSelecter
                            tags={this.props.tags}
                            selectedTags={this.state.tags.map(tag => tag.tagId)}
                            closeModal={() => this.closeModal()}
                            select={selectedTags => this.selectTags(selectedTags)}
                        />
                    }
                </Content>
            </View>
        );
    }
}
