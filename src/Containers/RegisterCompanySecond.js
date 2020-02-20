import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
    Container, Root, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Form, Item, Picker
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Errors from '../Components/Errors';
import API from '../Api/Api';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import GoogleSearch from '../Components/GoogleSearch';


export default class RegisterCompany extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapAddress: [],
            companyName: '',
            companyEmail: '',
            companyPhone: '',
            address: '',
            state: '',
            city: '',
            zipcode: '',
            loading: false,
        }
        this.common = new Common();
    }

    async success(profile) {
		await AsyncStorage.setItem("roleid",profile.RoleId);
		await AsyncStorage.setItem("userid",profile.userid);
		await AsyncStorage.setItem("authToken",profile.AuthToken);
		await AsyncStorage.setItem("profile", JSON.stringify(profile));
        this.props.navigation.navigate('RegisterPriceMatrix',{"profile": profile})
	}

    onRegister = async () => {
        if (!this.state.companyName) {
            this.common.showToast('Please enter your Company Name');
            this.companyName.focus()
        }
        else if (!this.state.companyEmail) {
            this.common.showToast('Please enter your Company Email');
            this.companyEmail.focus()
        }
        else if (this.state.companyEmail && !this.common.validateEmail(this.state.companyEmail)) {
            this.common.showToast('Please enter your valid Company Email');
            this.companyEmail.focus()
        }
        else if (!this.state.companyPhone) {
            this.common.showToast('Please enter your Company Phone Number');
            this.companyPhone.focus()
        }
        else if (this.state.companyPhone && !this.common.validatePhone(this.state.companyPhone)) {
            this.common.showToast('Please enter your valid Company Phone Number');
            this.companyPhone.focus()
        }
        else if (!this.state.address) {
            this.common.showToast('Please enter your Address');
            this.address.focus()
        }
        else {
            
            this.setState({ loading: true });
                await this.getRequestData().then(data => {
                    console.log("request data: ", JSON.stringify(data))
                    var response = new API('RegisterCompany',data).getResponse();
                        response.then( result => {
                            console.log("result: ",result);
                            if(result.statuscode == 200 && result.result.userid) {
                                this.success(result.result);
                            }
                            else {
                                this.setState({ loading: false });
                                this.common.showToast(result.message);
                                // var errors = [];
                                // errors.push(result.message);
                                // this.setState({errors: errors})
                            }
                        })
                    this.props.navigation.navigate('RegisterPriceMatrix', { "request": data, request })
                    this.setState({ loading: false });
                });
        }
    }



    async getRequestData() {
        var request = this.props.navigation.getParam('request');
        var newRequest =  {
            "loginprovider": "",
            "providerkey": "",
            "address": this.state.address,
            "country": "USA",
            "state": this.state.state,
            "city": this.state.city,
            "zipcode": this.state.zipcode,
            "companyname": this.state.companyName,
            "companyemail": this.state.companyEmail,
            "companyphone": this.state.companyPhone,
            "pricemetrix" : "",
        }
        return {...request,...newRequest}
    }

  
    getSelectedColor(status) {
        return status ? '#28558E' : '#808080';
    }

    mapAddress = (data, details) => {
        this.setState({ address: data.description, mapAddress: details })
        var parseAdderss = this.common.parseAddress(details);
        this.setState({
            zipcode: parseAdderss.zipcode,
            state: parseAdderss.state,
            city: parseAdderss.city,
        })
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <Root>
                <ScrollView>
                    <View>
                        <View style={styles.container}>
                            <Text style={styles.heading}>Company Details</Text>
                            <Form>
                                <Input autoCompleteType="off" ref={companyName => { this.companyName = companyName }} value={this.state.companyName} onChangeText={(text) => this.setState({ 'companyName': text })} placeholder="Company Name" inputStyle={[styles.font15]} />
                                <Input autoCompleteType="off" ref={companyEmail => { this.companyEmail = companyEmail }} keyboardType="email-address" value={this.state.companyEmail} onChangeText={(text) => this.setState({ 'companyEmail': text })} placeholder="Company Email" inputStyle={[styles.font15]} />
                                <Input autoCompleteType="off" ref={companyPhone => { this.companyPhone = companyPhone }} keyboardType="numeric" value={this.state.companyPhone} onChangeText={(text) => this.setState({ 'companyPhone': text })} placeholder="Company Phone No" inputStyle={[styles.font15]} />
                                <GoogleSearch ref={address => { this.address = address }} value={this.state.address} mapAddress={this.mapAddress.bind(this)} icon={false} />
                                <View style={[styles.twoRow]}>
                                    <Input autoCompleteType="off" containerStyle={styles.threeRow} disabled placeholder="State" value={this.state.state} inputStyle={[styles.font15]} />
                                </View>
                                <View style={styles.sectionRow}>
                                    <View style={[styles.threeRow]}>
                                        <Input autoCompleteType="off" containerStyle={styles.threeRow} disabled placeholder="City" value={this.state.city} inputStyle={[styles.font15]} />
                                    </View>
                                    <View style={[styles.threeRow]}>
                                        <Input autoCompleteType="off" containerStyle={styles.threeRow} disabled keyboardType="numeric" value={this.state.zipcode} placeholder="Zip" inputStyle={[styles.font15]} />
                                    </View>
                                </View>
                                <View style={[styles.center,styles.mtop15]}>
                                    <Button 
                                        title="Save"
                                        buttonStyle={styles.btnNext}
                                        onPress={() => this.onRegister()}>
                                    </Button>
                            </View>
                            </Form>
                        </View>
                    </View>
                </ScrollView>
            </Root>
        );
    }
}