import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { ServerImage } from "../../../components/server-image.component";
import { CreatedDate } from "../../../components/created-date.component";
import { commonStyle } from "../../../styles/common.style";
import { InteractionPanel } from "../../../components/interaction-buttons";
import { partListingStyle as style } from "../part-listing.style";
import BackendApi from "../../../services/backend";
import { PartMaster } from "../../../models/part-master";
import { general, parts } from "../../../constants/accessability";

type Props = {
    onPress: Function;
    item: PartMaster;
}

export class PartMasterListItem extends PureComponent<Props> {
    render() {
        const { onPress, item } = this.props;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.partItemContainer}
                onPress={onPress}
                accessibilityLabel={general.partMasterListItem}
            >
                <View style={[style.flexRow, style.flexSpaceBetween, style.gutter]}>
                    <View style={commonStyle.flex(0.6)}>
                        <Text
                            style={style.titleText}
                            accessibilityLabel={parts.partNumber + item.mpn}>
                            Part #: {item.mpn}
                        </Text>
                        <Text
                            style={style.titleText}
                            accessibilityLabel={parts.partName + item.partName}>
                            Part: {item.partName}
                        </Text>
                    </View>
                    <View style={[commonStyle.flex(0.4), commonStyle.alignEnd]}>
                        <CreatedDate date={item.createdAt}/>
                    </View>
                </View>
                <View style={[style.flexRow, style.flexSpaceBetween, style.gutter]}>
                    <View style={commonStyle.flex(0.6)}>
                        <Text
                            style={[style.infoText, style.infoTextTitle]}
                            accessibilityLabel={parts.oemLabel}>
                            ORIGINAL EQUIPMENT MANUFACTURER
                        </Text>
                        <Text
                            style={[style.infoText, style.gutter]}
                            accessibilityLabel={parts.oemValue}>
                            {item.oem}
                        </Text>
                        <Text
                            style={[style.infoText, style.infoTextTitle]}
                            accessibilityLabel={parts.countryLabel}>
                            COUNTRY OF ORIGIN
                        </Text>
                        <Text
                            style={style.infoText}
                            accessibilityLabel={parts.countryValue}>
                            {item.country ? item.country.name : ''}
                        </Text>
                    </View>
                    <ServerImage style={commonStyle.flex(0.4)} uri={item.image && item.image.path}/>
                </View>
                <View style={commonStyle.alignEnd}>
                    <InteractionPanel
                        isFollowed={item.isFollowed}
                        onFollow={() => BackendApi.followPartMaster(item.partMasterId)}
                        onUnfollow={() => BackendApi.unfollowPartMaster(item.partMasterId)}
                        onPressFollow={() => {}}
                        onPressViewMore={onPress}
                    />
                </View>
            </TouchableOpacity>
        )
    }
}
