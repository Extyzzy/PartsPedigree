import React, {Component} from 'react';
import {partEventsStyle as style} from "../../styles/part-event.style";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {commonStyle, COLORS} from "../../styles/common.style";


export class CofCItem extends Component {
    constructor(props) {
        super(props)
        console.log(props, 'props')
        this.state = {
            model: {}
        }
    }

    renderItem(title, text, last = false) {
        if (!text) {
            return null;
        }

        return (
            <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        style={[style.text, commonStyle.textBold]}>
                        {title}:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.5)}>
                    <Text
                        style={style.text}>
                        {text}
                    </Text>
                </View>
            </View>
        );
    }
    saveBack() {
        this.props.navigation.goBack();
    }

    saveNext() {
        this.props.navigation.goBack();
    }


    renderBtns() {
        return (
            <View style={[style.btnContainer, {justifyItems: 'center'}]}>
                <TouchableOpacity
                    onPress={() => this.saveBack()}
                    style={[style.btn, commonStyle.flex(0.5)]}
                    activeOpacity={0.5}
                >
                    <Text style={style.btnText}>Save & Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.saveNext()}
                    style={[style.btn, commonStyle.flex(0.5)]}
                    activeOpacity={0.5}
                >
                    <Text style={style.btnText}>Save & Next</Text>
                </TouchableOpacity>
            </View>
        );
    }
    renderField(title: string, text: string) {
        if (!title || !text) {
            return null;
        }

        return (
            <View style={commonStyle.indent(10)}>
                <Text
                    style={[style.text, commonStyle.textBold]}>
                    {title}:
                </Text>
                <Text
                    style={style.text}>
                    {text}
                </Text>
            </View>
        );
    }

    render() {
        return (
            <View style={[commonStyle.flex(1),{flexDirection: 'column'}]}>
                <View style={[style.padding, {flex: 2}]}>
                    {this.renderItem('Part Number', this.props.navigation.state.params.item.partMaster.partNumber || 'N/A')}
                    {this.renderItem('Part Name', this.props.navigation.state.params.item.partMaster.partName || 'N/A')}
                    {this.renderItem('Issue number', this.props.navigation.state.params.item.partMaster.issue || 'N/A')}
                    {this.renderItem('Organization Part Number', this.props.navigation.state.params.item.partMaster.orgPartNumber || 'N/A')}
                    {this.renderItem('Batch Number', this.props.navigation.state.params.item.partInstance.batchNumber || 'N/A')}
                    {this.renderItem('Serial Number', this.props.navigation.state.params.item.partInstance.serialNumber || 'N/A')}
                    {this.renderItem('Quantity', this.props.navigation.state.params.item.quantity || 'N/A')}
                    {this.renderField('Production Order Number', '' || 'N/A')}
                </View>
                <View stle={{flex: 1, justifyItems: 'center', alignItems: 'flex-end'}}>
                    {this.renderBtns()}
                </View>
            </View>
        )
    }
}