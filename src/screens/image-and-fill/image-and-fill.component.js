import React, {Component} from 'react';
import {
    View,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    ScrollView,
    Platform,
    Image,
    Alert,
    BackHandler
} from 'react-native';
import {Container, Text} from 'native-base';
import {branch} from "baobab-react/higher-order";
import {ImageAndFillStyle as style} from './image-and-fill.style';
import {FillModal} from './fill-modal.component';
import {commonStyle} from "../../styles/common.style";
import BackendApi from "../../services/backend";
import {ImageModel} from "../../models/image";
import {ImageWithSegments} from "./image-with-segments.component";
import {ImageAndFillData} from "../../models/image-and-fill-data";
import * as fields from './fields';
import {FormButtons} from "../../components/form-buttons";
import {StateService} from "../../services/state.service";
import {ScreenDetector} from "../../utils/screen-detector";
import {ImageUtils} from "../../utils/image-utils";
import RNFetchBlob from "react-native-fetch-blob";
import {FileData} from "../../models/file-data";
import Cancel from "../cancel-pop-up/cancel";

type Props = {
    imageForFill: ImageModel;
}

@branch({
    imageForFill: ['imageForFill'],
    imageAndFilHelpModal: ['imageAndFilHelpModal'],
})
export class ImageAndFill extends Component<Props> {
    imageId: string;
    feelData: Function<void, ImageAndFillData>;
    fields: Array<string>;
    state = {
        segment: null
    };

    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;
        this.imageId = params && params.imageId;
        this.feelData = params && params.feelData || function () {
            };
        this.fields = fields[params.type];
        this.backButton = this.backButton.bind(this);
    }

    componentDidMount() {
        this.closeModal();
        if (this.imageId && (!this.props.imageForFill || this.imageId !== this.props.imageForFill.imageId)) {
            BackendApi.recognizeByImageId(this.imageId);
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (this.props.imageForFill) {
                Alert.alert(
                    'Confirmation',
                    'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                    [{
                        text: 'Yes', onPress: () => {
                            this.props.navigation.goBack();
                        }

                    }, {
                        text: 'No', onPress: () => {
                        },
                    }]
                )
            } else {
                this.props.navigation.goBack();
            }
            return true;
        });
        this.props.navigation.setParams({
            backButton: this.backButton
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    goBack() {
        this.props.navigation.goBack();
    }

    save() {
        if (this.props.imageForFill) {
            this.feelData({image: this.props.imageForFill});
        }
        this.goBack();
    }

    closeModal() {
        this.setState({segment: null});
    }

    setContentState(contentState: number) {
        this.setState({contentState});
    }

    selectSegment(segment: string) {
        this.setState({segment});
    }

    selectItem(item: { value: string, isNumber: boolean }) {
        const data: ImageAndFillData = {
            image: this.props.imageForFill,
            field: item.value,
            value: item.isNumber && +this.state.segment ? +this.state.segment : this.state.segment,
        };

        this.feelData({...data});
        this.closeModal();
        this.props.navigation.navigate('PartsListing', {
            fromImageFill: true,
        });
    }

    renderLoading() {
        return (
            <ActivityIndicator/>
        );
    }

    renderImage() {
        const {imageForFill} = this.props;

        if (!imageForFill) {
            return null;
        }

        return (
            <ImageWithSegments
                selectSegment={(segment) => this.selectSegment(segment)}
                image={imageForFill}
            />
        );
    }
    backButton() {
        if (this.props.imageForFill) {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                [{
                    text: 'Yes', onPress: () => {
                        this.props.navigation.goBack();
                    }

                }, {
                    text: 'No', onPress: () => {
                    },
                }]
            )
        } else {
            this.props.navigation.goBack();
        }
    }

    renderInstructionModal() {
        const height = {height: ScreenDetector.isPhone() ? 420 : 550};
        return (
            <Modal
                visible={this.props.imageAndFilHelpModal}
                onRequestClose={this.closeModal}
                transparent
            >
                <View style={[commonStyle.modal, {justifyContent: 'center'}]}>
                    <View style={[commonStyle.modalContainer, style.modal, height]}>
                        <View>
                            <View style={commonStyle.indent(15)}>
                                <Text style={style.modalTitle}>
                                    Instructions
                                </Text>
                                <View style={commonStyle.line}/>
                            </View>
                        </View>

                        <ScrollView>
                            <Text style={style.modalText}>
                                This function allows you to use data from an
                                image to complete a form or search ﬁeld.
                            </Text>
                            <Text style={style.modalText}>
                                Select the data that you want to use and then
                                select a ﬁeld to assign it to.
                            </Text>
                            <Text style={style.modalText}>
                                Note that you can scroll and zoom the image as
                                well as repeat the process on the same image for
                                multiple ﬁelds.
                            </Text>
                            <Text style={style.modalText}>
                                You can also re-take or take a new photo if
                                required.
                            </Text>
                        </ScrollView>

                        <View>
                            <View style={[commonStyle.line, commonStyle.indent(15)]}/>
                            <View style={style.modalBtnContainer}>
                                <TouchableOpacity
                                    onPress={() => this.closeInfoModal()}
                                >
                                    <Text style={[style.modalText, commonStyle.textBold]}>CLOSE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    closeInfoModal() {
        StateService.setImageAndFilHelpModal(false);
    }

    async rotate(uri, rotation) {
        let imagePath = uri;

        if (Platform.OS === 'android') {
            await RNFetchBlob.config({
                fileCache: true
            })
                .fetch("GET", uri)
                // the image is now dowloaded to device's storage
                .then(resp => {
                    // the image path you can use it directly with Image component

                    imagePath = `file://${resp.path()}`;
                    return resp.readFile("base64");
                });
        }

        const rotatedImage = await ImageUtils.resizeImage(imagePath, 1024, 1024, rotation);

        const image = new FileData(rotatedImage.uri, rotatedImage.fileName, rotatedImage.type);

        BackendApi.uploadRecognizaedImage(image);
    }

    render() {
        return (
            <Container>
                <View style={style.imageContainer}>
                    {this.props.imageForFill ? this.renderImage() : this.renderLoading()}
                </View>
                <FillModal
                    segment={this.state.segment}
                    closeModal={() => this.closeModal()}
                    items={this.fields}
                    selectItem={(val) => this.selectItem(val)}
                />
                {this.renderInstructionModal()}
                {
                    this.props.imageForFill && (
                        <View style={style.formBtnsContainer}>
                            <View style={[style.formRotateContainer, {marginTop: 20}]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.rotate(this.props.imageForFill.path, -90)
                                    }}>
                                    <Image
                                        style={style.rotate}
                                        source={require('../../assets/icons/rotating_Left.png')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.rotate(this.props.imageForFill.path, 90)
                                    }}>
                                    <Image
                                        style={style.rotate}
                                        source={require('../../assets/icons/rotating_Right.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <FormButtons onCancelPress={() => {
                                if (this.props.imageForFill) {
                                    Alert.alert(
                                        'Confirmation',
                                        'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                                        [{
                                            text: 'Yes', onPress: () => {
                                                this.props.navigation.goBack();
                                            }

                                        }, {
                                            text: 'No', onPress: () => {
                                            },
                                        }]
                                    )
                                } else {
                                    this.props.navigation.goBack();
                                }

                            }
                            }
                                         onOkPress={() => this.save()}/>
                        </View>
                    )
                }
            </Container>
        );
    }
}
