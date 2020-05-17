import React from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {commonStyle} from "../../styles/common.style";
import {partEventsStyle as style} from "../../styles/part-event.style";
import {ScreenDetector} from "../../utils/screen-detector";
import {shipParts} from "../../constants/accessability";

export const ShipPartsBtns = props => (
    <View style={style.btnContainer}>
        <TouchableOpacity
            accessibilityLabel={shipParts.saveDraftButton}
            onPress={props.save}
            style={[style.btn, commonStyle.flex(0.2)]}
            activeOpacity={0.5}
        >
            <Text style={style.btnText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
            accessibilityLabel={shipParts.deleteDraftButton}
            onPress={props.delete}
            style={[style.btn, commonStyle.flex(0.15)]}
            activeOpacity={0.5}
        >
            <Image
                style={ScreenDetector.isPhone() && commonStyle.size(15, 18)}
                source={require('../../assets/icons/trash_icon.png')}
            />
        </TouchableOpacity>
        <TouchableOpacity
            accessibilityLabel={shipParts.attachmentsButton}
            style={[style.btn, commonStyle.flex(0.15)]}
            onPress={props.attach}
            activeOpacity={0.5}
        >
            <Image
                style={ScreenDetector.isPhone() && commonStyle.size(15, 16)}
                source={require('../../assets/icons/paperclip_white_icon.png')}
            />
        </TouchableOpacity>
        <TouchableOpacity
            accessibilityLabel={shipParts.addItemButton}
            onPress={props.addItem}
            style={[style.btn, commonStyle.flex(0.175)]}
            activeOpacity={0.5}
        >
            <Text style={style.btnText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
            accessibilityLabel={shipParts.submitButton}
            onPress={props.submit}
            style={[style.btn, commonStyle.flex(0.175)]}
            activeOpacity={0.5}
        >
            <Text style={style.btnText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={props.cancel}
            style={[style.btn, commonStyle.whiteBg, commonStyle.flex(0.15)]}
            activeOpacity={0.5}
            accessibilityLabel={shipParts.cancelButton}
        >
            <Text style={style.text}>Cancel</Text>
        </TouchableOpacity>
    </View>
           //*{props.receive ?*//

            //     :
            //     <TouchableOpacity
            //         onPress={props.cancel}
            //         style={[style.btn, commonStyle.flex(0.15)]}
            //         activeOpacity={0.5}
            //         accessibilityLabel={shipParts.cancelButton}
            //     >
            //         <Text style={style.btnText}>C of C</Text>
            //     </TouchableOpacity>
            // }

);

ShipPartsBtns.propTypes = {
    save: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    attach: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
};
