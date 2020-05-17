import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {branch} from "baobab-react/higher-order";
import {View, Alert, ActivityIndicator, Image, TouchableOpacity, Text} from 'react-native';
import {Content} from 'native-base';
import {saveAttachmentsEventStyle as style} from './save-attachments-event.style';
import {FormSplitter} from "../../components/form-splitter.component";
import {FormButton} from "../../components/form-button.component";
import {commonStyle} from "../../styles/common.style";
import BackendApi from "../../services/backend";
import {Attachment} from "../../models/attachment";
import {ShipPartsAttachments} from "../ship-parts/ship-part-attachments.component";
import {AttachmentEvent} from "../../models/attachment-event";
import {ScreenDetector} from "../../utils/screen-detector";
import {validationErrorText} from "../../styles/Common";
import Moment from "moment/moment";

type Props = {
    attachmentEvent: AttachmentEvent;
    attachmentEventAttachments: Array<Attachment>;
    updateTimeLine: Function;
};

@branch({
    attachmentEvent: ['attachmentEvent'],
    attachmentEventAttachments: ['attachmentEventAttachments'],
})
export class SaveAttachmentEvent extends Component<Props> {
    static childContextTypes = {
        getParentId: PropTypes.func,
    };

    partMasterId: string;
    partInstanceId: string;
    eventDraftId: string;
    updateTimeLine: Function;

    constructor(props) {
        super(props);
        this.state = {
            draft: false,
            formChanged: false,
            initialAttachmentEventAttachments: JSON.parse(JSON.stringify({ ...this.props.attachmentEventAttachments})),
        };
        this.formChanged = this.formChanged.bind(this);

        this.goBack = props.navigation.goBack;

        props.navigation.goBack = () => {
            this.cancel();
        };

        const {partMasterId, partInstanceId, eventDraftId, updateTimeLine} = this.props.navigation.state.params;

        this.partInstanceId = partInstanceId;
        this.partMasterId = partMasterId;
        this.eventDraftId = eventDraftId;
        this.updateTimeLine = updateTimeLine;
    }

    getChildContext() {
        return {
            getParentId: () => ({type: 'eventDraftId', id: this.props.attachmentEvent.eventDraftId}),
        };
    }

    componentDidMount() {
        if (this.eventDraftId) {
            BackendApi.getAttachmentEventDraft(this.eventDraftId);
            BackendApi.getAttachmentEventAttachments(this.eventDraftId).then((attachments) => {
                this.setState({initialAttachmentEventAttachments:JSON.parse(JSON.stringify({ ...attachments})) })
            });
        } else {
            const {partMasterId, partInstanceId} = this;
            BackendApi.createAttachmentEventDraft({partMasterId, partInstanceId})
                .then(() => this.updateTimeLine && this.updateTimeLine());
        }
    }

    componentWillReceiveProps(nextProps) {
        const {attachmentEventAttachments} = this.props;
        const lng = attachmentEventAttachments ? attachmentEventAttachments.length : 0;

        if (nextProps.attachmentEventAttachments && nextProps.attachmentEventAttachments.length > lng) {
            this.setState({attachmentsError: null});
        }
    }

    validateAttachments() {
        const {attachmentEventAttachments} = this.props;

        if (!attachmentEventAttachments || !attachmentEventAttachments.length) {
            this.setState({attachmentsError: 'Please select at least one attachment'});
            return false;
        }

        this.setState({attachmentsError: null});
        return true;
    }

    formChanged() {
        let result = Object.keys(this.state.initialAttachmentEventAttachments).map((key) =>  {
            return this.state.initialAttachmentEventAttachments[key];
        });
        return JSON.stringify(result) !== JSON.stringify(this.props.attachmentEventAttachments)
    }

    updateAttachment() {
        BackendApi.getAttachmentEventAttachments(this.props.attachmentEvent.eventDraftId);
    }

    deleteAttachment(id) {
        BackendApi.deleteAttachmentEventAttachments(id);
    }

    submit() {
        if (this.validateAttachments()) {
            BackendApi.submitAttachmentEventDraft(this.props.attachmentEvent.eventDraftId)
                .then(() => {
                    Alert.alert('Success', 'Attachment Event Draft was successfully submitted',
                        [{
                            text: 'OK', onPress: () => {
                                this._updateTimeLine();
                                this.goBack();
                            }
                        }]);
                });
        }
    }

