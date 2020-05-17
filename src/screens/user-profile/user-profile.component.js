import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Content} from 'native-base';
import {branch} from 'baobab-react/higher-order';
import {ContainerBG} from '../../components/ContainerBG';
import {UserProfileStyle as style} from './user-profile.style';
import {ProfileImage} from '../../components/profile-image/profile-image.component';
import {User} from "../../models/user";
import Moment from "moment/moment";

type Props = {
    user: User,
}

@branch({
    user: ['user'],
})
export class UserProfile extends Component<Props> {
    constructor(props) {
        super(props);
    }

    renderHeader() {
        const {user = {}} = this.props;

        if (!user) {
            return null;
        }

        return (
            <View style={style.header}>
                <ProfileImage
                    firstName={user && user.firstName}
                    lastName={user && user.lastName}
                    size={80}
                    initialsSize={32}
                    uri={user.image && user.image.path}
                />
                <View style={style.headerTextBox}>
                    <Text style={[style.text, style.textBold]}>{user.firstName} {user.lastName}</Text>
                    <Text style={style.text}>{user.username}</Text>
                    <Text style={style.text}>{user.email}</Text>
                </View>
            </View>
        );
    }

    renderListInfo() {
        const {user} = this.props;
        if (!user) {
            return null;
        }

        const listInfo = {
            citizenships: 'Country of Citizenship',
            organization: 'Organization',
            authorizationNumber: 'FAA Approval/Authorization number',
            title: 'Title',
            certificates: 'Certifications',
        };

        return Object.keys(listInfo).map(key => (
            <View style={style.listInfoItem} key={key}>
                <Text style={style.text}>{listInfo[key]}</Text>

                {
                    (key === 'citizenships' && (
                        <Text>
                            {
                                user[key].map((data, i) => (
                                    <Text
                                        style={[style.text, style.textBold]}>{data.country} {i === --user[key].length ? '' : ', '} </Text>
                                ))
                            }
                        </Text>
                    )) || (
                        <Text style={[style.text, style.textBold]}>{user[key]}</Text>
                    )
                }
            </View>
        ));
    }

    formatPartDate = (date) => {
        if(Moment(+date).isValid()) {
            return Moment(+date).format('DD/MMM/YY HH[h]mm');
        } else {
            return(date)
        }

    };

    renderPrivacyConsent() {
        const {user} = this.props;
        return ( <View style={{flexDirection: 'column'}}>
            <Text style={style.text}>Privacy Policy Consent</Text>
            <View style={style.privacyInfoItem}>
                <Text style={style.text}>Opted In</Text>
                { user.privacyPolicyAcceptedAt ? <Text style={[style.text, {fontWeight: 'bold'}]}>Yes</Text> : null}
            </View>
            { user.privacyPolicyAcceptedAt && user.privacyPolicyAcceptedAt !== -1 && user.privacyPolicyAcceptedAt !== '-1' ?
                <View style={style.privacyInfoItem}>
                    <Text style={style.text}>Submitted</Text>
                    <Text
                        style={[style.text, {fontWeight: 'bold'}]}>{this.formatPartDate(user.privacyPolicyAcceptedAt)}</Text>
                </View>
                : null}
            <View style={style.privacyInfoItem}>
                <Text style={style.text}>Edit</ Text >
                <Text style={[style.text, {fontWeight: 'bold'}]}>email info@partspedigree.com</Text>
            </View>
        </ View >)
    }

    render() {
        return (
            <ContainerBG>
                <Content padder>
                    {this.renderHeader()}
                    {this.renderListInfo()}
                    {this.renderPrivacyConsent()}
                </Content>
            </ContainerBG>
        );
    }
}
