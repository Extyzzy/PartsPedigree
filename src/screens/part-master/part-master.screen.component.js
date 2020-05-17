import React, {Component} from 'react';
import BackendApi from "../../services/backend";
import {Content, Text} from 'native-base';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import {ManufacturerData} from "./manufacturer-data.component";
import {OrganizationData} from "./organization-data.component";
import {branch} from "baobab-react/higher-order";
import {EventModel} from "../../models/eventModel";
import {commonStyle} from "../../styles/common.style";
import {FormSplitter} from "../../components/form-splitter.component";
import {Event} from "../../components/event/event.component";
import {PartMasterView} from "../../models/part-master-view";
import {FixedBottomBtn} from "../../components/fixed-bottom-btn.comonent";
import {Draft} from "../../models/draft";
import {DraftEvent} from "../../components/event/draft-event.component";
import {tabsHeaderStyle as style} from "../../components/tabs-header/tabs-heaeder.style";
import {partMasterStyle as stylePart} from "./part-master.style";
import {StateService} from "../../services/state.service";
import PropTypes from "prop-types";
import {ServerImage} from "../../components/server-image.component";
import {formatTimelineDate} from "../../utils/datetime";
import {Notification} from "../../models/notification";
import {VARIABLES} from "../../styles/variables";
import {Picker} from "../../components/picker/picker.component";

type Props = {
    partMaster: PartMasterView,
    timeLine: Event
};

@branch({
    partMaster: ['partMasterDetail'],
    timeLine: ['partMasterTimeLine'],
    partMasterDrafts: ['partMasterDrafts'],
    activeTabPartMaster: ['activeTabPartMaster'],
    attachmentsTimeline: ['attachmentsTimeline'],
    attachmentsTimelineByTag: ['attachmentsTimelineByTag'],
    tags: ['tags'],
    alternatePartNumbers: ['alternatePartNumbers']
})

export class PartMasterScreen extends Component<Props> {
    static propTypes = {
      activeTabPartMaster: PropTypes.string,
    };

    static defaultProps = {
      activeTabPartMaster: null,
    };

    state = {
        refreshing: false,
        tabs: ['Timeline', 'Attachments'],
        activeTabTags: false,
        titleTag: '',
    };

    constructor(props) {
      super(props);
      const {activeTabPartMaster} = this.props;
      StateService.setAttachmentsTimeline([]);
      if (activeTabPartMaster === 'Attachments') {
        const { partMasterId } = this.props.navigation.state.params;
        BackendApi.getAttachments('master', partMasterId)
      }
    }

    componentDidMount() {
        const { partMasterId } = this.props.navigation.state.params;

        BackendApi.getPartMasterDetail(partMasterId);
        BackendApi.getPartMasterTimeLine(partMasterId);
        BackendApi.getAlternateNumbers(partMasterId);
        BackendApi.getUserTags();
    }

    refreshData = async ()=> {
      this.setState({ refreshing: true });
      const { partMasterId } = this.props.navigation.state.params;
      await BackendApi.getPartMasterDetail(partMasterId);
      await BackendApi.getPartMasterTimeLine(partMasterId);
      await BackendApi.getAttachments('master', partMasterId);

      this.setState({
          refreshing: false
      });
  };

    createPartInstance() {
        this.props.navigation.navigate('CreatePartInstance');
    }

    renderEvent(event: EventModel) {
        return (
            <View key={event.eventId} style={commonStyle.indent(4)}>
                <Event event={event} />
            </View>
        )
    }

    renderDraft(draft: Draft) {
        return (
            <View key={draft.eventDraftId} style={commonStyle.indent(4)}>
                <DraftEvent event={draft} />
            </View>
        )
    }

    renderTimeline() {
      const {partMasterDrafts, timeLine} = this.props;

      let allItems = 0;

      if (partMasterDrafts) {
        allItems += partMasterDrafts.length;
      }

      if (timeLine) {
        allItems += timeLine.length;
      }

      return (
        <>
          <FormSplitter text="- PARTS PEDIGREE TIMELINE -" style="green"/>
          <ScrollView
            style={{height: allItems > 10 ? 600 : null}}
            contentContainerStyle={{
              alignItems: 'stretch',
            }}
            showsHorizontalScrollIndicator={false}
          >
            {!!partMasterDrafts && partMasterDrafts.map(d => this.renderDraft(d))}
            {timeLine ? timeLine.map(event => this.renderEvent(event)) :
              <ActivityIndicator/>
            }
          </ScrollView>
          <View style={{height: 60}}/>
        </>
      )
    }

    onPressAttachmentEvent(event) {
      const screen = Event.getScreenNameByEventypeId(event.eventTypeId);
      this.props.navigation.navigate(screen, { eventId: event.eventId });
    }

