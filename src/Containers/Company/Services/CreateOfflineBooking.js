import React, {Component} from 'react';
import {
    Platform, StyleSheet, View, ScrollView, Image, RefreshControl, FlatList, AsyncStorage
} from 'react-native';
import styles from '../../../../assets/styles/style.js';
import { Container, Header, Content, Card, CardItem,
	 Text, Body, Form, Item, Picker } from 'native-base';
import { CheckBox, Avatar, Icon, Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import GoogleSearch from '../../../Components/GoogleSearch';
import Common from '../../Common/index.js';
import Loader from '../../../Components/Loader';
import API from '../../../Api/Api';


export default class CreateOfflineBooking extends Component {
	constructor(props) {
        super(props)
        this.state = {
            address: '',
            date: null,
            time : null,
            age: '',
            foundation: '',
            propertyType : 0,
            metrixId: 0,
            loading: false,
            refreshing: false,
            foundationList: [],
            propertyList: [],
            metrixList: [],
            parseAddress:[],
        }
        this.common = new Common();
        this.mapAddress = this.mapAddress.bind(this);

    }

    componentDidMount() {
        this.getData()
    }
    
    mapAddress = (data, details) => {
        var address = this.common.parseAddress(details)
        this.setState({parseAddress:address, address:details.formatted_address})
    }

    getData() {
        var data = {"inspectionid":this.state.propertyType, "flag": 0,"inspectiontype": [],"inspectiondate":''}
        this.common.getInspectionData(data).then(response => {
            
            this.setState({
                propertyList: response.result.propertytype,
                foundationList: response.result.foundation,
                metrixList: response.result.metrix,
            })
        });
    }

    async booking() {
        if(!this.state.address) {
            this.common.showToast('Select Address')
        }
        else if(!this.state.date) {
            this.common.showToast('Select Date')
        }
        else if(!this.state.time) {
            this.common.showToast('Select Time')
        }
        else if(!this.state.foundation) {
            this.common.showToast('Select Foundation')
        }
        else if(!this.state.propertyType) {
            this.common.showToast('Select Property Type')
        }
        else if(!this.state.propertyType) {
            this.common.showToast('Select Property Type')
        }
        else if(!this.state.metrixId) {
            this.common.showToast('Select Sqyare Footage')
        }
        else if(!this.state.age) {
            this.common.showToast('Select no of stories')
        }
        else {
            var token = await AsyncStorage.getItem('authToken');
            var profile = JSON.parse(await AsyncStorage.getItem('profile'));
            var header = { 'authentication': token };
            var data = {
                "propertytypeid":this.state.propertyType,
                "foundationid":this.state.foundation,
                "pricemetrixid":this.state.metrixId,
                "address": this.state.address,
                "city":this.state.parseAddress.city,
                "state": this.state.parseAddress.state,
                "country":"USA",
                "zipcode": this.state.parseAddress.zipcode,
                "scheduledate": this.state.date,
                "scheduletime": this.state.time,
                "stories":this.state.age,
                "userid": profile.userid,
                "roleid":profile.RoleId,
            }

            this.setState({loading: true})
            var response = new API('OfflineBooking', data, header).getResponse();
            response.then(result => {
                console.log("OfflineBooking result : ",result)
                if (result.statuscode == 200) {
                    this.setState({loading: false})
                    this.common.showToast("Booking created successfully")
                    setTimeout(() => {
                        this.props.navigation.goBack()
                    },2000)                
                }
                else {
                    this.setState({loading: false})
                    this.common.showToast("Failed to create booking")
                }
            }).catch(error => {
                this.setState({loading: false})
                this.common.showToast("Some error occured, please try again later")
            })
        }
        
    }

   
    render() {
        if(this.state.loading) {
            return <Loader />
        }
         
        return (
            <ScrollView>
                <View>
                    <Form>
                        <GoogleSearch value={this.state.address} mapAddress={this.mapAddress} iconMap={true} />
                        <View style={[styles.sectionRow, {marginTop:15, marginBottom:10}]}>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                mode="date"
                                date={this.state.date}
                                placeholder="Date"
                                format="MM-DD-YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => {this.setState({date: date})}}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='calendar'
                                    type='font-awesome'
                                    color="#ccc"
                                    containerStyle={styles.dateIcon}
                                    />
                                }
                                customStyles={{
                                    dateText : styles.dateText,
                                    dateInput: styles.dateInput
                                }}
                                
                            />
                            </View>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                style={[styles.datePicker]}
                                mode="time"
                                is24Hour={true}
                                date={this.state.time}
                                placeholder="Time"
                                format='HH:mm'
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(time) => {this.setState({time: time})}}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='clock-o'
                                    type='font-awesome'
                                    color="#ccc"
                                    containerStyle={styles.dateIcon}
                                    />
                                }
                                customStyles={{
                                    dateText : styles.dateText,
                                    dateInput: styles.dateInput
                                }}
                                
                            />
                            </View>
                        </View>
                        <View style={[styles.border]}>
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.propertyType}
                                onValueChange={ (value) => this.setState({propertyType:value})}
                            >
                                <Picker.Item label="Property Type" value="" />
                                {this.state.propertyList.map(propery => <Picker.Item label={propery.PropType} value={propery.PropTypeId} key={propery.PropTypeId} />)}
                            </Picker>
                        </View>
                        <View style={[styles.border,  {marginVertical:10}]}>
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.foundation}
                                onValueChange={ (value) => this.setState({foundation:value})}
                            >
                                <Picker.Item label="Foundation" value="" />
                                {this.state.foundationList.map(foundation => <Picker.Item label={foundation.Name} value={foundation.Id} key={foundation.Id} />)}
                            </Picker>
                        </View>
                        
                        <View style={styles.border}>
                        <Picker
                                mode="dialog"
                                selectedValue={this.state.metrixId}
                                onValueChange={ (value) => this.setState({metrixId:value})}
                                style={styles.picker}
                            >
                                <Picker.Item label="Square Footage" value="" />
                                {this.state.metrixList.map(met => <Picker.Item label={met.Area} value={met.PriceMetrixId} key={met.PriceMetrixId} />)}
                            </Picker>
                        </View>
                        <Input containerStyle={{marginVertical:15}} keyboardType="numeric" value={this.state.age} onChangeText={(text) => this.setState({'age': text})}  placeholder="# of Stories" inputStyle={[styles.font15]}  />
                        <View style={[styles.center,styles.mtop15]}>
                            <Button
                            onPress={() => this.booking()}
                            title="Submit"
                            buttonStyle={styles.btnNexts}
                            />
                        </View>
                    </Form>                    
                </View>
            </ScrollView>
        );
    }
}