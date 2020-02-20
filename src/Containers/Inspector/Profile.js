import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, FlatList, Image, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import style from '../../../assets/styles/style.js';
import ImagePicker from 'react-native-image-picker';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Picker, Toast, Root,
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Loader from '../../Components/Loader';
import Errors from '../../Components/Errors';
import Logout from '../../Components/Logout';
import API from '../../Api/Api';
import Common from '../../Containers/Common';


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

export default class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            availability:[],
            avatarSource: '',
            profilePic: '',
            employeeId: '',
            inspectionZipcode: '',
            inspectorName: '',
            email: '',
            phone: '',
            distance:1,
            loading: false,
            submit: false,
            errors: [],
            timing: [
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Monday' },
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Tuesday' },
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Wednesday' },
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Thursday' },
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Friday' },
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Saturday' },
                { weekend_id: 0, start_time: '00:00', end_time: '00:00', day: 'Sunday' },
            ]
        }
        this.common = new Common();
        
    }

    componentDidMount() {
        this.props.navigation.setParams({ handleSave: this.saveInspector })
        this.setData();
    }
    
    async setData() {
        var profile = JSON.parse(await AsyncStorage.getItem('profile'))
        console.log("profile: ",profile);
        this.setState({
            avatarSource: {uri: profile.ProfilePic},
            employeeId: profile.EmployeeId,
            inspectorName: profile.Fname,
            email: profile.EmailId,
            phone: profile.MobileNumber
        })
    }

    validate() {
        var messages = [];
        this.setState({submit:true});
        messages.push(!this.state.avatarSource  && 'Select Profile Pic');
        messages.push(!this.state.employeeId  && 'Employee Id required');
        messages.push(!this.state.inspectorName  && 'Inspector Name required');
        messages.push(!this.state.email  && 'Inspector Email required');
        messages.push(!this.state.phone  && 'Phone No required');
        if(this.state.email && !this.common.validateEmail(this.state.email)) {
			messages.push('Invalid Email');
        }
        if(this.state.phone && !this.common.validatePhone(this.state.phone)) {
			messages.push('Invalid Phone Number');
        }
        var timingError = true;
        for(var i=0; i< this.state.timing.length; i++) {
            if(this.state.timing[i].weekend_id > 0) {
                timingError = false;
            }
        }
        if(timingError) {
            messages.push('Select Timing');
        }
        var errorShow = [];
		messages = messages.filter( (msg) => {
			if(msg) {
				return msg;
			}
		})
		for(var i=0; i<messages.length; i++) {
			var required = messages[i].indexOf('required');
			if(required > 0) {
				
			}
			else {
				errorShow.push(messages[i]);
			}
		}
		this.setState({ errors: errorShow});
		if(messages.length > 0) {
			return false;
		}
		else {
			return true;
		}
    }

    saveInspector = async () => {
        if(this.validate()) {
            this.getRequestData().then( data => {
                this.props.navigation.navigate('UpdatePriceMatrix',{'request': data})
            });
        }
    }
    
    async getRequestData() {
        var profile = JSON.parse(await AsyncStorage.getItem('profile'));
        var companyId = profile.CompanyId;
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
            "geofencingradius": this.state.distance
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
		this.setState({loading: true});
        var body = new FormData();
        var pic = response;
        body.append('file', {uri: response.uri,name: response.fileName,filename :response.fileName,type: response.type});
        var response = await new API('UploadPic', body).getResponse();
		this.setState({loading: false});
        try {
			if(response.statuscode == 200 && response.result) {
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
			this.setState({loading: false});
			
		}
    }

    setAvailability(stateValue, key, field) {
        // console.log("stateValue: ",stateValue,"key: ",key,"field: ",field);
        if(field == "day") {
            if(stateValue) {
                this.state.timing[key].weekend_id = 0;
            }
            else {
                this.state.timing[key].weekend_id = key+1;
            }
            
        }
        if(field == "start_time") {
            this.state.timing[key].start_time = stateValue;
        }
        if(field == "end_time") {
            this.state.timing[key].end_time = stateValue;
        }
        this.forceUpdate()
        // console.log(this.state.timing);
    }

    printAvailability() {
        return this.state.timing.map((item, key) => {
            var checkStatus = this.state.timing[key].weekend_id > 0 ? true : false;
            var startTime = this.state.timing[key].start_time;
            var endTime = this.state.timing[key].end_time;
            return(
            <View key={key}>
                <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                <View style={{ flexDirection: 'column', width: '100%' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.checkbox}>
                                <CheckBox checked={checkStatus} onPress={() => this.setAvailability(checkStatus, key,'day')} checkedColor="#28558E" size={18} containerStyle={styles.loginContainerStyle} color="#808080" style={styles.loginCheckbox} />
                                <Text>{item.day}</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignContent: 'center', flexDirection: 'row' }}>
                                <View style={styles.timeWrapper}>
                                    <DatePicker
                                        style={[styles.datePicker]}
                                        mode="time"
                                        is24Hour={true}
                                        date={startTime}
                                        placeholder="HH:MM"
                                        format='HH:mm'
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        onDateChange={(start_time) => { this.setAvailability(start_time,key,'start_time') }}
                                        iconComponent={
                                            <Icon
                                                size={13}
                                                name='clock-o'
                                                type='font-awesome'
                                                containerStyle={styles.dateIcon}
                                            />
                                        }
                                        customStyles={{
                                            dateText: styles.dateText,
                                            dateInput: styles.dateInput
                                        }}
                                    />
                                </View>
                                <Text style={styles.equal}>=</Text>
                                <View style={styles.timeWrapper}>
                                <DatePicker
                                    style={[styles.datePicker]}
                                    mode="time"
                                    date={endTime}
                                    placeholder="HH:MM"
                                    format='HH:mm'
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(end_time) => { this.setAvailability(end_time,key,'end_time') }}
                                    iconComponent={
                                        <Icon
                                            size={13}
                                            name='clock-o'
                                            type='font-awesome'
                                            containerStyle={styles.dateIcon}
                                        />
                                    }
                                    customStyles={{
                                        dateText: styles.dateText,
                                        dateInput: styles.dateInput
                                    }}
                                />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
        })
    }

    getSelectedColor(status) {
        return status ? '#28558E' : '#808080';
    }

    render() {
        if(this.state.loading) {
            return <Loader />
        }

        var employeeId = !this.state.employeeId && this.state.submit ? true : false;
        var inspectionZipcode = !this.state.inspectionZipcode && this.state.submit ? true : false;
        var inspectorName = !this.state.inspectorName && this.state.submit ? true : false;
        var email = !this.state.email && this.state.submit ? true : false;
        var phone = !this.state.phone && this.state.submit ? true : false;
        
        return (
            <Root>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.registerImageContainer}>
                        <Logout />
                        <Avatar
                            size={100}
                            onPress={() => this.UploadPicture()} 
                            overlayContainerStyle={{ backgroundColor: '#FFF' }}
                            rounded icon={{ name: 'person', color: '#C39666', size: 72 }}
                            containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
                            source={this.state.avatarSource}
                            imageProps={{ resizeMode: 'cover' }}
                        />
                    </View>
                    <Errors errors={this.state.errors} />
                    <View style={style.registerFormContainer}>
                        <Form>
                            <View>
                                <Input autoCompleteType="off" inputContainerStyle={employeeId && style.inputError} rightIcon={employeeId && this.common.getIcon()} errorMessage={employeeId && "Employee id required"} value={this.state.employeeId} onChangeText={(text) => this.setState({'employeeId': text})} placeholder="Employee Id" inputStyle={[style.font15]}  />
                            </View>
                            <View>
                                <Input autoCompleteType="off" inputContainerStyle={inspectorName && style.inputError} rightIcon={inspectorName && this.common.getIcon()} errorMessage={inspectorName && "Inspector Name required"} value={this.state.inspectorName} onChangeText={(text) => this.setState({'inspectorName': text})} placeholder="Inspector Name" inputStyle={[style.font15]}  />
                            </View>
                            <View>
                                <Input autoCompleteType="off" keyboardType="email-address" inputContainerStyle={email && style.inputError} rightIcon={email && this.common.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({'email': text})}  placeholder="Email" inputStyle={[style.font15]}  />
                            </View>
                            <View>
                                <Input autoCompleteType="off" keyboardType="numeric" inputContainerStyle={phone && style.inputError} rightIcon={phone && this.common.getIcon()} errorMessage={phone && "Phone No required"} value={this.state.phone} onChangeText={(text) => this.setState({'phone': text})}  placeholder="Phone No" inputStyle={[style.font15]}  />
                            </View>
                            <View style={{marginLeft:10}}>
                                <Text style={style.heading}>Set Availability:-</Text>
                            </View>
                            <View>{this.printAvailability()}</View>
                            <Item style={[style.formItem]}>
                                <View style={{flex:1}}>
                                    <Text style={[style.registerOtherComponentsText,style.primaryColor]}>Set Geofencing Radius :-</Text>
                                    <Slider
                                        value={this.state.distance}
                                        onValueChange={value => this.setState({distance: value })}
                                        thumbTintColor="#28558E"
                                        minimumValue={1}
                                        maximumValue={50}
                                        step={1}
                                        minimumTrackTintColor={this.getSelectedColor(this.state.distance)}
                                    />
                                    <View style={[style.row]}>
                                        <Text style={[style.registerOtherComponentsText,style.twoRow,style.primaryColor]}>{this.state.distance} mile</Text>
                                        <Text style={[style.registerOtherComponentsText,style.twoRow,style.primaryColor,{textAlign:'right'}]}>50 mile</Text>
                                    </View>
                                </View>
                            </Item>
                            <View>
                                <Input autoCompleteType="off" keyboardType="numeric" inputContainerStyle={inspectionZipcode && style.inputError} rightIcon={inspectionZipcode && this.common.getIcon()} errorMessage={inspectionZipcode && "Inspection Zip required"} value={this.state.inspectionZipcode} onChangeText={(text) => this.setState({'inspectionZipcode': text})}  placeholder="Please Enter Inspection Zip" inputStyle={[style.font15]}  />
                            </View>
                            <View style={[style.center,{marginTop:20}]}>
                                <Button style={style.loginButton} onPress={ () => this.saveInspector()}>
                                    <Text style={style.textCenter}>Next</Text>
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


const styles = StyleSheet.create({
    registerImageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avaibality: {
        marginTop: 20, marginBottom: 20, marginLeft: 15
    },
    registerFormContainer: {
        paddingLeft: 10,
        paddingRight: 30,
        overflow: 'hidden',
    },
    equal: {
        flexDirection: 'row', marginHorizontal:15,
    },
    checkbox: {
       flexDirection: 'row'
    },
    formItem: {
        borderColor: '#808080',
    },
    loginContainerStyle: { paddingTop: 0, marginRight: 3, paddingRight: 0, paddingLeft: 3, marginTop: 3 },
    loginCheckbox: {
        borderColor: '#ccc',
        borderWidth: 1,
    },
    dateIcon: {
        position: 'absolute',
        left: 0,
        paddingBottom: 15

    },
    dateText: {
        fontWeight: 'bold'
    },
    dateIcon: {
        position: 'absolute',
        left: 0,
        paddingBottom: 15

    },
    dateInput: {
        alignItems: 'flex-start',
        paddingLeft: 20,
        borderWidth: 0,
        paddingBottom: 15,
    },
    timeWrapper: {
        width:70,
        borderBottomWidth:1,
        marginBottom:10,
    },
}); 