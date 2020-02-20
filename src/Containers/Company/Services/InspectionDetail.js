import React, { Component, Profiler } from 'react';
import { View, ScrollView, Image, AsyncStorage, Linking} from 'react-native';
//import styles from '../../../../assets/styles/style';
import style from '../../../../assets/styles/style';
import {
    Root, Form, Picker, Text, Container
} from 'native-base';
import { Icon, Input, Button, Avatar, Overlay } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Common from '../../Common/index';
import Rating from '../../../Components/Rating';
import API from '../../../Api/Api';
import Loader from '../../../Components/Loader';

export default class InspectionDetail extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: navigation.state.params.Inspection ? navigation.state.params.Inspection.InspectionTypeName + " Inspection" : "Inspection",
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            data: [],
            loading: false,
            requestType : '',
            role: [],
            otp1: '',
            otp2: '',
            otp3: '',
            otp4: '',
            otp5: '',
            otp6: '',
            otp: ""
        }
        this.common = new Common();
    }

    componentDidMount() {
        // console.log("navigation: ",this.props.navigation.state.params.Inspection)
        this.getData()
    }
    getData = async () => {
        var Inspection = this.props.navigation.getParam('Inspection');
        console.log("Inspection:", Inspection)
        AsyncStorage.getItem("roleid").then(role => {
            this.setState({ role: role });
        });
        this.setState({ data: Inspection });
    }
    InspectionCompleted = async () => {
        var finalOtp = this.state.otp1 + this.state.otp2 + this.state.otp3 + this.state.otp4 + this.state.otp5 + this.state.otp6
        var otp = finalOtp.toString();
        console.log('hello', otp)
        var token = await AsyncStorage.getItem('authToken');
        var header = { 'authentication': token };
        var data = {
            "inspectionid": this.state.data.InspectionId,
            "inspectorid": this.state.data.InspectorId,
            "status": this.state.requestType,
            "inspectionotp": otp
        }
        console.log("request data: ", data);
        this.setState({ loading: true })
        var response = new API('InspectionMarkedCompleted', data, header).getResponse();
        response.then(result => {
            if (result.statuscode == 200) {
                this.setState({ loading: false })
                this.common.showToast("Inspection Marked Successfully");
                console.log("result success:", result)
                setTimeout(() => {
                    this.back()
                    this.props.navigation.navigate('Service', { 'id': this.state.data.InspectionId, 'date': this.state.data.ScheduleDate })
                })
            }
            else {
                this.setState({ loading: false })
                console.log("result error: ", result)
            }
        }).catch(error => {
            this.setState({ loading: false })
            console.log("error: ", error)
        })
    }

    showButton() {
        if ((this.state.data.InsStatus == "Pending" || this.state.data.InsStatus == "Schedule") && this.state.role == 4) {
            return (
                <View>
                <View>
                    <Text style={{ alignSelf: 'center', color: '#877f7f' }}>Enter OTP</Text>
                </View>
                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <View>
                        <Input ref='otp1' maxLength={1} autoCompleteType="off" secureTextEntry={true} keyboardType="number-pad" inputContainerStyle={{ width: 20 }}
                            onChangeText={text => {
                                this.setState({ otp1: text })
                                //console.log('onChangeText', this.refs.card_exp_date_mm)
                                if (text && text.length == 1) {
                                    this.refs.otp2.focus();
                                }
                            }} />
                    </View>
                    <View>
                        <Input ref='otp2' maxLength={1} autoCompleteType="off" secureTextEntry={true} keyboardType="number-pad" inputContainerStyle={{ width: 20 }}
                            onChangeText={text => {
                                this.setState({ otp2: text })
                                //console.log('onChangeText', this.refs.card_exp_date_mm)
                                if (text && text.length == 1) {
                                    this.refs.otp3.focus();
                                }
                            }} />
                    </View>
                    <View>
                        <Input ref='otp3' maxLength={1} autoCompleteType="off" secureTextEntry={true} keyboardType="number-pad" inputContainerStyle={{ width: 20 }}
                            onChangeText={text => {
                                this.setState({ otp3: text })
                                //console.log('onChangeText', this.refs.card_exp_date_mm)
                                if (text && text.length == 1) {
                                    this.refs.otp4.focus();
                                }
                            }} />
                    </View>
                    <View>
                        <Input ref='otp4' maxLength={1} autoCompleteType="off" secureTextEntry={true} keyboardType="number-pad" inputContainerStyle={{ width: 20 }}
                            onChangeText={text => {
                                this.setState({ otp4: text })
                                //console.log('onChangeText', this.refs.card_exp_date_mm)
                                if (text && text.length == 1) {
                                    this.refs.otp5.focus();
                                }
                            }} />
                    </View>
                    <View>
                        <Input ref='otp5' maxLength={1} autoCompleteType="off" secureTextEntry={true} keyboardType="number-pad" inputContainerStyle={{ width: 20 }}
                            onChangeText={text => {
                                this.setState({ otp5: text })
                                //console.log('onChangeText', this.refs.card_exp_date_mm)
                                if (text && text.length == 1) {
                                    this.refs.otp6.focus();
                                }
                            }} />
                    </View>
                    <View>
                        <Input ref='otp6' maxLength={1} autoCompleteType="off" secureTextEntry={true} keyboardType="number-pad" inputContainerStyle={{ width: 20 }}
                            onChangeText={text => {
                                this.setState({ otp6: text })
                            }} />
                    </View>
                </View>
                <View style={[style.nextButtonWrappers, { flexDirection: 'row' }]}>
                    <Button
                        onPress={() => this.save('Completed')}
                        title="Mark as Complete"
                        buttonStyle={style.btnNexts}
                        iconRight>
                    </Button>
                    <Button
                        onPress={() => this.save('Cancelled')}
                        title="Mark as Cancel"
                        buttonStyle={style.btnNexts}
                        iconRight>
                    </Button>
                </View>
                </View>
            )
        }
        else {
            return null;
        }

    }

    displayErrors(error, flag = 0) {
        this.common.showToast(error);
    }
    save(requestType) {
        if (!this.state.otp1) {
            this.displayErrors("Please Enter Your OTP", 1);
        }
        else if (!this.state.otp2) {
            this.displayErrors("Please Enter Your OTP", 1);
        }
        else if (!this.state.otp3) {
            this.displayErrors("Please Enter Your OTP", 1);
        }
        else if (!this.state.otp4) {
            this.displayErrors("Please Enter Your OTP", 1);
        }
        else if (!this.state.otp5) {
            this.displayErrors("Please Enter Your OTP", 1);
        }
        else if (!this.state.otp6) {
            this.displayErrors("Please Enter Your OTP", 1);
        }
        else {
            this.setState({ isVisible: true, requestType:requestType })
        }
    }
    back() {
        this.setState({ isVisible: false})
    }



    render() {
        if (this.state.loading) return <Loader />
        return (
            <ScrollView style={{ flex: 1 }}>
                <Overlay isVisible={this.state.isVisible} height="auto" overlayStyle={{ width: '78%', }}>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Icon size={20} name="times" type='font-awesome' color="#ccc" onPress={() => this.back()} />
                    </View>
                    <View style={{ alignSelf: 'center', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Icon size={60} name="exclamation-circle" type='font-awesome' color="#28558E" />
                        {/* <Image style={{}} resizeMode="contain" source={require('../../../../assets/images/pin.png')} /> */}
                    </View>
                    <View style={{ marginTop: 5, padding: 13 }}>
                        <Text style={{ color: '#666262', textAlign: 'center' }}>Are you sure want to mark the inspection as {this.state.requestType}?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 40 }}>
                        <View style={style.nextButtonWrappers}>
                            <Button
                                title="Yes"
                                buttonStyle={style.yesButton}
                                onPress={() => this.InspectionCompleted()}
                                iconRight>
                            </Button>
                        </View>
                        <View style={style.nextButtonWrappers}>
                            <Button
                                onPress={() => this.back()}
                                title="No"
                                buttonStyle={style.noButton}
                                titleStyle={{ color: '#28558E' }}
                                iconRight>
                            </Button>
                        </View>

                    </View>
                </Overlay>
                <View style={{ flexDirection: 'row', padding: 13, borderBottomColor: '#ebebe0', borderBottomWidth: 1 }}>
                    <View style={{ flexDirection: 'column', width: '60%' }}>
                        <Text style={{ color: '#28558E', fontSize: 13, fontWeight: 'bold' }}>Inspection Detail</Text>
                        <View style={{ paddingTop: 7 }}>
                            <Text style={style.Text}>{this.state.data.Address}</Text>
                            <Text style={style.Text}>{this.state.data.ZipCode}</Text>
                            <Text style={[style.Text, { fontWeight: 'bold' }]}>Date & Time</Text>
                            <Text style={style.Text}>{this.state.data.ScheduleDate} | {this.state.data.ScheduleTime}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', width: '40%', alignItems: 'flex-end' }}>
                        <Text style={{ color: '#28558E', fontSize: 13, fontWeight: 'bold' }}>Cost</Text>
                        <View style={{ paddingTop: 7 }}>
                            <Text style={style.Text}>${this.state.data.Price ? this.state.data.Price : 0}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 13, borderBottomColor: '#ebebe0', borderBottomWidth: 1 }}>
                    <View style={{ marginVertical: 10, marginLeft: 2 }}>
                        <Text style={[style.capitalize, { fontSize: 13, color: '#28558E', fontWeight: 'bold' }]}>Inspector Detail</Text>
                    </View>
                    <View style={[style.list]}>
                        <View style={[style.center, { width: 70 }]}>
                            <Avatar
                                overlayContainerStyle={{ backgroundColor: '#ebebe0' }}
                                rounded icon={{ name: 'person', color: '#C39666', size: 40 }}
                                size={65}
                                containerStyle={{ borderColor: '#C39666', borderWidth: 1, }}
                                source={{ uri: this.state.data.InspectorProfilePic }}
                            />
                            <Text style={[style.nameTxt, { textAlign: 'center', marginTop: 6, textDecorationLine: 'underline' }]}>{this.state.data.InspectorName}</Text>
                            <Rating
                                rating={parseInt(this.state.data.InspectorRating)}
                            />
                        </View>
                        <View style={style.flatListItemTextRow}></View>
                        <View style={{ width: 120, alignItems: 'flex-end' }}>
                            <Text style={style.nameTxt}>Contact No.</Text>
                            <View style={{ flex: 1, marginTop: 2 }}>
                                <Text style={{ marginTop: 4, fontSize: 13, color: '#6b6868' }}>{this.state.data.InspectorMobileNo}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 13 }}>
                    <Text style={{ color: '#28558E', fontSize: 13, fontWeight: 'bold' }}>Company Detail</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={style.nameTxt}>{this.state.data.InspectionTypeName} Inspection</Text>
                        <Text style={{ fontSize: 13, marginTop: 3, color: '#6b6868' }}>{this.state.data.CompanyBio}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', padding: 13, }}>
                <Text style={{ fontSize: 13, color: '#6b6868' }}><Text style={style.nameTxt}>Address: </Text>{this.state.data.CompanyAddress}</Text>
        
                    
                </View>
                <View style={{ flexDirection: 'row', padding: 13 }}>
                    <Text style={style.nameTxt}>Contact No: </Text>
                    <Text style={{ fontSize: 13, color: '#6b6868' }}>{this.state.data.CompanyMobileNo}</Text>
                </View>
                
                {this.showButton()}


            </ScrollView>
        )
    }
}

