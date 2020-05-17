import React from 'react';
import { View } from 'react-native';
import { save81303Style as style } from '../../styles/save-8130-3.style';
import { CommonForm } from "../../components/common-form.component";
import { Event81303Item } from "../../models/event81303Item";

type Props = {
    qty: number;
}

export class Save8130ItemForm extends CommonForm {
    constructor(props: Props) {
        super(props);

        const model = new Event81303Item();

        if (props.qty) {
            model.quantity = props.qty;
        }

        this.state = { model };
    }


    validateQty() {
        return this.validateField('quantity', 'Quantity') || this.validateForInteger('quantity', 'Quantity', 'greater than or equal to 1');
    }

    validate() {
        if (!this.validateQty()) {
            return this.trimModel();
        }

        return null;
    }

    render() {
        return (
            <View style={style.container}>
                {this.renderInput('*Quantity', 'quantity', this.validateQty, true)}
            </View>
        );
    }
}
