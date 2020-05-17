import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import BackendApi from "../services/backend";
import {commonStyle} from "../styles/common.style";
import {eventDetailStyle as style} from "../styles/evetn-detail.style";
import {EmailLink} from "./email-link.component";
import {User} from "../models/user";
import {general} from "../constants/accessability";
import {StateService} from "../services/state.service";
import {EventTypes} from "../utils/EventTypes";

export class CommonEventDetailComponent extends Component {
  eventId: string;

  constructor(props) {
    super(props);

    const {params} = this.props.navigation.state;
    this.eventId = params && params.eventId;
    this.eventTypeId = params && params.eventTypeId;

    this.state = {
      viewAllListUsers: false,
    }
  }

  componentDidMount() {
    if (this.eventTypeId === EventTypes.ARRIVAL ||
      this.eventTypeId === EventTypes.RECEIVING ||
      this.eventTypeId === EventTypes.SHIPMENT ) {
      BackendApi.getEventById(this.eventId, this.eventTypeId);
    } else if (this.eventId) {
      BackendApi.getEventById(this.eventId);
    }
  }

  renderUserInfo(title: string, user: User) {
    return (
      <View style={style.infoContainer}>
        <Text style={style.infoTitleText}>{title}</Text>
        <Text style={style.text}>{user && user.firstName} {user && user.lastName}</Text>
        <Text style={style.text}>{user && user.organization || 'N/A'}</Text>
        <EmailLink style={style.email} email={user && user.email}/>
      </View>
    )
  }

  renderSharedUsers() {
    if (!this.props.event.users || !this.props.event.users.length) {
      return null;
    }

    const {viewAllListUsers} = this.state;
    let text = viewAllListUsers ? 'Hide users <' : 'Show users >';

    return (
      <View style={style.infoContainer}>
        <Text style={style.infoTitleText}>SHARED WITH</Text>
        <TouchableOpacity
          style={{marginBottom: 5}}
          activeOpacity={0.5}
          onPress={() => this.setState({viewAllListUsers: !viewAllListUsers})}
          accessibilityLabel={general.viewMoreButton}
        >
          <Text style={style.text}>{text}</Text>
        </TouchableOpacity>
        {viewAllListUsers && this.props.event.users.map(user => (
          <Text key={user.username} style={commonStyle.indent(5)}>
            {`${user.firstName} ${user.lastName}, ${user.organization || 'N/A'}, `}
            <EmailLink style={style.email} email={user.email}/>
          </Text>
        ))
        }
      </View>
    );
  }

  share() {
    this.props.navigation.navigate('ShareEvent', {eventId: this.props.event.eventId, needUpdate: true});
  }

  _eventIsLoaded() {
    return this.props.event && this.props.event.eventId == this.eventId;
  }
}
