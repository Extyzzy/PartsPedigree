import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Text, ScrollView } from 'react-native';
import { ImageAndFillStyle as style } from './image-and-fill.style';
import { commonStyle } from "../../styles/common.style";
import { MenuContainer, MenuItem } from '../../components/modal-menu/modal-menu.component';

type Props = {
    segment: string;
    closeModal: Function,
    items: { text: string; value: string; }
}

export const FillModal = (props: Props) => (
    <Modal
        visible={!!props.segment}
        transparent
    >
        <View style={[commonStyle.modal, style.modal]}>
            <View style={style.feelTextContainer}>
                <Text style={style.feelText}>{props.segment}</Text>
            </View>
            <MenuContainer closeModal={props.closeModal}>
                <ScrollView
                    style={style.menuContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        props.items.map(i =>
                            (<MenuItem
                                noBorder={props.items.length === 1}
                                key={i.value}
                                text={i.text}
                                value={i.value}
                                onPress={() => props.selectItem(i)}
                            />))
                    }
                </ScrollView>
            </MenuContainer>
        </View>
    </Modal>
);

FillModal.propTypes = {
    visible: PropTypes.bool,
    closeModal: PropTypes.func.isRequired,
    items: PropTypes.array,
    selectItem: PropTypes.func.isRequired,
};

FillModal.defaultProps = {
    items: []
};
