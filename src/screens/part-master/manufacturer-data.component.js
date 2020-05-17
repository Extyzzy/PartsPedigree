import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button, Label } from 'native-base';
import Collapsible from 'react-native-collapsible';
import { partMasterStyle as style } from "./part-master.style";
import Foundation from 'react-native-vector-icons/Foundation';
import { ServerImage } from "../../components/server-image.component";
import { FormSplitter } from "../../components/form-splitter.component";
import { CreatedDate } from "../../components/created-date.component";
import { commonStyle } from "../../styles/common.style";
import { parts, general } from "../../constants/accessability";
import { PartMasterView } from "../../models/part-master-view";

type Props = {
    partMaster: PartMasterView
};

export class ManufacturerData extends PureComponent<Props> {
    state = {
        viewMore: false,
    };

    toggleViewMore() {
        this.setState({ viewMore: !this.state.viewMore });
    }

    onPressImage() {
        if (this.props.partMaster.image && this.props.partMaster.image.path) {
            this.props.navigation.navigate('ImageView', { urls: [this.props.partMaster.image.path] });
        }
    }

    renderField(title, value, accessibilityTitleLabel, accessibilityValueLabel) {
        return (
            <View style={style.fieldLabelSection}>
                <Text
                    style={style.secondaryFieldLabel}
                    accessibilityLabel={accessibilityTitleLabel}>
                    {title}
                </Text>
                <Text
                    style={style.secondaryFieldValue}
                    accessibilityLabel={accessibilityValueLabel}>
                    {value || 'N/A'}
                </Text>
            </View>
        );
    }

    renderBoolField(title, value) {
        return this.renderField(title, value ? 'Yes' : 'No');
    }

    render() {
        const { partMaster } = this.props;
        if (!partMaster) {
            return null;
        }

        return (
            <View>
                <FormSplitter text="Manufacturer Data"/>
                <View style={style.sectionContent}>
                    <View style={style.nameDateRow}>
                        <View style={{ marginBottom: 5, flex: 1 }}>
                            <Text
                                style={style.primaryFieldLabel}
                                accessibilityLabel={parts.partNumber + partMaster.mpn}>
                                PART #: {partMaster.mpn}
                            </Text>
                            <Text
                                style={style.primaryFieldValue}
                                accessibilityLabel={parts.partName + partMaster.mpn}>
                                NAME: {partMaster.partName}
                            </Text>
                        </View>
                        <CreatedDate date={partMaster.createdAt}/>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 0.6 }}>
                            {this.renderField('ORIGINAL EQUIPMENT MANUFACTURER',
                                partMaster.oem,
                                parts.oemLabel,
                                parts.oemValue)
                            }
                            {this.renderField('COUNTRY OF ORIGIN',
                                partMaster.country.name,
                                parts.countryLabel,
                                parts.countryValue)
                            }
                        </View>

                        <TouchableOpacity
                            style={{ flex: 0.4, height: 100 }}
                            onPress={() => this.onPressImage()}
                            activeOpacity={0.5}
                        >
                            <ServerImage
                                uri={partMaster.image && partMaster.image.path}
                            />
                        </TouchableOpacity>
                    </View>
                    {this.renderField('DESCRIPTION', partMaster.description)}
                    <Collapsible collapsed={!this.state.viewMore}>
                        <View style={commonStyle.flexRow}>
                            <View style={{flexBasis: '48%'}}>
                                {this.renderField('Export control classification', partMaster.exportControlClassification)}
                                {this.renderField('Status', partMaster.status && partMaster.status.name)}
                                {this.renderField('International Commodity Code', partMaster.internationalCommodityCode)}
                                {this.renderField('NATO Federal Supply Class', partMaster.federalSupplyClass)}
                                {this.renderField('NATO National Item Identification Number', partMaster.nationalItemIdentificationNumber)}
                                {this.renderBoolField('IUID required', partMaster.isIuidRequired)}
                                {this.renderField('Net weight', partMaster.netWeight)}
                                {this.renderField('Net Weight Unit of Measure', partMaster.netWeightUOM && partMaster.netWeightUOM.name)}
                                {this.renderField('Gross weight', partMaster.grossWeight)}
                                {this.renderField('Gross Weight Unit of Measure', partMaster.grossWeightUOM && partMaster.grossWeightUOM.name)}
                                {this.renderBoolField('LLC - Life Limited Equipment Indicator', partMaster.isLifeLimited)}
                                {this.renderField('SLED Days', partMaster.shelfLifeExpiration)}
                            </View>
                            <View style={{flexBasis: '48%'}}>
                                {this.renderField('HAZMAT 1', partMaster.hazmat1)}
                                {this.renderField('HAZMAT 2', partMaster.hazmat2)}
                                {this.renderField('HAZMAT 3', partMaster.hazmat3)}
                                {this.renderField('UID Construct Number', partMaster.uidConstructNumber)}
                                {this.renderField('Serialized', partMaster.serialized)}
                                {this.renderBoolField('Lot / Batch Managed Required', partMaster.isBatchManagedRequired)}
                                {this.renderBoolField('Software indicator', partMaster.isSoftware)}
                                {this.renderBoolField('Electrostatic Sensitive Device', partMaster.isElectrostaticSensitiveDevice)}
                                {this.renderBoolField('Rotables Indicator', partMaster.isRotables)}
                                {this.renderBoolField('Times Lmited Indicator', partMaster.isTimesLimited)}
                                {this.renderField('LLA', partMaster.lifeLimitedAssembly)}
                                {this.renderField('Unit of Measure', partMaster.uom.name)}
                                {this.renderField('CAGE Code', partMaster.manufacturerCage)}
                            </View>
                        </View>
                    </Collapsible>
                    <View style={style.exportViewMoreRow}>
                        {
                            partMaster.exportControlledPart ?
                                <View style={[commonStyle.flexRow, commonStyle.alignCenter]}>
                                    <Foundation name="alert" size={20} color="#CB3538" style={style.alertIcon}/>
                                    <Text
                                        style={[style.exportFieldCaption]}
                                        accessibilityLabel={parts.export}>
                                        Export Controlled Part
                                    </Text>
                                </View> :
                                <View/>
                        }
                        <Button transparent style={style.smallGrayBtn} accessibilityLabel={general.viewMoreButton}>
                            <Label style={style.smallGray} onPress={() => this.toggleViewMore()}>
                                {this.state.viewMore ? 'View less ‹‹' : 'View more ››'}
                            </Label>
                        </Button>
                    </View>
                </View>
            </View>);
    }
}
