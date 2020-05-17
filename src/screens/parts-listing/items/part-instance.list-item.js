import React, { PureComponent } from 'react';
import { View, TouchableOpacity} from 'react-native';
import { Text } from 'native-base';
import { ServerImage } from "../../../components/server-image.component";
import { CreatedDate } from "../../../components/created-date.component";
import { commonStyle } from "../../../styles/common.style";
import { InteractionPanel } from "../../../components/interaction-buttons";
import { partListingStyle as style } from "../part-listing.style";
import BackendApi from "../../../services/backend";
import { PartInstanceView } from "../../../models/part-instance-view";
import {general, parts} from "../../../constants/accessability";

type Props = {
    onPress: Function;
    item: PartInstanceView;
    noInteractionPanel: boolean;
}

export class PartInstanceListItem extends PureComponent<Props> {
    render() {
        const { item, onPress, noInteractionPanel } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={item.partInstanceId}
                style={style.partItemContainer}
                onPress={onPress}
                accessibilityLabel={general.partInstanceListItem}
            >
                <View style={[style.flexRow, style.flexSpaceBetween, style.gutter]}>
                    <View style={commonStyle.flex(0.6)}>
                        <Text style={style.titleText}
                            accessibilityLabel={parts.partName}>Part #: {item.partMaster ? item.partMaster.mpn : 'N/A'}</Text>
                        <Text style={style.titleText}
                              accessibilityLabel={parts.partInstanceName}>Part: {item.name || 'N/A'}</Text>
                    </View>
                    <View style={[commonStyle.flex(0.4), commonStyle.alignEnd]}>
                        <CreatedDate date={item.createdAt}/>
                    </View>
                </View>
                <View style={[style.flexRow, style.flexSpaceBetween, style.gutter]}>
                    <View style={commonStyle.flex(0.6)}>
                        <Text style={[style.infoText, style.infoTextTitle]}
                              accessibilityLabel={parts.serialNumberLabel}>SERIAL NUMBER</Text>
                        <Text style={[style.infoText, style.gutter]}
                              accessibilityLabel={parts.serialNumberValue}>{item.serialNumber || 'N/A'}</Text>
                        <Text style={[style.infoText, style.infoTextTitle]}
                              accessibilityLabel={parts.batchNumberLabel}>BATCH NUMBER</Text>
                        <Text style={style.infoText}
                              accessibilityLabel={parts.batchNumberValue}>{item.batchNumber || 'N/A'}</Text>
                    </View>
                    <ServerImage style={commonStyle.flex(0.4)}
                                 uri={item.images && item.images[0] ? item.images[0].path : item.partMaster.image.path}/>
                </View>
                {!noInteractionPanel &&
                <View style={commonStyle.alignEnd}>
                    <InteractionPanel
                        isFollowed={item.isFollowed}
                        onFollow={() => BackendApi.followPartInstance(item.partInstanceId)}
                        onUnfollow={() => BackendApi.unfollowPartInstance(item.partInstanceId)}
                        onPressShare={() => {
                        }}
                        onPressViewMore={onPress}
                    />
                </View>
                }
            </TouchableOpacity>
        );
    }
}
