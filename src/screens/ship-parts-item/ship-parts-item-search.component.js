import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { partEventsStyle as style } from "../../styles/part-event.style";
import { commonStyle } from "../../styles/common.style";
import { StateService } from "../../services/state.service";
import { branch } from "baobab-react/higher-order";
import { SearchInput } from "../../components/search-input.component";
import { ImageUtils } from "../../utils/image-utils";
import BackendApi from "../../services/backend";
import { shipParts } from "../../constants/accessability";

type Props = {
    textSearch: string;
    listingScreen: string;
}

@branch({
    textSearch: ['textSearch'],
})
export class ShipPartsItemSearch extends PureComponent<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };

    state = {
      textSearch: ''
    };

    componentDidMount() {
        this.clearSearch();
    }

    clearSearch() {
      this.setState({textSearch: ''}, () => StateService.setTextSearch(null));
    }

    find() {
        this.context.getNavigation().navigate(this.props.listingScreen);
    }

    async filImage() {
        const image = await ImageUtils.showImagePicker();

        BackendApi.uploadRecognizaedImage(image);

        this.context.getNavigation().navigate('ImageAndFill', {
            type: 'search',
            feelData: ({ value }) => {
                StateService.setTextSearch(value);
                setTimeout(() => this.find(), 0);
            }
        });
    }

    render() {
        return (
            <View style={[style.padding, commonStyle.flexRow, commonStyle.alignCenter]}>
                <View style={commonStyle.flex(0.35)}>
                    <Text
                        style={style.searchText}
                        accessibilityLabel={shipParts.searchForParts}>
                        Search for a Part:
                    </Text>
                </View>
                <View style={commonStyle.flex(0.65)}>
                    <SearchInput
                        textSearch={this.state.textSearch}
                        onChangeText={textSearch => this.setState({textSearch})}
                        onPressFind={async () => {
                            await StateService.setTextSearchShipParts(true);
                            await StateService.setTextSearch(this.state.textSearch);
                            this.find();
                        }}
                        onPressImageAndFil={() => this.filImage()}
                        onPressClear={() => this.clearSearch()}
                    />
                </View>
            </View>
        );
    }
}

ShipPartsItemSearch.defaultProps = {
    listingScreen: 'PartItemsListing'
};