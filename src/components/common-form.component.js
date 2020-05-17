import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Textarea } from 'native-base';
import { commonStyle } from "../styles/common.style";
import TextInputValid from "./TextInputValid";
import { validationErrorText, validationErrorTextLight } from "../styles/Common";

export class CommonForm extends Component {
    currencySign: string;

    setValue(field: string, value: string | number | boolean, title: string) {
        const { model } = this.state;
        model[field] = value;
        this.setState({ model });
    }

    validateField(field: string, fieldName: string): boolean {
        const val = this.state.model[field];
        const hasError = (!val && val !== 0) || (val.trim && !val.trim());

        this.setState({
            [`${field}Error`]: hasError ? `${fieldName} can not be empty` : null
        });

        return hasError;
    }

    validateForInteger(field: string, fieldName: string, text = 'integer'): boolean {
        let val = this.state.model[field];
        if (val && !Number.isInteger(val)) {
            val = parseInt(val)
        }
        const hasError = val === 0 || (val && !Number.isInteger(val));

        this.setState({
            [`${field}Error`]: hasError ? `${fieldName} should be ${text}` : null
        });

        return hasError;
    }

    validateForFloat(field: string, fieldName: string) {
        const val = this.state.model[field];
        const hasError = val === 0 || (val && !Number.isFinite(val));

        this.setState({
            [`${field}Error`]: hasError ? `${fieldName} should be numeric` : null
        });

        return hasError;
    }

    validateForZeroPossibleInteger(field: string, fieldName: string): boolean {
        const val = this.state.model[field];

        return +val === 0 ? false : this.validateForInteger(field, fieldName);
    }

    renderInput(title, field, validFn, isNumeric = false, maxLength) {
        const msxLng = maxLength || (isNumeric ? 16 : 30);

        return (
            <View>
                <Text
                    style={commonStyle.inputLabel}
                    accessibilityLabel={title + " label"}>
                    {title}
                </Text>
                <TextInputValid
                    style={[commonStyle.input, commonStyle.colorBlack]}
                    accessibilityLabel={title + " field"}
                    autoCapitalize={isNumeric ? 'none' : 'sentences'}
                    onChangeText={value => this.setValue(field, isNumeric && value ? +value : value, true)}
                    onBlur={() => validFn && validFn.call(this)}
                    value={this.state.model[field]}
                    error={this.state[`${field}Error`]}
                    maxLength={msxLng}
                />
            </View>
        )
    }

    renderTextArea(title, field, validFn, rowSpan = 5) {
        return (
            <View style={commonStyle.indent()}>
                <Text
                    style={commonStyle.inputLabel}
                    accessibilityLabel={title + " label"}>
                    {title}
                </Text>
                <Textarea
                    style={commonStyle.textarea}
                    accessibilityLabel={title + " field"}
                    rowSpan={rowSpan}
                    onBlur={() => validFn && validFn.call(this)}
                    value={this.state.model[field]}
                    autoCapitalize="sentences"
                    maxLength={200}
                    onChangeText={value => this.setValue(field, value, true)}
                />
                {this.state[`${field}Error`] &&
                <Text style={validationErrorText} ellipsizeMode='head'>{this.state[`${field}Error`]}</Text>
                }
            </View>
        )
    }

    setCurrency(text, field, maxLng) {
        const val = this.unformatCurrency(text);
        maxLng += Math.floor(maxLng/3);

        if (+val) {
            const priceVal = this.formatCurrency(val);
            const dotIndex = priceVal.indexOf('.');
            const maxPriceLng = dotIndex > -1 ? dotIndex + 3 : maxLng;
            if (field === 'lineTaxValue'){
              this.setState({ lineTaxVal: priceVal, maxPriceLng });
            } else{
              this.setState({ priceVal, maxPriceLng });
            }
            this.setValue(field, Math.round((+val).toFixed(2) * 100), false);
        } else {
            if (field === 'lineTaxValue'){
              this.setState({ lineTaxVal: text});
            } else{
              this.setState({ priceVal: text });
            }
            this.setValue(field, text);
        }
    }

    formatCurrency(val: string) {
        if (!val) return '';
        let _n = val.split('.');

        const res = _n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return `${this.currencySign ? `${this.currencySign} ` : ''}${res}${_n.length > 1 ? `.${_n[1].slice(0, 2)}` : ''}`;
    }

    unformatCurrency(val) {
        return val.replace(/\$ |,/g, '')
    }

    clearObjData(data) {
        const obj = { ...data };

        //toDo: jrpc architectural solution
        Object.keys(obj).forEach(key => {
          if (obj[key] == -1 || obj[key] == "") {
                delete obj[key];
            }
        });

        return obj;
    }

    trimModel() {
        const { model } = this.state;

        Object.keys(model).forEach(key => {
            if (model[key] && model[key].trim) {
                model[key] = model[key].trim();
            }

            if (!model[key] && model[key] !== false && model[key] !== 0) {
                delete model[key];
            }
        });

        return model;
    }
}
