import React, {Component, Fragment} from 'react';
import {View, ActivityIndicator, ScrollView, TouchableOpacity, Image, RefreshControl} from 'react-native';
import {branch} from "baobab-react/higher-order";
import {Content, Text} from 'native-base';
import Collapsible from 'react-native-collapsible';
import {partInstanceStyle as style} from './part-instance.style';
import {tabsHeaderStyle as styleTabs} from "../../components/tabs-header/tabs-heaeder.style";
import {FormSplitter} from "../../components/form-splitter.component";
import {commonStyle, COLORS} from "../../styles/common.style";
import {ServerImage} from "../../components/server-image.component";
import {CreatedDate} from "../../components/created-date.component";
import unimplemented from "../../utils/unimplemented";
import {InteractionPanel} from "../../components/interaction-buttons";
import {StateService} from "../../services/state.service";
import {PartInstanceView} from "../../models/part-instance-view";
import BackendApi from "../../services/backend";
import {Event} from "../../components/event/event.component";
import {EventModel} from "../../models/eventModel";
import {ShipPartView} from "../../models/ship-part-view";
import {DraftEvent} from "../../components/event/draft-event.component";
import {DraftEvent31303} from "../../components/event/draft-event31303.component";
import {Event81303ItemView} from "../../models/event81303ItemView";
import {parts} from "../../constants/accessability";
import {VARIABLES} from "../../styles/variables";
import {formatTimelineDate} from "../../utils/datetime";
import {Picker} from "../../components/picker/picker.component";
import PropTypes from "prop-types";

type Props = {
    partInstance: PartInstanceView;
    timeLine: Array<EventModel>;
    partInstanceDrafts: Array<ShipPartView>;
}

@branch({
    partInstance: ['partInstanceDetail'],
    timeLine: ['partInstanceTimeLine'],
    partInstanceDrafts: ['partInstanceDrafts'],
    event81303Drafts: ['event81303Drafts'],
    tags: ['tags'],
    alternatePartNumbers: ['alternatePartNumbers'],
    attachmentsTimeline: ['attachmentsTimeline'],
    attachmentsTimelineByTag: ['attachmentsTimelineByTag'],
    activeTabPartMaster: ['activeTabPartMaster'],
})

export class PartInstanceDetail extends Component<Props> {
    static propTypes = {
        activeTabPartMaster: PropTypes.string,
    };

    static defaultProps = {
        activeTabPartMaster: null,
    };

    state = {
        viewMorePartMaster: false,
        viewMorePartInstance: false,
        refreshing: false,
        tabs: ['Timeline', 'Documents'],
        activeTabTags: false,
        titleTag: '',
    };

    constructor(props) {
        super(props);
        const {activeTabPartMaster} = this.props;
        StateService.setAttachmentsTimeline([]);
        if (activeTabPartMaster === 'Documents') {
            const {partInstanceId} = this.props.navigation.state.params;
            BackendApi.getAttachments('instance', partInstanceId)
        }
    }

    componentDidMount() {
        const {partInstanceId} = this.props.navigation.state.params;
        BackendApi.getPartInstanceDetail(partInstanceId);
        BackendApi.getPartInstanceTimeLine(partInstanceId);
        BackendApi.getUserTags();
    }

    refreshData = async () => {
        this.setState({refreshing: true});
        const {partInstanceId} = this.props.navigation.state.params;
        await BackendApi.getPartInstanceDetail(partInstanceId);
        await BackendApi.getPartInstanceTimeLine(partInstanceId);
        await BackendApi.getAttachments('instance', partInstanceId);

        this.setState({
            refreshing: false
        });
    };

    toggleViewMorePartMaster() {
        this.setState({viewMorePartMaster: !this.state.viewMorePartMaster});
    }

    onPressAttachmentEvent(event) {
        const screen = Event.getScreenNameByEventypeId(event.eventTypeId);
        this.props.navigation.navigate(screen, {eventId: event.eventId});
    }

    toggleViewMorePartInstance() {
        this.setState({viewMorePartInstance: !this.state.viewMorePartInstance});
    }

    onPressImage(urls, index = 0) {
        this.props.navigation.navigate('ImageView', {urls, index});
    }

