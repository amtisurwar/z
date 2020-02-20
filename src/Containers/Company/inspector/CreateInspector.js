import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, FlatList, Image, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import style from '../../../../assets/styles/style.js';
import ImagePicker from 'react-native-image-picker';
import {
    Container, Header, Content, Card, CardItem,
    Text, Body, Form, Item, Picker, Toast, Root,
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Loader from '../../../Components/Loader';
import Errors from '../../../Components/Errors';
import API from '../../../Api/Api';
import Common from '../../../Containers/Common';


const options = {
    title: 'Select Picture',
    takePhotoButtonTitle:'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from Library',
    mediaType: 'photo',
    cameraType: 'back',
    storageOptions: {
        skipBackup: true,
    },
};

export default class CreateInspector extends Component {

    constructor(props) {
        super(props)
        this.state = {
            availability: [],
            avatarSource: '',
            profilePic: '',
            employeeId: '',
            password: '',
            inspectorName: '',
            inspector_id: 0,
            email: '',
            phone: '',
            zipcode: '',
            distance: 0,
            loading: false,
            submit: false,
            errors: [],
            pricemetrix: [],
            timing: [
                { weekdays_id: 1, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Monday' },
                { weekdays_id: 2, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Tuesday' },
                { weekdays_id: 3, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Wednesday' },
                { weekdays_id: 4, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Thursday' },
                { weekdays_id: 5, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Friday' },
                { weekdays_id: 6, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Saturday' },
                { weekdays_id: 7, checked:false, start_time: '00:00',start_display_time: '00:00', end_display_time:'00:00', end_time: '00:00', day: 'Sunday' },
            ]
        }
        this.common = new Common();

    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this.saveInspector })
    }

    async success() {
        var authToken = await AsyncStorage.getItem("authToken");
        await this.getRequestData().then(data => {
            this.setState({ loading: true });
			var header = { "authentication": authToken };
            var response = new API('RegisterInspector', data, header).getResponse();
            response.then(result => {
            	console.log("response: ", result);
            	if (result.statuscode == 200) {
                    this.setState({ loading: false });
                    this.props.navigation.navigate('Maps', { "profile": data })
            	}
            	else {
            		this.setState({ loading: false });
            		this.common.showToast(result.message)
            	}
            }).catch(e => {
				this.common.showToast("Failed to validate Inspector, try again later")
				this.setState({ loading: false });
			});         
        })

    }

    saveInspector = async () => {
        var timingError = true;
        for (var i = 0; i < this.state.timing.length; i++) {
            if (this.state.timing[i].checked) {
                timingError = false;
            }
        }
        if (!this.state.avatarSource) {
            this.common.showToast('Please Select your Profile Picture');

        }
        else if (!this.state.employeeId) {
            this.common.showToast('Please enter your Employee ID');
            this.employeeId.focus()
        }
        else if (!this.state.inspectorName) {
            this.common.showToast('Please enter Inspector Name');
            this.inspectorName.focus()
        }
        else if (!this.state.password) {
            this.common.showToast('Please enter your Password');
            this.password.focus()
        }
        else if (!this.state.email) {
            this.common.showToast('Please enter your Email ID');
            this.email.focus()
        }
        else if (this.state.email && !this.common.validateEmail(this.state.email)) {
            this.common.showToast('Please enter valid Email ID');
            this.email.focus()
        }
        else if (!this.state.phone) {
            this.common.showToast('Please enter your Phone Number');
            this.phone.focus()
        }
        else if (this.state.phone && !this.common.validatePhone(this.state.phone)) {
            this.common.showToast('Please enter valid Phone Number');
            this.phone.focus()
        }
        else if (timingError) {
            this.common.showToast('Please Select Timing');
        }
        else {
            this.success()
        }
        return false;
    }

    async getRequestData() {
        var profile = JSON.parse(await AsyncStorage.getItem('profile'));
        var companyId = profile.CompanyId;
        //console.log('nsdsshbdhsbfhh', profile)
        return {
            "inspector_id": 0,
            "name": this.state.inspectorName,
            "emailid": this.state.email,
            "employee_id": this.state.employeeId,
            "phoneno": this.state.phone,
            "profilephoto": this.state.profilePic,
            "password": this.state.password,
            "company_id": companyId,
            "availability": this.state.timing,
            "geofencingradius": this.state.distance,
            "zipcode": this.state.zipcode,
            "pricemetrix": this.state.pricemetrix,
            "geofencingradius": 0,
            "zipcode" : "",
            "longitude": "",
            "latitude" : "",
            "flag": 1           
        }
    }


    UploadPicture() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.uploadPicApi(response);
            }
        });
    }

    async uploadPicApi(response) {
        this.setState({ loading: true });
        var body = new FormData();
        var pic = response;
        body.append('file', { uri: response.uri, name: response.fileName, filename: response.fileName, type: response.type });
        var response = await new API('UploadPic', body).getResponse();
        this.setState({ loading: false });
        try {
            if (response.statuscode == 200 && response.result) {
                this.setState({
                    profilePic: response.result[0].mediaName
                });
                const source = { uri: pic.uri };
                this.setState({
                    avatarSource: source,
                });
            }
            else {
                throw 'API Error in Upload Photo API';
            }
        } catch (error) {
            this.setState({ loading: false });

        }
    }

    setAvailability(stateValue, key, field) {
        var timing = [...this.state.timing];
        if (field == "day") {
            timing[key].checked = !stateValue;
        }
        
        if (field == "start_time") {
           timing[key].start_display_time = stateValue;
           timing[key].start_time = this.getTwentyFourHourTime(stateValue);
        }
        if (field == "end_time") {
           timing[key].end_display_time = stateValue;
           timing[key].end_time = this.getTwentyFourHourTime(stateValue);
        }
        console.log(timing[key])
        this.setState({timing})
        // this.forceUpdate()
    }

    getTwentyFourHourTime(amPmString) { 
        var d = new Date("1/1/2013 " + amPmString); 
        return (d.getHours()<10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes()<10 ? '0' : '') + d.getMinutes();
    }

    getDisplayDate = (date) => {
        var format = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        console.log("format: ",format);
        return format;
        
    }

    printAvailability() {
        return this.state.timing.map((item, key) => {
            var checkStatus = this.state.timing[key].checked;
            var startTime = this.state.timing[key].start_display_time;
            var endTime = this.state.timing[key].end_display_time;
            return (
                <View key={key} style={[{backgroundColor: (key % 2 == 0) ? '#ecf0f1' : '#fff'},style.twoRow]}>
                   <View style={style.threeRow}>
                        <CheckBox
                            containerStyle={{padding:0,borderWidth:0,marginHorizontal:0, backgroundColor:'transparent'}}
                            textStyle={{fontWeight:'normal'}}
                            title={item.day}
                            checked={checkStatus}
                            checkedColor="#28558E"
                            onPress={() => this.setAvailability(checkStatus, key, 'day')}
                        />
                   </View>
                   <View>
                        <DatePicker
                            style={{width:90}}
                            mode="time"
                            is24Hour={false}
                            date={startTime}
                            //placeholder="HH:MM"
                            format='h:mm A'
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            
                            onDateChange={(date) => { this.setAvailability(date, key, 'start_time') }}
                            iconComponent={
                                <Icon
                                    size={0}
                                    name='clock-o'
                                    type='font-awesome'
                                    containerStyle={style.dateIcon}
                                />
                            }
                            customStyles={{
                                dateText: style.dateText,
                                dateInput: {borderWidth:0}
                            }}
                        />
                   </View>
                   <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={style.equal}>-</Text>
                   </View>
                   <View>
                        <DatePicker
                            style={{width:90}}
                            mode="time"
                            is24Hour={false}
                            date={endTime}
                            //placeholder="HH:MM"
                            format='h:mm A'
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            onDateChange={(end_time) => { this.setAvailability(end_time, key, 'end_time') }}
                            iconComponent={
                                <Icon
                                    size={0}
                                    name='clock-o'
                                    type='font-awesome'
                                    containerStyle={style.dateIcon}
                                />
                            }
                            customStyles={{
                                dateText: style.dateText,
                                dateInput: {borderWidth:0}
                            }}
                        />
                   </View>
                </View>
            )
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
                        <View style={style.registerImageContainer}>
                            <Avatar
                                size={100}
                                onPress={() => this.UploadPicture()}
                                overlayContainerStyle={{ backgroundColor: '#FFF' }}
                                rounded icon={{ name: 'plus', type: 'font-awesome', color: '#C39666', size: 25 }}
                                containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
                                source={this.state.avatarSource}
                                imageProps={{ resizeMode: 'cover' }}
                            />
                        </View>
                        <View style={style.registerFormContainer}>
                            <Form>
                                <View>
                                    <Input autoCompleteType="off" ref={employeeId => { this.employeeId = employeeId }} value={this.state.employeeId} onChangeText={(text) => this.setState({ 'employeeId': text })} placeholder="Employee Id" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={inspectorName => { this.inspectorName = inspectorName }} value={this.state.inspectorName} onChangeText={(text) => this.setState({ 'inspectorName': text })} placeholder="Inspector Name" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={password => { this.password = password }} secureTextEntry={true} value={this.state.password} onChangeText={(text) => this.setState({ 'password': text })} placeholder="Password" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={email => { this.email = email }} keyboardType="email-address" value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={phone => { this.phone = phone }} keyboardType="numeric" value={this.state.phone} onChangeText={(text) => this.setState({ 'phone': text })} placeholder="Phone No" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Text style={[style.heading, style.lineSpacing]}>Job Schedule</Text>
                                </View>
                                <View>{this.printAvailability()}</View>
                                <View style={style.nextButtonWrapper}>
                                    <Button 
                                        title="Next"
                                        buttonStyle={style.btnNext}
                                        icon={<Icon name="angle-right" containerStyle={{position:'absolute',right:10}} type="font-awesome" color="#FFF" />}
                                        iconRight
                                        onPress={() => this.saveInspector()}
                                    />
                                </View>
                            </Form>
                        </View>
                    </View>
                </ScrollView>
            </Root>
        );
    }
}