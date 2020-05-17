import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { Content, Label, Textarea } from 'native-base';
import { shareStyle as style } from './share.style';
import { FormButtons } from "../../components/form-buttons";
import { commonStyle } from "../../styles/common.style";
import { Picker } from "../../components/picker/picker.component";
import { Organization } from "../../models/organization";
import { ShareEventModel } from "../../models/share-event";

type Props = {
    organizations: Array<Organization>;
    onCancelPress: Function;
    onSharePress: Function<ShareEventModel>
}

export class ShareScreen extends PureComponent<Props> {
    text1 = 'Please enter a comma-separated list of email addresses and/or usernames of users you would like to share this event with';
    text2 = 'or select an Organization (note that this option shares the event with all members of the Organization).';
    state = {
        organizationId: null,
        users: null,
    };

    selectOrganization(organizationId: number) {
        this.setState({ organizationId });
    }

    onPressShare() {
        this.props.onSharePress(this.state)
    }

    render() {
        return (
            <Content>
                <View style={style.container}>
                    <Text style={commonStyle.indent(30)}>{this.text1}</Text>
                    <Label>Email addresses and/or usernames</Label>
                    <Textarea
                        style={[commonStyle.textarea, commonStyle.indent(15)]}
                        rowSpan={5}
                        value={this.state.users}
                        autoCapitalize="none"
                        onChangeText={users => this.setState({ users })}
                    />
                    <Text style={commonStyle.indent(30)}>{this.text2}</Text>
                    <Picker
                        items={this.props.organizations.map(c => ({ title: c.name, value: c.organization_id }))}
                        title="Share to Organization"
                        defaultText="Choose organization"
                        selected={this.state.organizationId}
                        onSelect={({ value }) => this.selectOrganization(value)}
                    />
                    <FormButtons
                        okBtnText="Share"
                        onCancelPress={this.props.onCancelPress}
                        onOkPress={() => this.onPressShare()}
                        disabled={!this.state.organizationId && !this.state.users}
                    />
                </View>
            </Content>
        );
    }
}