    updatePartInstance() {
        const {partInstance} = this.props;

        StateService.setPartMaster(partInstance.partMaster);
        this.props.navigation.navigate('UpdatePartInstance', {
            partInstance: {...partInstance},
        })
    }

    addAttachment() {
        const {partInstance: {partInstanceId}} = this.props;

        this.props.navigation.navigate('SaveAttachmentEvent', {
            partInstanceId, updateTimeLine: () =>
                BackendApi.getPartInstanceTimeLine(partInstanceId)
        });
    }

    renderPartInstanceImages(images: Array<{ path: string; imageId: string; }> = []) {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                accessibilityLabel={parts.partInstanceImages}
            >
                {images.map((image, index) => (
                    <TouchableOpacity
                        onPress={() => this.onPressImage(images.map(i => i.path), index)}
                        activeOpacity={0.5}
                        key={image.imageId}
                        style={style.partInstanceImage}
                    >
                        <ServerImage uri={image.path}/>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }

    renderAddAttachmentBtn() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.flexRow}
                onPress={() => this.addAttachment()}
            >
                <Text
                    style={style.editBtnText}
                    accessibilityLabel={parts.partAddAttachment}>
                    Add attachment
                </Text>
            </TouchableOpacity>
        );
    }

    renderEditBtn() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.flexRow}
                onPress={() => this.updatePartInstance()}
            >
                <Image style={style.editIcon} source={require('../../assets/icons/edit_icon.png')}/>
                <Text
                    style={style.editBtnText}
                    accessibilityLabel={parts.partEdit}>
                    Edit
                </Text>
            </TouchableOpacity>
        );
    }

    renderEvent(event: EventModel) {
        return (
            <View key={event.eventId} style={commonStyle.indent(4)}>
                <Event event={event}/>
            </View>
        )
    }

    renderDraft(draft: ShipPartView) {
        return (
            <View key={draft.eventDraftId} style={commonStyle.indent(4)}>
                <DraftEvent event={draft}/>
            </View>
        )
    }

    renderDraft31303(draft: Event81303ItemView) {
        return (
            <View key={draft.event81303DraftId} style={commonStyle.indent(4)}>
                <DraftEvent31303 event={draft}/>
            </View>
        )
    }

    renderField(title, value, accessibilityTitleLabel, accessibilityValueLabel) {
        return (
            <Fragment>
                <Text
                    style={[style.text, commonStyle.textBold]}
                    accessibilityLabel={accessibilityTitleLabel}>
                    {title}
                </Text>
                <Text
                    style={[style.text, commonStyle.indent(5)]}
                    accessibilityLabel={accessibilityValueLabel}>
                    {value || 'N/A'}
                </Text>
            </Fragment>
        );
    }

    renderBoolField(title, value) {
        return this.renderField(title, value ? 'Yes' : 'No');
    }

    hasDuplicates(attachments) {
        let valuesSoFar = {};
        for (let i = 0; i < attachments.length; ++i) {
            let value = attachments[i].attachmentId;
            valuesSoFar[value] = attachments[i];
        }
        let array = [];

        for (let value in valuesSoFar) {
            array.push(valuesSoFar[value])
        }
        return array;
    }

    renderAttachmentTimeline() {
        const {attachmentsTimeline, attachmentsTimelineByTag} = this.props;
        const {activeTabTags} = this.state;

        let attachments = activeTabTags ? attachmentsTimelineByTag : attachmentsTimeline;
        if (attachments && attachments.length === 0) {
            return null
        }
        let resultAttachments;
        if (attachments) {
            resultAttachments = this.hasDuplicates(attachments);
        } else resultAttachments = [];
        return (
            resultAttachments && resultAttachments.map((data, i) => {
                return (
                    <View key={i} style={[
                        commonStyle.flexRow,
                        commonStyle.paddingHorizontal(15),
                        i === resultAttachments.length - 1 ? {marginBottom: 50} : null
                    ]}>
                        <ServerImage
                            style={{width: 70, height: 70, marginRight: 20, flex: 0.2}}
                            uri={data.path}
                        />
                        <View style={{flex: 0.8, marginBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20}}>
                                <TouchableOpacity
                                    onPress={() => this.onPressAttachmentEvent(data.event)}
                                    style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                                    <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>EVENT: </Text>
                                    <Text style={{
                                        color: '#3960bb',
                                        fontSize: VARIABLES.H6_SIZE,
                                    }}>{data.event.eventTypeName.toLocaleUpperCase()}</Text>
                                </TouchableOpacity>
                                <View style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                                    <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>DATE: </Text>
                                    <Text style={[commonStyle.inputLabel]}>{formatTimelineDate(data.createdAt)}</Text>
                                </View>
                            </View>
                            <View style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>TAGS: </Text>
                                <Text style={[commonStyle.inputLabel, {
                                    flex: 1,
                                    flexWrap: 'wrap'
                                }]}>{data.tags && data.tags.map((tag, i) => <>
                                    {tag.name + ', '}
                                    </>
                                )}</Text>
                            </View>
                            <View style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>DESCRIPTION: </Text>
                                <Text style={[commonStyle.inputLabel, {flex: 1, flexWrap: 'wrap'}]}>
                                    {data.description}
                                </Text>
                            </View>
                            <View style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                                <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>AUTHOR: </Text>
                                <Text style={[commonStyle.inputLabel, {flex: 1, flexWrap: 'wrap'}]}>
                                    {data.organization.name ? data.organization.name :  data.user.firstName + ' ' + data.user.lastName}
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            })
        )
    }

    renderAttachments() {
        const {titleTag} = this.state;
        const {attachmentsTimeline} = this.props;

        return (
            <>
            <FormSplitter text="- ALL ATTACHMENTS -" style="green"/>
            <View style={[commonStyle.flexRow]}>
                <View style={[commonStyle.rowAround, commonStyle.paddingVertical(10), {flex: 1}]}>
                    <Text style={[
                        styleTabs.tabText,
                        styleTabs.tabTextWhiteBg,
                    ]}>SORT/FILTER:</Text>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            this.setState({activeTabTags: false, titleTag: ''})
                        }}>
                        <Text
                            style={[
                                styleTabs.tabText,
                                styleTabs.tabTextWhiteBg,
                                !this.state.activeTabTags && styleTabs.activeTabTextWhiteBg
                            ]}
                            accessibilityLabel={"DATE"}
                        >DATE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            this.setState({activeTabTags: true}
                            )
                        }}>
                        <View
                            style={[
                                styleTabs.tabText,
                                styleTabs.tabTextWhiteBg,
                                this.state.activeTabTags && styleTabs.activeTabTextWhiteBg
                            ]}
                            accessibilityLabel={"TAG"}
                        >
                            <Picker
                                styles={{
                                    tabText: styleTabs.tabText,
                                    tabTextWhiteBg: styleTabs.tabTextWhiteBg,
                                    activeTabTextWhiteBg: this.state.activeTabTags && styleTabs.activeTabTextWhiteBg
                                }}
                                items={this.props.tags.map(c => ({title: c.name, value: c.tagId}))}
                                title="Tag"
                                error={''}
                                defaultText={titleTag || 'TAG'}
                                selected={'123'}
                                onSelect={({title, value}) => {
                                    StateService.setAttachmentsTimelineByTag(attachmentsTimeline, value);

                                    this.setState({titleTag: title, activeTabTags: true})
                                }}
                                onCancel={() => this.setState({activeTabTags: false, titleTag: ''})}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            { this.renderAttachmentTimeline() }

            </>
        )
    }

    renderTimeline() {
        const {
            partInstanceDrafts,
            event81303Drafts,
            timeLine
        } = this.props;

        return (
            <>
            <FormSplitter text="- PARTS PEDIGREE TIMELINE -" style="green"/>
            {!!event81303Drafts &&
            event81303Drafts.map(d => this.renderDraft31303(d))
            }
            {!!partInstanceDrafts &&
            partInstanceDrafts.map(d => this.renderDraft(d))
            }
            {timeLine ? timeLine.map(event => this.renderEvent(event)) :
                <ActivityIndicator/>
            }
            <View style={{height: 60}}/>
            </>
        )
    }

    render() {
        if (!this.props.partInstance) {
            return (<ActivityIndicator/>);
        }

        const partInstance = this.props.partInstance;
        const partMaster = partInstance.partMaster;

        if (!partMaster) {
            return (
                <Content>
                    <View style={style.stubContainer}>
                        <Text style={style.titleText}>
                            It doesn't seem to hava a Part Master
                        </Text>
                    </View>
                </Content>
            )
        }
        return (
            <Content refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                     onRefresh={this.refreshData}/>}>
                <FormSplitter text="Part Master Data"/>
                <View style={style.container}>
                    <View style={[commonStyle.rowBetween, commonStyle.indent(10)]}>
                        <View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('PartMaster', {partMasterId: partMaster.partMasterId})}>
                                <Text
                                    style={style.titleText}
                                    accessibilityLabel={parts.partNumber + (partMaster.mpn && partMaster.mpn.toUpperCase())}>
                                    PART #: <Text
                                    style={[style.titleText,  commonStyle.color(COLORS.blue)]}>{partMaster.mpn && partMaster.mpn.toUpperCase()}</Text>
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={style.titleText}
                                accessibilityLabel={parts.partName + partMaster.partName}>
                                NAME: {partMaster.partName}
                            </Text>
                        </View>
                        <CreatedDate date={partMaster.createdAt}/>
                    </View>
                    <View style={[commonStyle.flexRow, commonStyle.indent()]}>
                        <View style={commonStyle.flex(0.6)}>
                            {this.renderField('ORIGINAL EQUIPMENT MANUFACTURER',
                                partMaster.oem,
                                parts.oemLabel,
                                parts.oemValue)
                            }
                            {this.renderField('ORGANIZATION PART NUMBER',
                                partMaster.orgPartNumber,
                                parts.orgNumberLabel,
                                parts.orgNumber)
                            }
                            {this.renderField('ORGANIZATION PART NAME',
                                partMaster.orgPartName,
                                parts.orgNameLabel,
                                parts.orgName)
                            }
                        </View>
                        {!!partMaster.image && !!partMaster.image.path &&
                        <TouchableOpacity
                            onPress={() => this.onPressImage([partMaster.image.path])}
                            aciveOpacity={0.5}
                            style={commonStyle.flex(0.4)}
                        >
                            <ServerImage style={style.parMasterImage} uri={partMaster.image && partMaster.image.path}/>
                        </TouchableOpacity>
                        }
                    </View>
                    <Collapsible collapsed={!this.state.viewMorePartMaster}>
                        <View style={commonStyle.flexRow}>
                            <View style={{flexBasis: '48%'}}>
                                {this.renderField('Export control classification', partMaster.exportControlClassification)}
                                {this.renderField('Status', partMaster.status && partMaster.status.name)}
                                {this.renderField('International Commodity Code', partMaster.internationalCommodityCode)}
                                {this.renderField('NATO Federal Supply Class', partMaster.federalSupplyClass)}
                                {this.renderField('NATO National Item Identification Number', partMaster.nationalItemIdentificationNumber)}
                                {this.renderBoolField('IUID required', partMaster.isIuidRequired)}
                                {this.renderField('Net weight', partMaster.netWeight)}
                                {this.renderField('Net Weight UoM', partMaster.netWeightUOM && partMaster.netWeightUOM.name)}
                                {this.renderField('Gross weight', partMaster.grossWeight)}
                                {this.renderField('Gross Weight UoM', partMaster.grossWeightUOM && partMaster.grossWeightUOM.name)}
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
                            </View>
                        </View>
                    </Collapsible>
                    <View style={commonStyle.alignEnd}>
                        <InteractionPanel
                            isFollowed={partMaster.isFollowed}
                            onFollow={() => BackendApi.followPartMaster(partMaster.partMasterId)}
                            onUnfollow={() => BackendApi.unfollowPartMaster(partMaster.partMasterId)}
                            onPressShare={unimplemented}
                            onPressViewMore={() => this.toggleViewMorePartMaster()}
                            viewMore={this.state.viewMorePartMaster}
                        />
                    </View>
                </View>
                <FormSplitter text="Part Instance Data"/>
                <View style={style.container}>
                    <View style={[commonStyle.rowBetween, commonStyle.indent(10)]}>
                        <View>
                            <Text
                                style={style.titleText}
                                accessibilityLabel={parts.partInstanceName}>
                                NAME: {partInstance.name}
                            </Text>
                        </View>
                        <CreatedDate date={partInstance.createdAt}/>
                    </View>
                    <View style={[commonStyle.rowBetween, commonStyle.indent()]}>
                        <View style={commonStyle.flex(0.4)}>
                            {this.renderField('SERIAL NUMBER',
                                partInstance.serialNumber,
                                parts.serialNumberLabel,
                                parts.serialNumberValue)
                            }
                            {this.renderField('BATCH NUMBER',
                                partInstance.batchNumber,
                                parts.batchNumberLabel,
                                parts.batchNumberValue)
                            }
                            {this.renderField('Issue',
                                partInstance.issue,
                                parts.issueLabel,
                                parts.issueValue)
                            }
                            {this.renderField('OWNER ORGANIZATION',
                                partInstance.organization && partInstance.organization.name,
                                parts.orgLabel,
                                parts.orgValue)
                            }
                        </View>
                        <View style={commonStyle.flex(0.58)}>
                            {this.renderPartInstanceImages(partInstance.images || [])}
                        </View>
                    </View>
                    <Collapsible collapsed={!this.state.viewMorePartInstance}>
                        <View style={commonStyle.flexRow}>
                            <View style={{flexBasis: '48%'}}>
                                {this.renderField('Material Spec', partInstance.materialSpec || 'N/A')}
                                {this.renderField('Production Order Number', partInstance.productionOrderNumber || 'N/A')}
                                {this.renderField('CAGE code', partInstance.cageCode)}
                                {this.renderField('Item Unique Identifier Type',
                                    partInstance.iuidType && partInstance.iuidType.name)
                                }
                                {this.renderField('Item Unique Identifier', partInstance.iuid)}
                                {this.renderField('Part Description', partMaster.description)}
                                {this.renderField('Manufacture Date', partInstance.manufactureDate)}
                                {this.renderField('Commodity Code', partInstance.commodityCode)}
                                {this.renderField('TSN', partInstance.tsn)}
                                {this.renderField('TSMOH', partInstance.tsmoh)}
                            </View>
                            <View style={{flexBasis: '48%'}}>
                                {this.renderField('Country of Manufacture', partMaster.country && partMaster.country.name)}
                                {this.renderField('Export Control Classification Number', partMaster.exportControlClassification)}
                                {this.renderField('Airworthiness Certificate Tracking Number from original manufacturer',
                                    partInstance.airworthinessCertificateTrackingNumber)
                                }
                                {this.renderField('Acquisition', partInstance.acquisitionValue)}
                                {this.renderField('Acquisition Date', partInstance.acquisitionDate)}
                                {this.renderField('Condition', partInstance.condition && partInstance.condition.name)}
                                {this.renderField('CSN', partInstance.csn)}
                                {this.renderField('Price', partInstance.price)}
                            </View>
                        </View>
                    </Collapsible>
                    <View style={[commonStyle.justifyEnd, commonStyle.flexRow]}>
                        {this.renderAddAttachmentBtn()}
                        {this.renderEditBtn()}
                        <InteractionPanel
                            isFollowed={partInstance.isFollowed}
                            onFollow={() => BackendApi.followPartInstance(partInstance.partInstanceId)}
                            onUnfollow={() => BackendApi.unfollowPartInstance(partInstance.partInstanceId)}
                            onPressShare={unimplemented}
                            onPressViewMore={() => this.toggleViewMorePartInstance()}
                            viewMore={this.state.viewMorePartInstance}
                        />
                    </View>
                </View>
                <View style={[styleTabs.tabsContainer, styleTabs.whiteBg]}>
                    {this.state.tabs.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.5}
                            onPress={() => {
                                if (tab === 'Documents') {
                                    const {partInstanceId} = this.props.partInstance;
                                    BackendApi.getAttachments('instance', partInstanceId)
                                }
                                StateService.setActiveTabPartMaster(tab)
                            }}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                            <Text
                                style={[
                                    styleTabs.tabText,
                                    styleTabs.tabTextWhiteBg,
                                    this.props.activeTabPartMaster === tab && styleTabs.activeTabTextWhiteBg
                                ]}
                                accessibilityLabel={"Tab: " + tab.toUpperCase()}
                            >{tab.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {
                    this.props.activeTabPartMaster === 'Timeline' ?
                        this.renderTimeline() : this.renderAttachments()
                }
            </Content>
        );
    }
}
