import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { commonStyle } from "../../styles/common.style";
import { ScreenDetector } from "../../utils/screen-detector";

export class ImageView extends Component {
    images: Array;
    index: number;

    constructor(props) {
        super(props);
        const { urls, index = 0 } = props.navigation.state.params;
        this.images = urls.map(url => ({ url }));
        this.index = index;
        console.log(urls);
    }

    goBack() {
        this.props.navigation.goBack();
    }

    renderHeader() {
        return (
          <View style={{
              position: 'absolute',
              right: 10,
              top: 50,
              zIndex: 5000,
          }}>
              <TouchableOpacity
                  onPress={() => this.goBack()}
                  style={commonStyle.marginHorizontal(10)}
                  activeOpacity={0.5}
              >
                  <Image
                      style={commonStyle.size(30)}
                      source={require('../../assets/icons/delete_photo_icon.png')}
                  />
              </TouchableOpacity>
          </View>
        );
    }

    render() {
        return (
            <ImageViewer
                renderHeader={() => this.renderHeader()}
                index={this.index}
                onSwipeDown={() => this.goBack()}
                imageUrls={this.images}
            />
        );
    }
}
