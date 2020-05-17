import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Content } from 'native-base';
import { save81303Style as style } from '../../styles/save-8130-3.style';
import { commonStyle } from "../../styles/common.style";
import { StateService } from "../../services/state.service";
import { SearchInput } from "../../components/search-input.component";
import { branch } from "baobab-react/higher-order";
import { PartInstanceView } from "../../models/part-instance-view";
import { PartInstanceInfo } from "../../components/part-instance-info/part-instance-info.component";
import { Save8130ItemForm } from "./save-8130-3-item-form.component";
import { FormButton } from "../../components/form-button.component";
import BackendApi from "../../services/backend";
import { Event81303Item } from "../../models/event81303Item";
import { Event81303ItemView } from "../../models/event81303ItemView";
import { ImageUtils } from "../../utils/image-utils";

type Props = {
    textSearch: string;
    partInstance: PartInstanceView;
}

@branch({
    partInstance: ['partInstance'],
    textSearch: ['textSearch'],
})
export class Save8130Item extends Component<Props> {
    form: Save8130ItemForm;
    event81303DraftId: string;
    item: Event81303ItemView;

    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    constructor(props) {
        super(props);

        const { event81303DraftId, item } = props.navigation.state.params;

        this.event81303DraftId = event81303DraftId;
        this.item = item;
    }

    componentDidMount() {
        this.clearSearch();
        if (this.item) {
            StateService.setPartInstance(this.item.partInstance);
        } else {
            StateService.setPartInstance(null);
        }
    }

    clearSearch() {
        StateService.setTextSearch(null);
    }

    find() {
        this.context.getNavigation().navigate('PartInstanceItemsListing');
    }

    save(callback) {
        const event81303Item: Event81303Item = this.form.validate();
        if (event81303Item && this.props.partInstance) {
            event81303Item.partInstanceId = this.props.partInstance.partInstanceId;
            event81303Item.event81303DraftId = this.event81303DraftId;

            (this.item ?
                BackendApi.updateEvent81303Item(this.item.event81303ItemId, event81303Item) :
                BackendApi.addEvent81303Item(this.event81303DraftId, event81303Item))
                .then(() => BackendApi.getEvent81303Items(this.event81303DraftId))
                .then(() => {
                    Alert.alert('Success', `Event 8130-3 Item was successfully ${this.item ? 'updated' : 'added'}`, [{
                        text: 'OK', onPress: callback
                    }]);
                })
        }
    }

    cancel() {
        this.props.navigation.goBack()
    }

    saveAndBack() {
        this.save(() => this.cancel());
    }

    saveAndNext() {
        this.save(() => {
            StateService.setPartInstance(null);
        });
    }

    async filImage() {
        const image = await ImageUtils.showImagePicker();

        BackendApi.uploadRecognizaedImage(image);

        this.context.getNavigation().navigate('ImageAndFill', {
            type: 'search',
            feelData: ({ value }) => {
                StateService.setTextSearch(value);
                setTimeout(() => this.find(), 0);
            }
        });
    }

    renderSearchBlock() {
        return (
            <View style={[style.container, commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.35)}>
                    <Text style={commonStyle.textBold}>Search for a Part:</Text>
                </View>
                <View style={commonStyle.flex(0.65)}>
                    <SearchInput
                        textSearch={this.props.textSearch}
                        onChangeText={textSearch => StateService.setTextSearch(textSearch)}
                        onPressFind={() => this.find()}
                        onPressImageAndFil={() => this.filImage()}
                        onPressClear={() => this.clearSearch()}
                    />
                </View>
            </View>
        );
    }

    renderBtns() {
        return (
            <View style={[style.container, commonStyle.flexRow]}>
                <View style={[commonStyle.flex(0.35), commonStyle.paddingHorizontal(5)]}>
                    <FormButton text="Save & Back" onPress={() => this.saveAndBack()}/>
                </View>
                <View style={[commonStyle.flex(0.35), commonStyle.paddingHorizontal(5)]}>
                    <FormButton text="Save & Next" onPress={() => this.saveAndNext()}/>
                </View>
                <View style={[commonStyle.flex(0.3), commonStyle.flexCenter, commonStyle.paddingHorizontal(5)]}>
                    <TouchableOpacity
                        activeApacity={0.5}
                        onPress={() => this.cancel()}
                    >
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Content>
                {!this.item && this.renderSearchBlock()}
                {this.props.partInstance &&
                <View>
                    <PartInstanceInfo partInstance={this.props.partInstance}/>
                    <Save8130ItemForm qty={this.item ? this.item.quantity : null} ref={form => this.form = form}/>
                    {this.renderBtns()}
                </View>
                }
            </Content>
        );
    }
}
