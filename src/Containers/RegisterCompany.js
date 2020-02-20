import React, { Component } from 'react';
import { Platform, StyleSheet, View, TextInput, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
    Container, Root, Header, Content, Card, Textarea, CardItem, Right, Left, Switch,
    Text, Body, Form, Item, Picker
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import Errors from '../Components/Errors';
import API from '../Api/Api';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import GoogleSearch from '../Components/GoogleSearch';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';


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

export default class RegisterCompany extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatarSource: '',
            mapAddress: [],
            errors: [],
            profilePic: '',
            fname: '',
            lname: '',
            email: '',
            phone: '',
            companyName: '',
            companyEmail: '',
            companyPhone: '',
            address: '',
            state: '',
            city: '',
            zipcode: '',
            // inspectionType: [],
            inspectionType: '',
            bio: '',
            password: '',
            confirmPassword: '',
            availability: false,
            distance: 1,
            inspectionState: '',
            inspectionCity: '',
            role: 3,
            stateList: [],
            cityList: [],
            inspectioncityList: [],
            inspectionList: [],
            inspectionZipcode: '',
            loading: false,
            submit: false,
        }
        this.common = new Common();
    }

    componentDidMount() {
        this.getInspectionList()
    }


    async getInspectionList() {
        await this.common.getInspectionList().then(inspection => {
            if (inspection.result.inspectiontype) {
                this.setState({ inspectionList: inspection.result.inspectiontype })
            }
        }).catch((error) => {
            console.log("inspection error: ", error)
        });
    }

    onRegister = async () => {
        if (!this.state.avatarSource) {
            this.common.showToast('Please Select your Profile Picture');

        }
        else if (!this.state.fname) {
            this.common.showToast('Please enter your First Name');
            this.fname.focus()
        }
        else if (!this.state.lname) {
            this.common.showToast('Please enter your Last Name');
            this.lname.focus()
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
        else if (!this.state.inspectionType) {
            this.common.showToast('Please Select Inspection Type');     
        }

        // else if (!this.state.inspectionType.length) {
        //     this.common.showToast('Please Select Inspection Type');
            
        // }
        else if (!this.state.password) {
            this.common.showToast('Please enter your Password');
            this.password.focus()
        }
        else if (!this.state.confirmPassword) {
            this.common.showToast('Please enter your Confirm Password');
            this.confirmPassword.focus()
        }
        else if (this.state.password != this.state.confirmPassword) {
            this.common.showToast("Both password should be same");
            this.password.focus()
        }
        else if (!this.state.bio) {
            this.common.showToast('Please enter your Bio');
            this.bio.focus()
        }
        else {
            this.setState({ loading: true });
            await this.getRequestData().then(data => {
                var response = new API('ValidateCompany',data).getResponse();
                response.then( result => {
                    if(result.statuscode == 200) {
                            this.props.navigation.navigate('RegisterCompanySecond', { "request": data })
                            this.setState({ loading: false });
                    }
                    else {
                        this.setState({ loading: false });
                        this.common.showToast(result.message);
                        // var errors = [];
                        // errors.push(result.message);
                        // this.setState({errors: errors})
                    }
                })
               
            });

        }
    }

    

    async getRequestData() {
        const deviceId = await AsyncStorage.getItem("deviceId");
        const fcmToken = await AsyncStorage.getItem("fcmToken");
        // var ins = this.state.inspectionType.map(type => {
        //     return { "inspection_type_id": type }
        // });
        var ins = [{ "inspection_type_id": this.state.inspectionType }]
        
        return {
            "roleid": this.state.role,
            "fname": this.state.fname,
            "lname": this.state.lname,
            "emailid": this.state.email,
            "mobileno": this.state.phone,
            "password": this.state.password,
            "profilepic": this.state.profilePic,
            "deviceid": deviceId,
            "fcmregid": fcmToken,
            "companybio": this.state.bio,
            "inspection_type": ins,
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
            console.log('error: ', error);
        }
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ inspectionType: selectedItems });
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }

        return (
            <Root>
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.heading}>Basic Details</Text>
                        <Form>
                            <View style={styles.center}>
                                <Avatar
                                    size={100}
                                    onPress={() => this.UploadPicture()}
                                    overlayContainerStyle={{ backgroundColor: '#FFF' }}
                                    rounded icon={{ name: 'plus', type: 'font-awesome', color: '#C39666', size: 25 }}
                                    containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
                                    source={this.state.avatarSource}
                                    imageProps={{ resizeMode: 'cover' }}
                                    //avatarStyle={{backgroundColor:'gray'}}
                                    ref={avatarSource => { this.avatarSource = avatarSource }}
                                />
                            </View>
                            <View style={styles.sectionRow}>
                                <View style={[styles.threeRow]}>
                                    <Input autoCompleteType="off" ref={fname => { this.fname = fname }} value={this.state.fname} onChangeText={(text) => this.setState({ 'fname': text })} placeholder="First Name" inputStyle={[styles.font15]} />
                                </View>
                                <View style={[styles.threeRow]}>
                                    <Input autoCompleteType="off" ref={lname => { this.lname = lname }} value={this.state.lname} onChangeText={(text) => this.setState({ 'lname': text })} placeholder="Last Name" inputStyle={[styles.font15]} />
                                </View>
                            </View>
                            <Input autoCompleteType="off" ref={email => { this.email = email }} keyboardType="email-address" value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[styles.font15]} />
                            <Input autoCompleteType="off" ref={phone => { this.phone = phone }} keyboardType="numeric" value={this.state.phone} onChangeText={(text) => this.setState({ 'phone': text })} placeholder="Phone No" inputStyle={[styles.font15]} />
                            {/* <SectionedMultiSelect
                                items={this.state.inspectionList}
                                uniqueKey="Id"
                                displayKey="Name"
                                selectText="Inspection Type (multi-selection)"
                                showDropDowns={true}
                                hideSearch={true}
                                onSelectedItemsChange={this.onSelectedItemsChange}
                                selectedItems={this.state.inspectionType}
                                modalWithTouchable
                                modalWithSafeAreaView
                                alwaysShowSelectText={true}
                                styles={{
                                    selectToggle: styles.sectionBorder,
                                    selectToggleText: styles.font15,
                                    itemText: [styles.font15,{fontWeight:'normal'}],
                                    button: styles.normalButton
                                }}
                                
                            /> */}
                            <View style={styles.border}>
                                <Picker
                                    mode="dialog"
                                    selectedValue={this.state.inspectionType}
                                    ref={inspectionType => { this.inspectionType = inspectionType }}
                                    onValueChange={(value) => this.setState({ inspectionType: value })}
                                >
                                    <Picker.Item label="Inspection Type" value="" />
                                    {this.state.inspectionList.map(inspection => <Picker.Item key={inspection.Id} label={inspection.Name} value={inspection.Id} />)}
                                </Picker>
                            </View>
                            <Input autoCompleteType="off" ref={password => { this.password = password }} secureTextEntry={true} value={this.state.password} onChangeText={(text) => this.setState({ 'password': text })} placeholder="Password" inputStyle={[styles.font15]} />
                            <Input autoCompleteType="off" ref={confirmPassword => { this.confirmPassword = confirmPassword }} secureTextEntry={true} value={this.state.confirmPassword} onChangeText={(text) => this.setState({ 'confirmPassword': text })} placeholder="Confirm Password" inputStyle={[styles.font15]} />
                            <View style={{ width: "94%", marginLeft: 8 }}>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 15, color: 'gray' }}>Add Bio</Text>
                                </View>
                                {/* <View style={{ borderColor: '#e8e8e8', backgroundColor: '#f3f3f3', flexDirection: 'row', borderWidth: 1, padding: 5, marginTop: 10 }} >
                                    <Input autoCompleteType="off" ref={bio => { this.bio = bio }} value={this.state.bio} onChangeText={(text) => this.setState({ 'bio': text })} inputStyle={[styles.font15, { height: 60, justifyContent: "flex-start", width:'100%' }]} />
                                </View> */}
                                <Textarea rowSpan={5} bordered ref={bio => { this.bio = bio }} value={this.state.bio} onChangeText={(text) => this.setState({ 'bio': text })} style={{backgroundColor: '#f3f3f3', borderColor: '#e8e8e8', height:80}} />
                            </View>
                            <View style={styles.nextButtonWrapper}>
                                <Button 
                                    title="Next"
                                    buttonStyle={styles.btnNext}
                                    icon={<Icon name="angle-right" containerStyle={{position:'absolute',right:10}} type="font-awesome" color="#FFF" />}
                                    iconRight
                                    onPress={() => this.onRegister()}>
                                </Button>
                            </View>
                            
                        </Form>
                    </View>
                </ScrollView>
            </Root>
        );
    }
}