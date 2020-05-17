import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { detail81303Style as style } from './detail-8130-3.style';
import { commonStyle } from "../../styles/common.style";
import { Event81303View } from "../../models/event81303View";
import { Event81303ItemView } from "../../models/event81303ItemView";
import { PartInstanceDetail } from "../part-instance/part-instance.component";

type Props = {
    event81303: Event81303View;
}

export class Detail81303Info extends PureComponent<Props> {
    renderItemsTitles() {
        return (
            <View style={style.itemsHeader}>
                <View style={[commonStyle.flex(0.1), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.itemsHeaderText} numberOfLines={1}>Qty</Text>
                </View>
                <View style={[commonStyle.flex(0.4), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.itemsHeaderText} numberOfLines={1}>Part #</Text>
                </View>
                <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.itemsHeaderText} numberOfLines={1}>Description</Text>
                </View>
            </View>
        );
    }

    onPressItem(partInstanceId) {
        this.props.navigation.navigate('PartInstance', { partInstanceId });
    }

    render81303Item(item: Event81303ItemView) {
        return (
            <TouchableOpacity
                onPress={() => this.onPressItem(item.partInstance.partInstanceId)}
                style={[commonStyle.flexRow, commonStyle.marginHorizontal(-3), commonStyle.indent()]}
                key={item.event81303ItemId}
            >
                <View style={[commonStyle.flex(0.1), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.quantity}</Text>
                </View>
                <View style={[commonStyle.flex(0.4), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.partMaster.mpn}</Text>
                </View>
                <View style={[commonStyle.flex(0.5), commonStyle.paddingHorizontal(3)]}>
                    <Text style={style.text} numberOfLines={1}>{item.partInstance.description}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        if (!this.props.event81303) {
            return null;
        }

        const { items } = this.props.event81303;

        return (
            <View>
                {this.renderItemsTitles()}
                <View style={style.container}>
                    {!!items && items.map(item => this.render81303Item(item))}
                </View>
            </View>
        );
    }
}
