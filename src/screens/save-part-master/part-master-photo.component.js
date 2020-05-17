import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { createPartMasterStyle as style } from './create-part-master.style';
import { FileData } from '../../models/file-data';
import { AddImageBtn } from "../../components/add-image.component";
import { PartImage } from "../../components/part-image.component";
import { ImageUtils } from "../../utils/image-utils";

type Props = {
    imageUrl: string;
    onChange: func;
}

export class PartMasterPhoto extends PureComponent<Props> {
    static propTypes = {
        imageUrl: PropTypes.string,
        onChange: PropTypes.func,
        onPressImage: PropTypes.func,
    };

    static defaultProps = {
        imageUrl: null,
        onChange() {},
        onPressImage() {},
    };

    componentDidMount() {
        if (this.props.imageUrl) {
            this.setState({ image: new FileData(this.props.imageUrl) })
        }
    }

    async selectImage() {
        const image = await ImageUtils.showImagePicker();

        if (image) {
            this.props.onChange(image);
        }
    }

    removeImage() {
        this.props.onChange(null);
    }

    render() {
        return (
            <View style={style.photoContainer}>
                {!!this.props.imageUrl &&
                <PartImage
                    onPress={this.props.onPressImage}
                    uri={this.props.imageUrl}
                    onPressRemove={() => this.removeImage()}
                />
                }
                <AddImageBtn onPress={() => this.selectImage()}/>
            </View>
        );
    }
}
