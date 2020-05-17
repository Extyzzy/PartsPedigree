import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image, BackHandler } from 'react-native';
import { Content } from 'native-base';
import { save81303Style as style } from '../../styles/save-8130-3.style';
import { Save8130Info } from "./save-8130-3-info.component";
import { Save8130Form } from "./save-8130-3-form.component";
import { FormSplitter } from "../../components/form-splitter.component";
import { commonStyle } from "../../styles/common.style";
import { FormButton } from "../../components/form-button.component";
import BackendApi from "../../services/backend";
import { branch } from "baobab-react/higher-order";
import { Event81303View } from "../../models/event81303View";
import { Event81303 } from "../../models/event81303";
import { StateService } from "../../services/state.service";
import { ScreenDetector } from "../../utils/screen-detector";
import Cancel from "../cancel-pop-up/cancel";

type Props = {
    event81303: Event81303View;
}

@branch({
    event81303: ['event81303'],
    event81303Items: ['event81303Items'],
})
export class Save8130Screen extends Component<Props> {
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
    }
    form: Save8130Form;

    static childContextTypes = {
        getEventId: PropTypes.func,
    };

    getChildContext() {
        return {
            getEventId: () => this.props.event81303 && this.props.event81303.event81303DraftId,
        };
    }

    componentDidMount() {
        StateService.setEvent81303(null);
        StateService.setEvent81303Items(null);

        const { params } = this.props.navigation.state;

        if (params && params.event81303DraftId) {
            BackendApi.getEvent81303Draft(params.event81303DraftId);
            BackendApi.getEvent81303Items(params.event81303DraftId);
        } else {
            BackendApi.createEvent81303Draft();
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                this.cancel()
            return true;
        });
        this.props.navigation.setParams({
            cancel: this.cancel
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    checkForItems() {
        if (!this.props.event81303Items || !this.props.event81303Items.length) {
            Alert.alert('Error', 'At least one item required');
            return true;
        }

        return false;
    }

    save() {
        if (this.checkForItems()) {
            return;
        }

        const event81303: Event81303 = this.form.trimModel();

        if (event81303) {
            BackendApi.updateEvent81303Draft(this.props.event81303.event81303DraftId, event81303)
                .then(() => {
                    Alert.alert('Success', '8130-3 Draft was successfully saved');
                });
        }
    }

    cancel() {
        if (this.form.formChanged()
            || this.props.event81303Items
            && this.props.event81303Items.length > 0) {
            Alert.alert(
                'Confirmation',
                'Are you sure you want to leave this screen? Your changes will be lost if you leave.',
                [{
                    text: 'Yes', onPress: () => {
                        this.props.navigation.goBack();
                    }

                }, {
                    text: 'No', onPress: () => {},
                }]
            )
        } else {
            this.props.navigation.goBack();
        }
    }

    deleteDraft() {
        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete 8130-3 Draft?',
            [{
                text: 'Yes', onPress: () =>
                    BackendApi.deleteEvent81303Draft(this.props.event81303.event81303DraftId).then(() => {
                        BackendApi.refreshPartInstanceTimeLine();
                      this.props.navigation.goBack();
                    })
            }, {
                text: 'No', onPress: () => {},
            }]
        );
    }

    submit() {
        if (this.checkForItems()) {
            return;
        }

        const event81303: Event81303 = this.form.validate();

        if (event81303) {
            event81303.submit = true;
            Alert.alert(
                'Sign 8130-3 Event',
                'This form will be Cryptographically signed with your user key and you will not be able to make any further changes. Are you sure you want to proceed?',
                [{
                    text: 'Yes', onPress: () =>
                        BackendApi.updateEvent81303Draft(this.props.event81303.event81303DraftId, event81303)
                            .then(() => {
                                Alert.alert('Success', 'Digital 8130-3 successfully created and signed',
                                    [{
                                        text: 'OK', onPress: () => {
                                            BackendApi.refreshPartInstanceTimeLine();
                                        this.props.navigation.goBack()
                                        }
                                    }]);
                            })
                }, {
                    text: 'No', onPress: () => {
                    },
                }]
            );
        }
    }

    renderResponsibilities() {
        return (
            <View style={style.container}>
                <Text style={[style.text, commonStyle.indent()]}>
                    It is important to understand that the existence of this document alone does not automatically
                    constitute authority to install the aircraft engine/propeller/article.
                </Text>
                <Text style={[style.text, commonStyle.indent()]}>
                    Where the user/installer performs work in accordance with the national regulations of an
                    airworthiness authority different than the airworthiness authority of the country specified in
                    Block 1, it is essential that the user/installer ensures that his/her airworthiness authority
                    accepts aircraft engine(s)/propeller(s)/article(s) from the airworthiness authority of the country
                    specified in Block 1.
                </Text>
                <Text style={[style.text, commonStyle.indent()]}>
                    Statements in Blocks 13a and 14a do not constitute installation certification. In all cases,
                    aircraft maintenance records must contain an installation certification issued in accordance with
                    the
                    national regulations by the user/installer before the aircraft may be flown.
                </Text>
            </View>
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
                    <FormButton text="Confirm & Digitally Sign" onPress={() => this.submit()}/>
                </View>
                <View style={[commonStyle.flex(0.2), commonStyle.paddingHorizontal(5), commonStyle.flexCenter]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.cancel()
                        }}
                        activeOpacity={0.5}
                    >
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        if (!this.props.event81303) {
            return (<ActivityIndicator/>);
        }

        return (
            <View style={style.mainContainer}>
                <Content>
                    <Save8130Info event81303={this.props.event81303}/>
                    <Save8130Form event81303={this.props.event81303} ref={form => this.form = form}/>
                    <FormSplitter text="USER/INSTALLER RESPONSIBILITIES"/>
                    {this.renderResponsibilities()}
                    {this.renderBtns()}
                </Content>
            </View>
        );
    }
}
