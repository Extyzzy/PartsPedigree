import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { savePartInstanceStyle as style } from './save-part-instance.style';
import { commonStyle } from "../../styles/common.style";
import { AddImageBtn } from "../../components/add-image.component";
import { PartImage } from "../../components/part-image.component";
import { ImageUtils } from "../../utils/image-utils";

export class PartInstanceImages extends PureComponent {
    static propTypes = {
        images: PropTypes.arrayOf(PropTypes.string),
        addImage: PropTypes.func,
        removeImage: PropTypes.func,
        onPressImage: PropTypes.func,
    };

    static defaultProps = {
        images: [],
        addImage() {},
        removeImage() {},
        onPressImage() {},
    };

    async addImage() {
        const image = await ImageUtils.showImagePicker();

        if (image) {
            this.props.addImage(image);
        }
    }

    removeImage(index: number) {
        this.props.removeImage(index);
    }

    renderImages() {
        return this.props.images.map((uri, index) => (
            <View key={uri + index}>
                <PartImage
                    onPress={() => this.props.onPressImage(index)}
                    onPressRemove={() => this.removeImage(index)} uri={uri}
                />
            </View>
        ));
    }

    render() {
        return (
            <ScrollView
                style={style.imagesContainer}
                horizontal
                contentContainerStyle={{ alignItems: 'center' }}
                showsHorizontalScrollIndicator={false}
            >
                <View style={commonStyle.paddingHorizontal(10)}>
                    <AddImageBtn onPress={() => this.addImage()}/>
                </View>
                {this.renderImages()}
            </ScrollView>
        );
    }
}
