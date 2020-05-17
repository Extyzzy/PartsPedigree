import React, {Component} from 'react';
import {TouchableOpacity, View, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {branch} from "baobab-react/higher-order";
import {Content, Button, Text, Label} from 'native-base';
import {ContainerBG} from '../../components/ContainerBG';
import {userProfileEditStyle as style} from './user-profile-edit.style';
import BackendApi from "../../services/backend";
import {UserEditForm} from "../../components/user-edit-form/user-edit-form.component";
import {submitBtn, submitBtnCaption} from '../../styles/Common';
import {ProfileImage} from '../../components/profile-image/profile-image.component';
import {FileData} from '../../models/file-data';
import {Loader} from "../../components/loader";
import Moment from "moment/moment";

@branch({
    user: ['user'],
    countries: ['countries'],
})
export class UserProfileEdit extends Component {
    state = {
        image: null,
        loading: false,
        showAlert: false,
    };

    componentWillReceiveProps(nextProps, nextState) {
        const {showAlert} = this.state;

        if (nextState.showAlert !== showAlert && showAlert) {

            Alert.alert('Success', 'User saved', [{
                text: 'OK',
                onPress: () => this.onPressCancel()
            }]);
        }
    }

    onPressCancel() {
        this.props.navigation.goBack();
    }

    onPressSave() {
        let user = JSON.parse(JSON.stringify(this.userEditForm.validate()));

        if (user) {
            this.setState({loading: true}, async () => {
                try {
                    if (this.state.image) {
                        const res = await BackendApi.uploadImage(this.state.image, 'user');
                        const {imageId, path} = res.data;
                        user = {...user, image: {path}, imageId}
                    }
                    if ( Moment(+user.privacyPolicyAcceptedAt).isValid()) {
                        user['privacyPolicyAcceptedAt'] = Moment(+user.privacyPolicyAcceptedAt).format('YYYY-MM-DD HH:mm:ss');
                    } else {
                        user['privacyPolicyAcceptedAt'] = user.privacyPolicyAcceptedAt
                    }

                    await BackendApi.saveUser(user);

                    this.setState({
                        loading: false,
                        showAlert: true
                    });

                } catch (e) {
                    this.setState({loading: false});
                }
            });
        }
    }

    selectImage() {
        const options = {
            title: 'Select ImageModel',
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                return;
            }

            if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }

            const {uri, fileName, type} = response;

            const image = new FileData(uri, fileName, type);

            this.setState({image});
        });
    }

    render() {
        const {user} = this.props;
        const {image, loading} = this.state;
        return (
            <ContainerBG>
                <Loader loading={loading}/>
                <Content padder>
                    <TouchableOpacity style={style.profileImageContainer} onPress={() => this.selectImage()}>
                        <ProfileImage
                            firstName={user && user.firstName}
                            lastName={user && user.lastName}
                            size={80}
                            uri={(image && image.uri) || (user.image && user.image.path)}
                            initialsSize={32}
                        />
                        <Text style={style.profileImageText}>Upload new image profile</Text>
                    </TouchableOpacity>
                    <UserEditForm
                        isEdit
                        ref={(userEditForm) => {
                            this.userEditForm = userEditForm;
                        }}
                        countries={this.props.countries}
                        user={this.props.user}
                    />
                    <View style={style.btns}>
                        <View style={style.btnConainer}>
                            <Button style={[submitBtn, {width: '100%'}]} disabled={this.state.loading}
                                    onPress={() => this.onPressSave()}>
                                <Label style={submitBtnCaption}>Save</Label>
                            </Button>
                        </View>
                        <View style={style.btnConainer}>
                            <Button transparent light style={style.cancelBtn} onPress={() => this.onPressCancel()}>
                                <Text style={style.cancelBtnText}>Cancel</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </ContainerBG>
        );
    }
}