    cancel() {

        if (this.state.draft) {
            BackendApi.getDrafts().then(() => {
                this._updateTimeLine();
                this.goBack();
            })
        } else {
            if ( this.formChanged()) {
                Alert.alert(
                    'Cancel Confirmation',
                    'Are you sure to leave the screen without submitting? Attachment event will not be saved',
                    [{
                        text: 'Yes', onPress: () => {
                            BackendApi.deleteAttachmentEvent(this.props.attachmentEvent.eventDraftId).then(() => {
                                BackendApi.getDrafts().then(() => {
                                    this._updateTimeLine();
                                    this.goBack();
                                })
                            })
                        },
                    }, {
                        text: 'No', onPress: () => {
                        },
                    }]
                );
            } else {
                BackendApi.getDrafts().then(() => {
                    this._updateTimeLine();
                    this.goBack();
                })
            }

        }
    }

    attachFile() {
        const {eventDraftId} = this.props.attachmentEvent;

        this.props.navigation.navigate('AddAttachment', {
            id: eventDraftId,
            type: 'event',
            callback: () => this.updateAttachment(),
        });
    }

    save() {
        this.setState({
            draft: true
        });
        const {eventDraftId} = this.props.attachmentEvent;
        let historicalDate = Moment().format();
        const timestamp = Moment(historicalDate).format('x');
        BackendApi.updateAttachmentEventDraft(eventDraftId, {historicalDate: timestamp})
        if (this.validateAttachments()) {
            Alert.alert('Success', 'Attachment Event Draft was successfully saved');
        }
    }

    _updateTimeLine() {
        if (this.updateTimeLine) {
            this.updateTimeLine();
        } else {
            BackendApi.refreshPartMasterTimeLine();
            BackendApi.refreshPartInstanceTimeLine();
        }
    }

    deleteDraft() {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete Attachment Event Draft?',
            [{
                text: 'Yes', onPress: () =>
                    BackendApi.deleteAttachmentEvent(this.props.attachmentEvent.eventDraftId).then(() => {
                        BackendApi.getDrafts().then(() => {
                            this._updateTimeLine();
                            this.goBack();
                        })
                    })
            }, {
                text: 'No', onPress: () => {
                },
            }]
        );
    }

    renderBtns() {
        return (
            <View style={[commonStyle.flexRow, commonStyle.indent(15), commonStyle.paddingHorizontal(5)]}>
                <View style={[commonStyle.flex(0.25), commonStyle.paddingHorizontal(5)]}>
                    <FormButton text="Save Draft" onPress={() => this.save()}/>
                </View>
                <View style={[commonStyle.flex(0.15), commonStyle.paddingHorizontal(5)]}>
                    <FormButton onPress={() => this.deleteDraft()}>
                        <Image
                            style={ScreenDetector.isPhone() && commonStyle.size(15, 18)}
                            source={require('../../assets/icons/trash_icon.png')}
                        />
                    </FormButton>
                </View>
                <View style={[commonStyle.flex(0.40), commonStyle.paddingHorizontal(5)]}>
                    <FormButton text="Submit" onPress={() => this.submit()}/>
                </View>
                <View style={[commonStyle.flex(0.2), commonStyle.paddingHorizontal(5), commonStyle.flexCenter]}>
                    <TouchableOpacity
                        onPress={() => this.cancel()}
                        activeOpacity={0.5}
                    >
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        if (!this.props.attachmentEvent) {
            return (<ActivityIndicator/>);
        }

        return (
            <View style={commonStyle.flex(1)}>
                <Content>
                    <FormSplitter text="Add Attachments"/>
                    <View style={style.container}>
                        <View style={commonStyle.width('100%')}>
                            <FormButton text="Photo / Attachment" onPress={() => this.attachFile()}/>
                            {this.state.attachmentsError &&
                            <Text style={validationErrorText} ellipsizeMode='head'>{this.state.attachmentsError}</Text>
                            }
                        </View>
                    </View>
                    <View style={style.attachmentsContainer}>
                        <ShipPartsAttachments
                            noTitle
                            updateAttachment={() => this.updateAttachment()}
                            deleteAttachment={id => this.deleteAttachment(id)}
                            attachments={this.props.attachmentEventAttachments}
                        />
                    </View>
                    <View style={commonStyle.indent(20)}/>
                    {this.renderBtns()}
                </Content>
            </View>
        )
    }
}
