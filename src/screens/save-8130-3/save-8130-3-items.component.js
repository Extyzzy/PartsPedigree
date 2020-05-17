import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { commonStyle } from "../../styles/common.style";
import { FormButton } from "../../components/form-button.component";
import { branch } from "baobab-react/higher-order";
import { Event81303ItemView } from "../../models/event81303ItemView";
import { ScreenDetector } from "../../utils/screen-detector";
import BackendApi from "../../services/backend";
import { partEventsStyle as style } from "../../styles/part-event.style";

type Props = {
    event81303Items: Array<Event81303ItemView>;
}

@branch({
    event81303Items: ['event81303Items'],
})
export class Save8130Items extends Component<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
        getEventId: PropTypes.func,
    };

    addItem() {
        this.context.getNavigation().navigate('Save8130Item', { event81303DraftId: this.context.getEventId() });
    }

    pressItem(item: Event81303ItemView) {
        this.context.getNavigation().navigate('Save8130Item', { event81303DraftId: this.context.getEventId(), item });
    }

    deleteItem(event81303ItemId: string) {
        BackendApi.deleteEvent81303Item(event81303ItemId);
    }

    renderTitles() {
        return (
            <View style={[style.table, style.tableHeader, commonStyle.paddingHorizontal(10)]}>
                <View style={[commonStyle.flex(0.1), style.tableItem]}>
                    <Text style={style.textTitle} numberOfLines={1}>#</Text>
                </View>
                <View style={[commonStyle.flex(0.25), style.tableItem]}>
                    <Text style={style.textTitle}  numberOfLines={1}>Description</Text>
                </View>
                <View style={[commonStyle.flex(0.2), style.tableItem]}>
                    <Text style={style.textTitle}  numberOfLines={1}>Part #</Text>
                </View>
                <View style={[commonStyle.flex(0.1), style.tableItem]}>
                    <Text style={style.textTitle}  numberOfLines={1}>Qty</Text>
                </View>
                <View style={[commonStyle.flex(0.2), style.tableItem]}>
                    <Text style={style.textTitle}  numberOfLines={1}>Serial #</Text>
                </View>
                <View style={[commonStyle.flex(0.15), style.tableItem]}/>
            </View>
        );
    }

    renderItem(item: Event81303ItemView, index: number) {
        return (
            <View key={item.event81303ItemId}
                  style={[style.table, commonStyle.paddingVertical(5), commonStyle.paddingHorizontal(10)]}
            >
                <View style={[commonStyle.flex(0.1), style.tableItem]}>
                    <Text style={style.text} numberOfLines={1}>{index + 1}</Text>
                </View>
                <View style={[commonStyle.flex(0.25), style.tableItem]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.name}</Text>
                </View>
                <View style={[commonStyle.flex(0.2), style.tableItem]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.partMaster.mpn}</Text>
                </View>
                <View style={[commonStyle.flex(0.1), style.tableItem]}>
                    <Text style={style.text} numberOfLines={1}>{item.quantity}</Text>
                </View>
                <View style={[commonStyle.flex(0.2), style.tableItem]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.serialNumber}</Text>
                </View>
                <View style={[commonStyle.flex(0.15), style.tableItem]}>
                    <View style={[commonStyle.flexRow, commonStyle.alignCenter, commonStyle.marginHorizontal(-10)]}>
                        {!this.props.detail &&
                        <TouchableOpacity
                            onPress={() => this.pressItem(item)}
                            style={commonStyle.marginHorizontal(10)}
                            activeOpacity={0.5}
                        >
                            <Image
                                style={ScreenDetector.isPhone() ? commonStyle.size(18) : commonStyle.size(28)}
                                source={require('../../assets/icons/icon_pencil_gray.png')}
                            />
                        </TouchableOpacity>
                        }
                        {!this.props.detail &&
                        <TouchableOpacity
                            onPress={() => this.deleteItem(item.event81303ItemId)}
                            style={commonStyle.marginHorizontal(10)}
                            activeOpacity={0.5}
                        >
                            <Image
                                style={commonStyle.size(ScreenDetector.isPhone() ? 15 : 30)}
                                source={require('../../assets/icons/delete_photo_icon.png')}
                            />
                        </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={commonStyle.indent()}>
                {this.renderTitles()}
                {
                    this.props.event81303Items &&
                    this.props.event81303Items.map((item, index) => this.renderItem(item, index))
                }
                <View style={commonStyle.indent()}/>
                <View style={[commonStyle.paddingHorizontal(10), commonStyle.flexRow, commonStyle.justifyEnd]}>
                    <View style={commonStyle.width(150)}>
                        <FormButton onPress={() => this.addItem()} text="Add Item"/>
                    </View>
                </View>
            </View>
        )
    }
}
