import React, {PureComponent, Fragment} from 'react';
import {View, Text} from 'react-native';
import {partMasterStyle as style} from "./part-master.style";
import unimplemented from "../../utils/unimplemented";
import {FormSplitter} from "../../components/form-splitter.component";
import {PartMasterView} from "../../models/part-master-view";
import BackendApi from "../../services/backend";
import {FormButton} from "../../components/form-button.component";
import {parts} from "../../constants/accessability";

type Props = {
    partMaster: PartMasterView,
};

export class OrganizationData extends PureComponent<Props> {
    editPartMaster() {
        const {partMaster} = this.props;

        this.props.navigation.navigate('EditPartMaster', {partMaster});
    }

    addAttachment() {
        const {partMaster: {partMasterId}} = this.props;

        this.props.navigation.navigate('SaveAttachmentEvent', {
            partMasterId, updateTimeLine: () =>
                BackendApi.getPartMasterTimeLine(partMasterId)
        });
    }

    renderOrgItem(title, value, accessibilityTitleLabel, accessibilityValueLabel) {
        return (
            <Fragment>
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
            </Fragment>
        );
    }

    renderAlternatePartNumbers(title) {
        const {orgPartNumber, orgPartName, orgCageCode, orgDescription, mpn} = this.props.partMaster;
        console.log(this.props.partMaster);
        let numbers = this.props.alternatePartNumbers && this.props.alternatePartNumbers;
        numbers = numbers && numbers.filter((item) => {
                return mpn !== item.partNumber
            });
        return (
            <Fragment>
                <Text
                    style={[style.secondaryFieldLabel, {display: 'flex', justifyContent: 'center'}]}>
                    {title}
                </Text>
                {this.props.alternatePartNumbers && numbers && numbers.length > 0 ? numbers.map((number) => {
                    return (
                        <View style={{display: 'flex', flexDirection: 'row', marginTop: 5}}>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Text
                                    style={[style.secondaryFieldValue, {marginRight: 5}]}>
                                    <Text style={{fontWeight: 'bold'}}>PART#: </Text>
                                    {number.partNumber + ',' || 'N/A,'}
                                </Text>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Text
                                    style={style.secondaryFieldValue}>
                                    <Text style={{fontWeight: 'bold'}}>ORG: </Text>
                                    {number.organization.name || 'N/A'}
                                </Text>
                            </View>
                        </View>
                    )
                }) : <Text
                    style={[style.secondaryFieldValue, {marginRight: 5}]}>
                    <Text style={{fontWeight: 'bold'}}>N/A</Text>
                </Text> }
            </Fragment>
        )
    }

    render() {
        const {orgPartNumber, orgPartName, orgCageCode, orgDescription} = this.props.partMaster;
        return (
            <View>
                <FormSplitter text="Organization Data"/>
                <View style={style.sectionContent}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        <View style={{flex: 0.5, alignItems: 'stretch'}}>
                            {this.renderOrgItem('PART #', orgPartNumber, parts.orgNumberLabel, parts.orgNumber)}
                            {this.renderOrgItem('CAGE Code', orgCageCode)}
                        </View>
                        <View style={{flex: 0.5, alignItems: 'stretch'}}>
                            {this.renderOrgItem('PART NAME', orgPartName, parts.orgNameLabel, parts.orgName)}
                            {this.renderOrgItem('Description', orgDescription)}
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'stretch'}}>
                        {this.renderAlternatePartNumbers('Alternate Part Numbers')}
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 15}}>
                        <View style={{flexBasis: '45%'}}>
                            <FormButton text="Edit Part Master" onPress={() => this.editPartMaster()}/>
                        </View>
                        <View style={{flexBasis: '45%'}}>
                            <FormButton text="Add Attachment" onPress={() => this.addAttachment()}/>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}