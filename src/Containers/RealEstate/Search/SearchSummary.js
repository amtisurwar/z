import React, { Component } from 'react';
import {Animated, NativeModules, processColor, LayoutAnimation, AsyncStorage, UIManager, Dimensions, Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../../../assets/styles/style.js';
import {
    Container, Header, Content,  CardItem,
    Text, Body, Form, Item, Input, Picker
} from 'native-base';
import { Avatar, Icon, Overlay, Rating, CheckBox, Card, Button } from 'react-native-elements';
import Advertisement from '../../../Components/Advertisement';
import Common from '../../Common';
import Errors from '../../../Components/Errors';
import API from '../../../Api/Api';
import Loader from '../../../Components/Loader';
//import RNCalendarEvents from 'react-native-calendar-events';

export default class SearchSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
           date: '',
           time: '',
           address: '',
           inspectionList: [],
           inspectiontype: [],
           inspectionMarked: [],
           errors: [],
           success: false,
           response: [],
        }
        this.common = new Common();
        
        this.animatedValue = new Animated.Value(0);
        if( Platform.OS === 'android' ) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    getData() {
        var request = this.props.navigation.getParam('request');
        this.setState({
            address:request.address,
            date: request.inspectiondate,
            time: request.time,
            inspectionList: this.props.navigation.getParam('inspectionList'),
            inspectiontype:request.inspectiontype,
            inspectionMarked: this.props.navigation.getParam('inspectionMarked')
        })
    }
    componentDidMount() {
        Animated.timing(
            this.animatedValue,
            {
              toValue: 0.5,
              duration: 500,
              useNativeDriver: true
            }
          ).start(() => {
            this.getData();
        });
    }


    // async authorizationStatus () {
    //     return RNCalendarEvents.getCalendarPermissions()
    //   }
    
    //   async authorizeEventStore () {
    //     return RNCalendarEvents.requestCalendarPermissions()
    //   }
    
    //   async fetchAllEvents (startDate, endDate, calendars = []) {
    //     return RNCalendarEvents.findAllEvents(startDate, endDate, calendars)
    //   }
    
    //   async findCalendars () {
    //     return RNCalendarEvents.findCalendars()
    //   }
    
    //   async saveCalendar (options = {}) {
    //     return RNCalendarEvents.saveCalendar({
    //       ...options,
    //       color: options.color ? processColor(options.color) : undefined,
    //     });
    //   }
    
    //   async findEventById (id) {
    //     return RNCalendarEvents.findById(id)
    //   }
    
    //   async saveEvent (title, details, options = {sync: false}) {
    //     return RNCalendarEvents.saveEvent(title, details, options)
    //   }
    
    //   async removeEvent (id, options = {sync: false}) {
    //     return RNCalendarEvents.removeEvent(id, options)
    //   }
    
    //   async uriForCalendar () {
    //     return CalendarEvents.uriForCalendar()
    //   }
    
    //   openEventInCalendar (eventID) {
    //     CalendarEvents.openEventInCalendar(eventID)
    //   }

    removeRow = (id) => {
        var filteredAry = this.state.inspectionMarked.filter((item) => {
            return item.InspectionTypeId !== id
        })
        if(filteredAry.length < 1) {
            console.log("id:",id,filteredAry)
            this.common.showToast("You cannot remove all Inspections")
            return false;
        }
        this.setState(() => {
            return {
                inspectionMarked: filteredAry
            }
          }, () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        });
    }

    Row = (item) => {
        return(
            <View key={item.InspectionTypeId}>
                <Text style={[styles.heading2, styles.capitalize, styles.container]}>{this.common.getInspectionName(item.InspectionTypeId, this.state.inspectionList)} Inspection</Text>
                <View style={[styles.summarySelectedIspector,{marginBottom:15}]}>
                <View style={[styles.center,{width:80}]}>
                    <Avatar
                        rounded
                        source={{
                            uri: item.ProfilePic,
                        }}
                        size="large"
                    />
                    <Text style={[styles.nameTxt,{textAlign:'center', marginBottom:6, textDecorationLine:'underline'}]}>{item.InspectorName}</Text>
                    <Rating
                        ratingCount={5}
                        imageSize={14}
                        readonly
                        startingValue={parseInt(item.Rating)}
                    />
                </View>
                <View style={styles.flatListItemTextRow}>
                    <Text style={styles.nameTxt}>{item.CompanyName}</Text>
                    <Text style={styles.nameTxt2}>{item.CompanyBio}</Text>
                </View>
                <View style={{justifyContent:'space-between'}}>
                    <View style={styles.center}>
                        <Text style={styles.nameTxt}>$ {item.Price}</Text>
                    </View>
                    <View style={[styles.center]}>
                        <Icon type="font-awesome" size={28} name='trash-o' onPress={() => this.removeRow(item.InspectionTypeId)} />
                    </View>
                </View>
                </View>
            </View>
        )
    }

    closeModel = async (nhdFlag) => {
        this.setState({success:false})
        var authToken = await AsyncStorage.getItem("authToken");
        var inspectionid = this.state.response.result.InspectionId;
        var header = {"authentication":authToken};
        var data = {"inspectionid":inspectionid,flag:nhdFlag};
        var response = new API('NHDFlagUpdate',data,header).getResponse()        
        this.props.navigation.navigate('Search',{'success':inspectionid})
    }

    save = async () => {
        this.setState({loading: true});
        var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
        this.getRequestData().then(data => {
            console.log("request 2: ",JSON.stringify(data))
            var response = new API('CreateInspection',data,header).getResponse();
            console.log("response: ",response)
            response.then( result => {
                this.setState({loading: false});
                if(result.statuscode == 200) {
                    this.setState({
                        response: result
                    })
                    this.setState({success:true})
                }
                else {
                    var errors = [];
                    errors.push("invalid response");
                    this.setState({errors: errors})
                }
            }).catch(error => {
                this.setState({loading: false});
                var errors = [];
                errors.push("Please try again later");
                this.setState({errors: errors})
            })
        });
    }

    async getRequestData() {
        var request  = this.props.navigation.getParam('request');
        var inspectors = [];
        var inspectiontypes = [];
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        request.inspectiontype.map(item => {
            var row = {"inspectionid":0,inspectiontypeid:item}
            inspectiontypes.push(row)
        })
        
        this.state.inspectionMarked.map(item => { 
            var row = {"inspectionid":0,"inspectiontypeid":parseInt(item.item.InspectionTypeId),"inspectorid":parseInt(item.item.InspectorId),"companyid":parseInt(item.item.CompanyId),"price": item.item.Price}
            inspectors.push(row);
        })
        
        
        return {
            "inspectionid":0,
            "agentid":profile.AgentId,
            "address":request.address,
            "city":request.other.city,
            "state":request.other.state,
            "country":"USA",
            "zipcode":request.other.zipcode,
            "foundationid":request.other.foundation,
            "propertyage":request.other.age,
            "sqrfootage":request.other.metrixId,
            "propertytypeid":request.other.propertyType,
            "scheduledate":request.other.date,
            "scheduletime":request.other.displayTime,
            "inspectiontypes":inspectiontypes,
            "inspectors":inspectors
        }
    }
      

    render() {
        if(this.state.loading) {
            return <Loader />
        }
        
        return (
           <ScrollView>
            <Overlay 
                isVisible={this.state.success}
                windowBackgroundColor="rgba(255, 255, 255, .8)"
                overlayStyle={[styles.overlayContainer,{width:'95%',height:'auto',}]}
                
            >
                <Icon
                    name="check-circle"
                    type="material"
                    color="#43DEAE"
                    size={100}
                />
                <Text style={[styles.heading2,{fontSize:26}]}>Congratulations!</Text>
                <Text style={{color:'#808080'}}>Inspection(s) has been scheduled.</Text>
                <Text style={[styles.heading2,{marginTop:40, marginBottom:30}]}>Do you want to order an NHD?</Text>
                <View style={styles.row}>
                    <Button 
                        buttonStyle={styles.modelButton2}
                        titleStyle={styles.primaryColor}
                        type="outline" 
                        title="No, Thanks"
                        onPress={() => this.closeModel(0)}
                    />
                    <Button 
                        buttonStyle={styles.modelButton} 
                        title="Yes, Sure"
                        onPress={() => this.closeModel(1)}
                    />
                </View>
            </Overlay>
            <Advertisement />
            <Animated.View>
                <View style={styles.container}>
                    <Text style={styles.heading2}>Inspection Request</Text>
                    <View style={[styles.row]}>
                        <View style={{justifyContent:"space-between",flex:1}}>
                            <Text style={styles.font12}>{this.state.address}</Text>
                        </View>
                        <View style={{justifyContent:"space-between",flex:1}}>
                            <Text style={[{textAlign:'right'},styles.font12]}>{this.state.date} | {this.state.time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.border2}></View>
                <Errors errors={this.state.errors} />
                <View>
                    {this.state.inspectionMarked.map( (item) => this.Row(item.item))}
                </View>
                <View style={styles.center}>
                    <Button 
                        buttonStyle={styles.modelButton} 
                        onPress={() => this.save()}
                        title="Confirm"
                    />
                </View>
            </Animated.View>
            </ScrollView>
        );
    }
}