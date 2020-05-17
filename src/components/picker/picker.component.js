import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard } from 'react-native';
import { Text } from 'native-base';
import _picker from 'react-native-picker/index';
import { commonStyle } from "../../styles/common.style";
import { validationErrorText } from "../../styles/Common";
import { pickerContainerStyle as style, pickerStyle } from "./picker.style";
import { ScreenDetector } from "../../utils/screen-detector";

type Props = {
    items: Array<{ title: string | number; value: string | number } | string>;
    title: string;
    selected: string | number;
    error: string;
    tags: boolean;
    defaultText: string;
    onSelect: Function;
    onCancel: Function;
    disabled: boolean;
};

export class Picker extends PureComponent<Props> {
    static defaultProps = {
        items: [],
        title: '',
        error: null,
        selected: null,
        disabled: false,
        tags: false,
        defaultText: 'Select',
        onSelect() {
        },
        onCancel() {
        },
    };

    static contextTypes = {
        setBackdropCb: PropTypes.func,
        unsetBackdropCb: PropTypes.func,
    };

    getSelected() {
        if (typeof this.props.items[0] === 'string') {
            return this.props.selected || null;
        }

        const val = this.props.items.find(item => item.value === this.props.selected);
        return val ? val.title : null;
    }

    show() {
        const pickerData = typeof this.props.items[0] !== 'string' ?
            this.props.items.map(item => item.title) :
            this.props.items;

        _picker.init({
            ...pickerStyle,
            isFocusable: true,
            pickerTitleText: this.props.title,
            pickerData: pickerData,
            selectedValue: [this.getSelected()],
            onPickerConfirm: (data, idx) => {
                this.context.unsetBackdropCb();
                this.props.onSelect(this.props.items[idx]);
            },
            onPickerCancel: () => {
                this.context.unsetBackdropCb();
                this.props.onCancel();
            }
        });

        Keyboard.dismiss();
        _picker.show();

        this.context.setBackdropCb(() => this.hide());
    }

    componentWillUnmount() {
        this.context.unsetBackdropCb();
        _picker.hide();
    }

    hide() {
        _picker.hide();
    }

    render() {
        const {styles} = this.props;

        return (
            <View>
                <View style={[
                    this.props.tags ?
                        { justifyContent: 'flex-start', height:  ScreenDetector.isPhone() ? 20 : 30} :
                        { justifyContent: 'center'}
                    ]}>
                    <Text
                        style={[
                          style.text,
                          styles && styles.tabText,
                          styles && styles.tabTextWhiteBg,
                          styles && styles.tabTextWhiteBg,
                          styles && styles.activeTabTextWhiteBg
                        ]}
                        onPress={() => !this.props.disabled && this.show()}
                        accessibilityLabel={this.getSelected() || this.props.defaultText}>
                        {this.getSelected() || this.props.defaultText}
                    </Text>
                </View>
                {!this.props.tags &&
                <Text
                    style={validationErrorText}
                    numberOfLines={1}
                    ellipsizeMode='head'
                    accessibilityLabel={this.props.error}>
                    {this.props.error}
                </Text>
                }
            </View>
        );
    }
}
