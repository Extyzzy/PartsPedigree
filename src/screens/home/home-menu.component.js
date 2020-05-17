import React from 'react';
import { Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import { commonStyle } from "../../styles/common.style";
import { homeScreen } from "../../constants/accessability";
import { MenuContainer, MenuItem } from '../../components/modal-menu/modal-menu.component';

export const HomeMenuModal = props => (
    <Modal
        visible={props.visible}
        onRequestClose={() => {}}
        transparent
        accessibilityLabel={homeScreen.addModalPopup}
    >
        <View style={commonStyle.modal}>
            <MenuContainer closeModal={props.closeModal}>
                <MenuItem text="Create Part Master" value="CreatePartMaster" onPress={props.selectMenu} />
                <MenuItem text="Ship Parts" value="ShipParts" onPress={props.selectMenu} />
                <MenuItem text="Receive Parts" value="ReceivePartsNonApi" onPress={props.selectMenu}/>
                <MenuItem text="Create 8130-3" value="Save8130Screen" onPress={props.selectMenu} />
            </MenuContainer>
        </View>
    </Modal>
);

HomeMenuModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    selectMenu: PropTypes.func.isRequired,
};
