import React, {Component} from 'react';
import {Platform, StyleSheet, StatusBar, RefreshControl, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../../../assets/styles/style.js';
import { Container, Header, Content,  Card, CardItem,
	 Text, Body, Form, Item, Picker, Grid, Col, Row } from 'native-base';
import { CheckBox, Avatar, Icon, Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Common from '../Common/index.js';
import Loader from '../../Components/Loader';
import Advertisement from '../../Components/Advertisement';
import Errors from '../../Components/Errors';
import GoogleSearch from '../../Components/GoogleSearch';
import API from '../../Api/Api';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import firebase from 'react-native-firebase';

export default class Search extends Component {
	constructor(props) {
        super(props)
        this.state = this.states()
        this.common = new Common();
        this.mapAddress = this.mapAddress.bind(this);
    
    }

    states() {
        var today = new Date();
        return {
            address: '',
            state: '',
            city: '',
            zipcode: '',
            date:(today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear(),
            time: '00:00',
            displayTime: '00:00',
            age: '',
            squareFootage: '',
            foundation: '',
            propertyType : '',
            inspections: [],
            propertyList: [],
            inspectionList: [],
            stateList: [],
            cityList: [],
            submit: false,
            errors: [],
            mapAddress: [],
            foundationList: [],
            metrix: [],
            metrixId: '',
            latitude: '',
            longitude: '',
            refreshing: false,
        }
    }
    
    componentDidMount() {
        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         console.log("position: ",position)
        //     },
        //     (error) => console.log("error: ",error),
        //     { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        // );
        this.getData();
    }

    onRefresh = () => {
        this.setState(this.states());
        this.getData();
    }


    gotoList = () => {
        // firebase.crashlytics().enableCrashlyticsCollection();
        // var ress = firebase.crashlytics();
        // firebase.crashlytics().recordError(37,"Test Error");
        
        // console.log("ress: ",ress,firebase.crashlytics().log("Test Message"));
        // this.props.navigation.navigate('History2',{"success": Math.floor(Math.random() * 10)})
        if(this.validate()) {
            var req =  this.getRequestData();
            console.log("req: ",JSON.stringify(req));
            this.props.navigation.navigate('CompanyListing',{
                "inspectionList":this.state.inspectionList,
                "request" : req,
            })
        }
    }

    getRequestData = (page = 1) => {
        var inspections = [];
            this.state.inspections.map( inspectionId => {
                inspections.push({inspectiontypeid:inspectionId})    
        })
        return {
            "address": this.state.address,
            "inspectionlng": this.state.longitude,
            "inspectionlat": this.state.latitude,
            "inspectiondate": this.state.date,
            "flag":2,
            "pageno":page,
            "pricemetrixid": this.state.metrixId,
            "time": this.state.time,
            "inspectiontype":inspections,
            "foundationid":this.state.foundation,
            "propertytypeid": this.state.propertyType,
            "other": this.state
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if(this.props.navigation.getParam('success') !== prevProps.navigation.getParam('success')) {
            this.setState(this.states());
            this.getData(1);
        }
	}

    mapAddress = (data, details) => {
        this.setState({address:data.description,mapAddress: details})
        var parseAdderss = this.common.parseAddress(details);
        const { location } = details.geometry;
        this.setState({
            zipcode: parseAdderss.zipcode,
            state: parseAdderss.state,
            city: parseAdderss.city,
            latitude: location.lat,
            longitude: location.lng,
        })
        
    }

    validate = () => {        
        if(!this.state.address) {
            this.common.showToast('Enter Street Address')
        }
        else if(!this.state.date) {
            this.common.showToast('Select Date')
        }
        else if(!this.state.time) {
            this.common.showToast('Select Time')
        }
        else if(!this.state.propertyType) {
            this.common.showToast('Select Property Type')
        }
        else if(!this.state.foundation) {
            this.common.showToast('Select Foundation Type')
        }
        else if(!this.state.metrixId) {
            this.common.showToast('Select Square Footage')
        }
        else if(!this.state.age) {
            this.common.showToast('Enter Number of Stories')
        }
        else if(this.state.inspections.length <= 0) {
            this.common.showToast('Select Inspection Category')
        }
        else {
            return true;
        }
        return false;
    }



    async getData(flag = 0) {
        var data = {"recordid":0, "flag": 0}
        this.setState({loading:true})
        await this.common.getInspectionData(data).then(response => {
            this.setState({loading: false})
            console.log("getInspectionData response",response)
            if(flag) {
                this.props.navigation.navigate('History2',{success:this.props.navigation.getParam('success')});
            }
            this.setState({
                propertyList: response.result.propertytype,
                inspectionList: response.result.inspectiontype,
                foundationList: response.result.foundation,
                metrix: response.result.metrix,
            })
        });
    }


    handleCheckbox(id,index) {
        var checkboxes = [...this.state.inspections];
        var index = checkboxes.indexOf(id);
        if(index >= 0) {
            checkboxes.splice(index,1);
        } else {
            // checkboxes.push(index);
            checkboxes.push(id)
        }
        
        this.setState({inspections: checkboxes});
        // var list = [...this.state.inspections];
        // for(var i = 0; i<list.length;i++) {
        //     if(list[i] == id) {
        //         list.splice(i,1);
        //     }
        // }
        // list.push(id)
        // this.setState({
        //     inspections: list
        // })
        
    }

    printInspectionList = () => {
        return(
            <View style={{flexDirection:'row', flexWrap: 'wrap'}}>
                {this.state.inspectionList.map((inspection, index) => {
                    var check = this.state.inspections.indexOf(inspection.InspectionTypeId) >= 0 ? true : false; 
                    return(
                        <CheckBox
                            containerStyle={{width:'44%',padding:0,height:40,borderWidth:0,marginHorizontal:0, backgroundColor:'#FFF'}}
                            key={inspection.InspectionTypeId}
                            textStyle={{fontWeight:'normal'}}
                            title={inspection.InspectionTypeName}
                            checked={check}
                            onPress={() => this.handleCheckbox(inspection.InspectionTypeId,index)}
                        />
                    )
                })}               
            </View>
        )
    }

    getPropertyList = (value) => {
        this.setState({foundation:value})
        // var data = {"recordid":value, "flag": 0}
        // this.common.getInspectionData(data).then(response => {
        //     this.setState({
        //         propertyList: response.result.propertytype,
        //     })
        // });
    }
    
    changeTime(time) {
        this.setState({
            time: time,
            displayTime: this.common.getTwentyFourHourTime(time)
        })
    }

    render() {
        if(this.state.loading) {
            return <Loader />
        }
        
        return (
            <ScrollView
            refreshControl={
                <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                />
            }>
                <View>
                    <Advertisement />
                    <Form>
                        <Errors errors={this.state.errors} />
                        <Text style={styles.heading}>Inspection Request</Text>
                        <GoogleSearch placeholder="Street Address" value={this.state.address} mapAddress={this.mapAddress} icon={true} />
                        <View style={[styles.twoRow]}>
                            <Input containerStyle={styles.threeRow} disabled placeholder="State" value={this.state.state} inputStyle={[styles.font15]} />
							<Input containerStyle={styles.threeRow} disabled placeholder="City" value={this.state.city} inputStyle={[styles.font15]} />
						</View>
                        <Input containerStyle={styles.threeRow} disabled keyboardType="numeric" value={this.state.zipcode} placeholder="Zip" inputStyle={[styles.font15]} />
                        <View style={styles.sectionRow}>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                mode="date"
                                minDate={this.state.date}
                                date={this.state.date}
                                placeholder="Date"
                                format="MM/DD/YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => {this.setState({date: date})}}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='calendar'
                                    type='font-awesome'
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
                                is24Hour={false}
                                date={this.state.displayTime}
                                placeholder="HH:MM"
                                format='h:mm A'
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(time) => this.changeTime(time)}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='clock-o'
                                    type='font-awesome'
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
                        <View style={styles.border}>
                            {/* <SectionedMultiSelect
                                items={this.state.propertyList}
                                uniqueKey="PropTypeId"
                                displayKey="PropType"
                                selectText="Property Type"
                                showDropDowns={true}
                                hideSearch={true}
                                onSelectedItemsChange={(value) => this.setState({propertyType:value})}
                                selectedItems={this.state.propertyType}
                                modalWithTouchable
                                modalWithSafeAreaView
                                alwaysShowSelectText={true}
                                single={true}
                                hideConfirm={true}
                                headerComponent={<Text style={{fontWeight:'bold',borderBottomColor:'#ccc', borderBottomWidth:1, paddingBottom:10, margin:10}}>Select Property Type</Text>}
                                styles={{
                                    selectToggle: styles.sectionBorder,
                                    selectToggleText: styles.font15,
                                    itemText: [styles.font15,{fontWeight:'normal'}],
                                    button: styles.normalButton
                                }}
                                
                            /> */}
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.propertyType}
                                onValueChange={ (value) => this.setState({propertyType:value})}
                                style={styles.picker}
                            >
                                <Picker.Item label="Property Type" value="" />
                                {this.state.propertyList.map(propery => <Picker.Item label={propery.PropType} value={propery.PropTypeId} key={propery.PropTypeId} />)}
                            </Picker>
                        </View>
                        <View style={styles.border}>
                            {/* <SectionedMultiSelect
                                items={this.state.foundationList}
                                uniqueKey="Id"
                                displayKey="Name"
                                selectText="Foundation Type"
                                showDropDowns={true}
                                hideSearch={true}
                                onSelectedItemsChange={(value) => this.getPropertyList(value)}
                                selectedItems={this.state.foundation}
                                modalWithTouchable
                                modalWithSafeAreaView
                                alwaysShowSelectText={true}
                                single={true}
                                hideConfirm={true}
                                headerComponent={<Text style={{fontWeight:'bold',borderBottomColor:'#ccc', borderBottomWidth:1, paddingBottom:10, margin:10}}>Select Foundation</Text>}
                                styles={{
                                    selectToggle: styles.sectionBorder,
                                    selectToggleText: styles.font15,
                                    itemText: [styles.font15,{fontWeight:'normal'}],
                                    button: styles.normalButton
                                }}
                                
                            /> */}
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.foundation}
                                onValueChange={ (value) => this.getPropertyList(value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Foundation Type" value="" />
                                {this.state.foundationList.map(foundation => <Picker.Item label={foundation.Name} value={foundation.Id} key={foundation.Id} />)}
                            </Picker>
                        </View>
                        
                        <View style={styles.border}>
                            {/* <SectionedMultiSelect
                                items={this.state.metrix}
                                uniqueKey="PriceMetrixId"
                                displayKey="Area"
                                selectText="Select Square Footage"
                                showDropDowns={true}
                                hideSearch={true}
                                onSelectedItemsChange={(value) => this.setState({metrixId:value})}
                                selectedItems={this.state.metrixId}
                                modalWithTouchable
                                modalWithSafeAreaView
                                alwaysShowSelectText={true}
                                single={true}
                                hideConfirm={true}
                                selectLabelNumberOfLines={10}
                                headerComponent={<Text style={{fontWeight:'bold',borderBottomColor:'#ccc', borderBottomWidth:1, paddingBottom:10, margin:10}}>Select Square Footage</Text>}
                                styles={{
                                    selectToggle: styles.sectionBorder,
                                    selectToggleText: styles.font15,
                                    itemText: [styles.font15,{fontWeight:'normal'}],
                                    button: styles.normalButton,
                                    
                                }}
                                
                            /> */}
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.metrixId}
                                onValueChange={ (value) => this.setState({metrixId:value})}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Square Footage" value="" />
                                {this.state.metrix.map(met => <Picker.Item label={met.Area} value={met.PriceMetrixId} key={met.PriceMetrixId} />)}
                            </Picker>
                        </View>
                        <Input keyboardType="numeric" value={this.state.age} onChangeText={(text) => this.setState({'age': text})}  placeholder="Number of Stories" inputStyle={[styles.font15]}  />

                        <Text style={[styles.heading,{marginVertical:20}]}>Choose Inspection</Text>
                        {this.printInspectionList()}
                        <View style={styles.center}>
                            <Button 
                                title="Next"
                                buttonStyle={styles.btnNext}
                                onPress={() => this.gotoList()}>
                                
                            </Button>
                        </View>
                    </Form>
                </View>
                <StatusBar backgroundColor="#28558E" barStyle="light-content" />
            </ScrollView>
        );
    }
}