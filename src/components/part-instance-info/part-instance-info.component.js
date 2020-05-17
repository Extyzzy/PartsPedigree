import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { partInstanceInfoStyle as style } from "./part-instance-info.style";
import { commonStyle } from "../../styles/common.style";
import { PartInstanceView } from "../../models/part-instance-view";

type Props = {
    partInstance: PartInstanceView;
}

export class PartInstanceInfo extends PureComponent<Props> {
    renderItem(title, text, last = false) {
        if (!title || !text) {
            return null;
        }

        return (
            <View style={[commonStyle.flexRow, !last && commonStyle.indent(15)]}>
                <View style={commonStyle.flex(0.4)}>
                    <Text
                        style={[style.partInstanceInfoText, commonStyle.textBold]}
                        accessibilityLabel={title}>{title}:</Text>
                </View>
                <View style={commonStyle.flex(0.6)}>
                    <Text style={style.partInstanceInfoText} accessibilityLabel={text}>{text}</Text>
                </View>
            </View>
        );
    }

    render() {
        const { partInstance } = this.props;
        return (
            <View style={style.partInstanceInfoContainer}>
                {this.renderItem('Part #', partInstance.partMaster.mpn)}
                {this.renderItem('Part Name', partInstance.partMaster.partName)}
                {this.renderItem('Description', partInstance.partMaster.description)}
                {this.renderItem('UOM', partInstance.partMaster.uom && partInstance.partMaster.uom.name)}
                {this.renderItem('CAGE Code', partInstance.partMaster.manufacturerCage)}
                {this.renderItem('Country of Origin', partInstance.partMaster.country.name)}
                {!!partInstance.serialNumber && this.renderItem('Serial #', partInstance.serialNumber)}
                {!!partInstance.batchNumber && this.renderItem('Batch #', partInstance.batchNumber)}
                {this.renderItem('Issue', partInstance.issue, true)}
            </View>
        );
    }
}