    renderAttachmentTimeline() {
      const {attachmentsTimeline, attachmentsTimelineByTag} = this.props;
      const {activeTabTags} = this.state;

      let attachments = activeTabTags ? attachmentsTimelineByTag : attachmentsTimeline;

      if (attachments && attachments.length === 0 ) {
        return null
      }

      return (
        attachments && attachments.map((data, i) => {
          return(
            <View key={i} style={[
              commonStyle.flexRow,
              commonStyle.paddingHorizontal(15),
              i === attachments.length - 1 ? {marginBottom: 50} : null
            ]}>
              <ServerImage
                style={{width: 70, height: 70, marginRight: 20, flex: 0.2}}
                uri={data.path}
              />
              <View style={{flex: 0.8, marginBottom: 10}}>
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
                <View style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                  <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>TAGS: </Text>
                  <Text style={[commonStyle.inputLabel, {flex: 1, flexWrap: 'wrap'}]}>{data.tags && data.tags.map((tag, i) => <>
                      {tag.name}{i === --data.tags.length ? '.' : ', '}
                    </>
                  )}</Text>
                </View>
                <View style={[commonStyle.flexRow, commonStyle.paddingVertical(2)]}>
                  <Text style={[commonStyle.inputLabel, commonStyle.textBold]}>AUTHOR: </Text>
                  <Text style={[commonStyle.inputLabel, {flex: 1, flexWrap: 'wrap'}]}>
                    {data.user.organization ? data.user.organization : data.user.firstName  + ' ' + data.user.lastName}
                  </Text>
                </View>
              </View>
            </View>
          )
        })
      )
    }

    renderAttachments() {
      const { titleTag } = this.state;
      const { attachmentsTimeline } = this.props;

      return(
        <>
          <FormSplitter text="- ALL ATTACHMENTS -" style="green"/>
          <View style={[commonStyle.flexRow]}>
            <View/>
            <View style={[commonStyle.rowAround, commonStyle.paddingVertical(10) , {flex: 1}]}>
                <Text style={[
                    style.tabText,
                    style.tabTextWhiteBg,
                ]}>SORT/FILTER:</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.setState({activeTabTags: false, titleTag: ''})}}>
                <Text
                  style={[
                    style.tabText,
                    style.tabTextWhiteBg,
                    !this.state.activeTabTags && style.activeTabTextWhiteBg
                  ]}
                  accessibilityLabel={"DATE"}
                >DATE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.setState({activeTabTags: true}
                  )}}>
                <View
                  style={[
                    style.tabText,
                    style.tabTextWhiteBg,
                    this.state.activeTabTags && style.activeTabTextWhiteBg
                  ]}
                  accessibilityLabel={"TAG"}
                >
                  <Picker
                    styles={{
                      tabText: style.tabText,
                      tabTextWhiteBg: style.tabTextWhiteBg,
                      activeTabTextWhiteBg: this.state.activeTabTags && style.activeTabTextWhiteBg
                    }}
                    items={this.props.tags.map(c => ({ title: c.name, value: c.tagId }))}
                    title="Tag"
                    error={''}
                    defaultText={titleTag || 'TAG'}
                    selected={'123'}
                    onSelect={({ title, value }) => {
                      StateService.setAttachmentsTimelineByTag(attachmentsTimeline, value);

                      this.setState({titleTag: title, activeTabTags: true})}}
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

    render() {
        if (!this.props.partMaster) {
            return (<ActivityIndicator/>);
        }

        return (
            <View style={commonStyle.flex(1)}>
                <Content refreshControl={<RefreshControl refreshing={this.state.refreshing}
                      onRefresh={this.refreshData} />}>
                    <ManufacturerData navigation={this.props.navigation} partMaster={this.props.partMaster}/>
                    <OrganizationData partMaster={this.props.partMaster} navigation={this.props.navigation} alternatePartNumbers={this.props.alternatePartNumbers}/>

                    <View style={[style.tabsContainer, style.whiteBg]}>
                      {this.state.tabs.map(tab => (
                        <TouchableOpacity
                          key={tab}
                          activeOpacity={0.5}
                          onPress={() => {
                            if (tab === 'Attachments') {
                              const {partMasterId} = this.props.partMaster;
                              BackendApi.getAttachments('master', partMasterId)
                            }
                            StateService.setActiveTabPartMaster(tab)
                          }}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center'
                          }}>
                          <Text
                            style={[
                              style.tabText,
                              style.tabTextWhiteBg,
                              this.props.activeTabPartMaster === tab && style.activeTabTextWhiteBg
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
                <FixedBottomBtn onPress={() => this.createPartInstance()} text="Create Part Instance" />
            </View>
        );
    }
}
