import React from 'react';
import Moment from 'moment';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {commonStyle} from "../../styles/common.style";
import {VARIABLES} from "../../styles/variables";
import {TextInputValid} from "../../components/TextInputValid";

export const ArrivalEventModal = props => (
    <Modal
        visible={props.visible}
        onRequestClose={props.closeModal}
        transparent
    >
        <View style={commonStyle.modal}>
            <View style={[commonStyle.modalContainer, style.container]}>
                <View>
                    <View style={commonStyle.indent(15)}>
                        <Text style={style.title}>
                            Confirm arrival details of shipment
                        </Text>
                        <View style={commonStyle.line}/>
                    </View>

                    <View>
                        <View style={commonStyle.indent(25)}/>
                        <Text style={style.text}>
                            <Text style={commonStyle.textBold}>Date arrived: </Text>
                            <Text>{Moment().format('DD MMM YYYY')}</Text>
                        </Text>
                        <Text style={style.text}>
                            <Text style={commonStyle.textBold}>Time arrived: </Text>
                            <Text>{Moment().format('HH[h]mm')}</Text>
                        </Text>
                    </View>
                    <View style={{display:'flex', flexDirection: 'row'}}>
                        <View style={{flex: 1.2}}>
                            <Text
                                accessibilityLabel={'Containers received' + " Label"}
                                style={[commonStyle.textBold, style.text]}>
                                Containers received :
                            </Text>
                        </View>
                        <View style={{flex: 1, mnarginRight: '10%'}}>
                            <TextInputValid
                                keyboardType={'numeric'}
                                accessibilityLabel={'Containers received' + " Input Field"}
                                style={[commonStyle.input, commonStyle.colorBlack, style.text]}
                                onChangeText={value => {
                                    props.changeContainerCount(value)
                                }}
                                value={props.containerReceived}
                            />
                        </View>
                    </View>
                    <Text style={style.text}>
                        <Text style={commonStyle.textBold}>Containers Shipped: </Text>
                        <Text>{props.containerCount}</Text>
                    </Text>
                    <Text style={style.text} onPress={() => {
                        props.attachFile()
                    }}>
                        <Text style={[commonStyle.textBold, {color: '#0808cc'}]}>Add Attachment and confirm
                            arrival.</Text>
                    </Text>
                </View>

                <View style={style.btnsContainer}>
                    <View style={[commonStyle.line, commonStyle.indent(15)]}/>
                    <View style={commonStyle.rowBetween}>
                        <TouchableOpacity
                            onPress={props.onConfirm}
                        >
                            <Text style={style.confirmBtnText}>Confirm Arrival</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={props.closeModal}
                        >
                            <Text style={style.text}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </Modal>
);

ArrivalEventModal.propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func,
    onConfirm: PropTypes.func,
};

const style = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
    },
    title: {
        fontSize: VARIABLES.H3_SIZE,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    text: {
        fontSize: VARIABLES.H3_SIZE,
    },
    btnsContainer: {
        width: '100%',
    },
    confirmBtnText: {
        fontSize: VARIABLES.H2_SIZE,
        fontWeight: 'bold',
    }
});