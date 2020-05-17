import React, {Component} from 'react';
import {StyleSheet, Modal, Text, View, Alert} from "react-native";
import {commonStyle} from "../../styles/common.style";
import {Button, Label} from "native-base";

const style = StyleSheet.create({
    saveBtn: {
        height: 40,
        marginTop: 15,
        backgroundColor: '#8e9cac',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderRadius: 15,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        alignItems: 'center',
    },
    btnText: {
        textAlign: 'center',
        flex: 1,
        color: 'black',
    },
    saveBtnText: {
        color: '#ffffff',
    }
});

export default class Cancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: true}
    }

    closeModal() {
        this.setState({visible: false});
        this.props.modal();
    }

    render() {
        return (
            Alert.alert(
                'Delete Confirmation',
                'Are you sure you want to delete Shipping Event Draft?',
                [{
                    text: 'Yes', onPress: () =>
                        BackendApi.deleteEventDraft(this.props.shipPart.eventDraftId).then(() => {
                            BackendApi.refreshPartInstanceTimeLine();
                        })
                }, {
                    text: 'No', onPress: () => {},
                }]
            )
            // {/*<Modal visible={this.state.visible}*/}
            //        {/*transparent*/}
            //        {/*onRequestClose={() => {}}*/}
            // {/*>*/}
            //     {/*<View style={commonStyle.modal}>*/}
            //         {/*<View style={[commonStyle.modalContainer, {*/}
            //             {/*alignItems: 'center',*/}
            //             {/*justifyContent: 'center', height: 130, width: 330*/}
            //         {/*}]}>*/}
            //             {/*<View style={{paddingLeft: 15, paddingRight: 15, justifyContent: 'center'}}>*/}
            //                 {/*<Text style={{fontSize: 14}}>Are you sure you want to leave this screen? Your changes*/}
            //                     {/*will*/}
            //                     {/*be*/}
            //                     {/*lost*/}
            //                     {/*if you leave.*/}
            //                 {/*</Text>*/}
            //                 {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
            //                     {/*<Button style={[style.saveBtn, {width: 120}]} onPress={ () => {this.props.leave(); this.setState({visible: false})}}>*/}
            //                         {/*<Label*/}
            //                             {/*style={[style.saveBtnText, {fontSize: 14}]}*/}
            //                         {/*>LEAVE*/}
            //                         {/*</Label>*/}
            //                     {/*</Button>*/}
            //                     {/*<Button style={[style.saveBtn, {width: 120}]} onPress={ () => {this.closeModal()}}>*/}
            //                         {/*<Label*/}
            //                             {/*style={[style.saveBtnText, {fontSize: 14}]}*/}
            //                         {/*>STAY*/}
            //                         {/*</Label>*/}
            //                     {/*</Button>*/}
            //                 {/*</View>*/}
            //             {/*</View>*/}
            //         {/*</View>*/}
            //     {/*</View>*/}
            // {/*</Modal>*/}
        )
    }
}
