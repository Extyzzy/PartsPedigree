import React from 'react';
import PropTypes from 'prop-types';
import {View, FlatList, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {ListingBase} from "../parts-listing/lists/listing-base.component";
import BackendApi from "../../services/backend";
import {NoResulstsText} from "../../components/no-results.component";
import {commonStyle} from "../../styles/common.style";
import {branch} from "baobab-react/higher-order";
import {Notification} from "../../models/notification";

type Props = {
    notifications: Array<Notification>;
}

@branch({
    user: ['user'],
    followingList: ['followingList']
})
export class Stats extends ListingBase<Props> {
    static contextTypes = {
        getNavigation: PropTypes.func,
    };
    cursorNext = null;

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            loading: false,
            data: {},
            time: 'month',
            nr: 0
        };
    }

    componentDidMount() {
        BackendApi.getStats().then((data) => {
            console.log('data', data)
            this.setState({data: data.data})
        });
    };

    async onEndReached() {
        if (!this.scrollEventIsBlocking && !this.state.loading && this.cursorNext) {
            this.scrollEventIsBlocking = true;
            this.getData();
        }
    }

    async getData() {
        if (this.state.loading) {
            return false;
        }

        const {cursorNext} = this;

        this.setState({loading: true});

        this.cursorNext = await BackendApi.getFollowingList(cursorNext);

        this.setState({
            loading: false,
            refreshing: false
        });

        return true;
    }
   numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

    render() {
        let Times = ['month', 'year', 'day'];
        let month = this.state.time === 'month';
        let day = this.state.time === 'day';
        let year = this.state.time === 'year';
        console.log(this.state.nr, this.state.time, Times[0]);

        return (
            <View style={[commonStyle.flex(1), {marginLeft: 30, marginRight: 30, marginTop: 15}]}>
                {this.state.data.month ?
                    <View>
                        <Text style={{color: '#6a6af7', fontWeight: 'bold', marginBottom: 5}}>{this.props.user && this.props.user.organization}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1.5}}>
                                <Text style={{fontWeight: 'bold'}}>Item</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={() => {
                                    if (this.state.nr + 1 <  3) { this.setState({nr: this.state.nr + 1,time: Times[this.state.nr + 1]});} else {
                                        console.log('am intart');
                                        this.setState({nr: 0, time: 'month'})
                                    }
                                }}>
                                    {month ? <Text>Month</Text> : day ?
                                        <Text>Day</Text> : <Text>Year</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontWeight: 'bold'}}>Total</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#6a6af7',
                                borderBottomWidth: 1,
                                marginBottom: 3
                            }}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'column', flex: 1.5}}>
                                <Text style={{marginBottom: 3}}>Part Numbers</Text>
                                <Text style={{marginBottom: 3}}>Part Instances</Text>
                                <Text style={{marginBottom: 3}}>Shipments</Text>
                                <Text style={{marginBottom: 3}}>Receipts</Text>
                                <Text style={{marginBottom: 3}}>Organizations</Text>
                                <Text style={{marginBottom: 3}}>ASN Suppliers</Text>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].organization.partMasters)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].organization.partInstances)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].organization.shippingEvents)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].organization.receivingEvents)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].organization.organizations)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].organization.suppliers)}</Text>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.organization.partMasters)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.organization.partInstances)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.organization.shippingEvents)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.organization.receivingEvents)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.organization.organizations)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.organization.suppliers)}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#6a6af7',
                                borderBottomWidth: 1,
                                marginTop: 3
                            }}
                        />
                        <Text style={{color: '#6a6af7', fontWeight: 'bold', marginBottom: 5, marginTop: 40}}>All</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1.5}}>
                                <Text style={{fontWeight: 'bold'}}>Item</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={() => {
                                    if (this.state.nr < 3) { this.setState({nr: this.state.nr + 1,time: Times[this.state.nr + 1]});} else {
                                        this.setState({nr: 0, time: Times[0]})
                                    }
                                }}>
                                    {month ? <Text>Month</Text> : day ?
                                        <Text>Day</Text> : <Text>Year</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontWeight: 'bold'}}>Total</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#6a6af7',
                                borderBottomWidth: 1,
                                marginBottom: 3
                            }}
                        />
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'column', flex: 1.5}}>
                                <Text style={{marginBottom: 3}}>Part Numbers</Text>
                                <Text style={{marginBottom: 3}}>Part Instances</Text>
                                <Text style={{marginBottom: 3}}>Shipments</Text>
                                <Text style={{marginBottom: 3}}>Receipts</Text>
                                <Text style={{marginBottom: 3}}>Organizations</Text>
                                <Text style={{marginBottom: 3}}>ASN Suppliers</Text>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].all.partMasters)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].all.partInstances)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].all.shippingEvents)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].all.receivingEvents)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].all.organizations)}</Text>
                                <Text
                                    style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data[this.state.time].all.suppliers)}</Text>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1}}>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.all.partMasters)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.all.partInstances)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.all.shippingEvents)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.all.receivingEvents)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.all.organizations)}</Text>
                                <Text style={{marginBottom: 3}}>{this.numberWithCommas(this.state.data.total.all.suppliers)}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#6a6af7',
                                borderBottomWidth: 1,
                                marginTop: 3
                            }}
                        />
                    </View>
                    : null}
            </View>
        );
    }
}
