import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {FormSplitter} from "../../components/form-splitter.component";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {commonStyle, COLORS} from "../../styles/common.style";
import {ScreenDetector} from "../../utils/screen-detector";
import BackendApi from "../../services/backend";
import {ShipPartItemView} from "../../models/ship-part-item-view";
import {FilePicker} from "../../utils/file-picker";
import {CrossBtn} from "../../components/cross-btn.component";
import {parts, shipParts} from "../../constants/accessability";

type Props = {
    items: Array<ShipPartItemView>;
    detail: boolean;
    eventId?: string;
    onPressItem: Function;
    formTitle: string;
    paperClip: boolean;
}

export class ShipPartsItems extends PureComponent<Props> {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked,
        };
        this.checkItem = this.checkItem.bind(this);
    }

    deleteItem(shipItemId: string) {
        BackendApi.deleteShipItem(shipItemId);
    }

    pressItem(item: ShipPartItemView, showAttaches = false) {
        this.props.onPressItem(item, showAttaches);
    }

    attachFile(shipItemId: string) {
        FilePicker.show()
            .then(file => BackendApi.uploadFile(file, shipItemId, 'item'));
    }

    checkItem = (shipItemId) => {
        let boolean = this.props.checked.includes(shipItemId);
        if (boolean) {
            this.props.deleteChecked(shipItemId);
        } else {
            this.props.updateChecked(shipItemId);
        }
    };
    checkAllItems = () => {
        this.props.updateAllChecked();
    };

    renderAllCheckBox() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.checkAllItems()}>
                    <View style={{
                        width: 15,
                        height: 15,
                        borderWidth: 1.5,
                        borderColor: 'gray',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {this.props.allChecked ?
                            <View>
                                <Image style={{width: 15, height: 15}}
                                       source={require('../../assets/icon_checkmark.png') }/>
                            </View> : null}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.checked) !== JSON.stringify(prevProps.checked)) {
            this.setState({checked: this.props.checked})
        }
    }

    renderCheckBox = (shipItemId) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.checkItem(shipItemId)}>
                    <View style={{
                        width: 15,
                        height: 15,
                        borderWidth: 1.5,
                        borderColor: 'gray',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {this.state.checked && this.state.checked.includes(shipItemId) ?
                            <View>
                                <Image style={{width: 15, height: 15}}
                                       source={require('../../assets/icon_checkmark.png') }/>
                            </View> : null
                        }
                    </View>
                </TouchableOpacity>

            </View>
        )
    };

    renderHeader() {
        return (
            <View style={[style.table, style.tableHeader, {justifyContent: 'space-between'}]}>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}
                          accessibilityLabel={shipParts.tableNumberHeader}>#</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}
                          accessibilityLabel={shipParts.tablePartNumberHeader}>PART #</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle} accessibilityLabel={shipParts.tablePartNameHeader}>PART
                        NAME</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle} accessibilityLabel={shipParts.tableQuantityHeader}>QTY</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.textTitle}
                          accessibilityLabel={shipParts.tableUomHeader}>UOM</Text>
                </View>
                {!this.props.receive ? <View style={[commonStyle.flex(1), style.tableItem]}></View>: null}
                {this.props.receive ?
                    <View style={[commonStyle.flex(1), style.tableItem]}>
                        <Text numberOfLines={1} style={style.textTitle}
                              accessibilityLabel={shipParts.tableUomHeader}>RCV?</Text>
                    </View> : null
                }
                {this.props.receive ?
                    <View style={[commonStyle.flex(1), style.tableItem, {paddingTop: 4}]}>
                        {this.renderAllCheckBox()}
                    </View> : null}
            </View>
        )
    }

    renderItem(item: ShipPartItemView, index: number) {
        const {partMaster} = item;
        return (
            <View style={[style.table, {justifyContent: 'space-between'}]} key={item.shipItemId}>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text
                        accessibilityLabel={shipParts.partItemIndex}
                        onPress={() => this.pressItem(item)}
                        numberOfLines={1} style={[style.text, commonStyle.color(COLORS.blue)]}
                    >{++index}</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text
                        onPress={() => this.pressItem(item)}
                        numberOfLines={1}
                        style={[style.text, commonStyle.color(COLORS.blue)]}
                        accessibilityLabel={parts.partNumber}
                    >
                        {!!partMaster && partMaster.mpn}
                    </Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.text}
                          accessibilityLabel={parts.partNumber}>{!!partMaster && partMaster.partName}</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1} style={style.text}
                          accessibilityLabel={shipParts.partItemQuantity}>{item.quantity}</Text>
                </View>
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <Text numberOfLines={1}
                          accessibilityLabel={shipParts.uom}
                          style={style.text}>{!!partMaster && !!partMaster.uom && partMaster.uom.name}</Text>
                </View>
                {this.props.receive ?
                    <View style={[commonStyle.flex(1), style.tableItem]}>
                        {this.renderCheckBox(item.partInstance && item.partInstance.partInstanceId)}
                    </View> : null}
                <View style={[commonStyle.flex(1), style.tableItem]}>
                    <View style={[commonStyle.flexRow, commonStyle.justifyEnd, commonStyle.marginHorizontal(-10)]}>
                        {item.hasAttachments && this.props.paperClip ?
                            <TouchableOpacity
                                onPress={() => this.pressItem(item, true)}
                                style={commonStyle.marginHorizontal(25)}
                                activeOpacity={0.5}
                                accessibilityLabel={shipParts.viewAttachments}
                            >
                                <Image
                                    style={ScreenDetector.isPhone() ? commonStyle.size(15, 16) : commonStyle.size(30, 32)}
                                    source={require('../../assets/icons/paperclip_gray_icon.png')}
                                />
                            </TouchableOpacity> :
                            null
                        }
                        {this.props.receive &&  <View style={[commonStyle.flex(1), style.tableItem]}/>}
                        {!this.props.detail &&
                            <CrossBtn onPress={() => this.deleteItem(item.shipItemId)}/>
                        }
                    </View>
                </View>
            </View>
        );
    }


    render() {
        return (
            <View>
                <FormSplitter text={this.props.formTitle}/>
                {this.renderHeader()}
                {!!this.props.items && this.props.items.map((item, index) => this.renderItem(item, index))}
            </View>
        );
    }
}

ShipPartsItems.defaultProps = {
    formTitle: 'ITEMS TO BE SHIPPED',
    paperClip: true,
};