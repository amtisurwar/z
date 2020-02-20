import React, { Component } from 'react';
import { RefreshControl, View, ScrollView, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import style from '../../../../assets/styles/style.js';
import { Text } from 'native-base';
import { Input, Icon } from 'react-native-elements';
import InspectionSchedule from '../../../Components/InspectionSchedule';
import Loader from '../../../Components/Loader';
import CalendarPicker from 'react-native-calendar-picker';
import TestJson from '../../../Components/testjson.json';
import API from '../../../Api/Api';
import Common from '../../Common';

export default class Inspections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            refreshing: false,
            Data: [],
            FreshDataList: [],
            customDates: [],
            show: true,
            currentDate: '',
            date: new Date(),
        }
        this.common = new Common();
    }


    componentDidMount() {
        this.getDate()
        this.loadData()
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.navigation.getParam('id') !== prevProps.navigation.getParam('id')) {
            console.log("called componentDidUpdate")
            this.loadData(this.props.navigation.getParam('date'))
        }
    }

    loadData = async (date = null) => {
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var token = await AsyncStorage.getItem('authToken');
        var header = { 'authentication': token };
        var apiDate = date ? date : this.common.getDateFormat(new Date());
        console.log("profile loadData: ",profile)
        var data = {
            "companyid":profile.CompanyId,
            "inspectionid":0,
            "inspectorid": profile.InspectorId,
            "date": apiDate
        }
        console.log("request: ",data,profile)
        
        var response = new API('CompanyInspectionList', data, header).getResponse();
        
        response.then(result => {
            console.log("response: ",result);
            if (result.statuscode == 200) {
                this.setState({
                    Data: result.result.company_inspection,
                    FreshDataList: result.result.company_inspection
                })
                this.loadDates(result.result.company_calender)
            }
            else {
                console.log("error: ",result)
            }
        })
    }

    getDate() {
        var that = this;
        var date = new Date().getDate();
        var monthNumber = (new Date().getMonth());
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = month[monthNumber];
        var year = new Date().getFullYear();
        that.setState({ currentDate: month + ' ' + date + ', ' + year, });
    }

    onRefresh() {
        this.loadData();
    }

    loadDates = (dates) => {
        var customDates = [];
        dates.map( item => {
            if(item.InsStatus == "Pending" || item.InsStatus == 'Schedule') {
                customDates.push({
                    date: item.ScheduleDate,
                    textStyle: { color: '#FFF' },
                    containerStyle: { backgroundColor: 'green',  width:22, height:22, borderRadius:30, padding:18 },
                })
            }
            else if(item.InsStatus == "Completed") {
                customDates.push({
                    date: item.ScheduleDate,
                    textStyle: { color: '#FFF' },
                    containerStyle: { backgroundColor: '#000',  width:22, height:22, borderRadius:30, padding:18 },
                })
            }
            else if(item.InsStatus == "Canceled") {
                customDates.push({
                    date: item.ScheduleDate,
                    textStyle: { color: '#FFF' },
                    containerStyle: { backgroundColor: '#de879c',  width:22, height:22, borderRadius:30, padding:18 },
                })
            }
        })
        console.log("customDates: ",customDates)
        this.setState({
            customDates: customDates
        });

    }

    ShowHideComponent = () => {
        if (this.state.show == true) {
            this.setState({ show: false });
        } else {
            this.setState({ show: true });
        }

    };

    renderItem = ({ item, index }) => {
        return (
            <View>
                <InspectionSchedule item={item} />
            </View>
        )
    }

    searchFilterFunction = (term) => {
        let FreshDataList = [...this.state.FreshDataList]
        if (term === '') {
            this.setState({ Data: FreshDataList })
        } else {
            var term = term.toUpperCase()
            var filterList = FreshDataList.filter(item => {
                return item.InspectorName.toUpperCase().includes(term) || item.CompanyName.toUpperCase().includes(term) || item.Address.toUpperCase().includes(term)
            })
            this.setState({ Data: filterList })
        }

    };

    onDateChange = (date) => {
        this.setState({ date: date })
        const formattedDate = this.common.getDateFormat(new Date(date.toString()))
        this.loadData(formattedDate);
        // console.log("customDate: ",new Date(date.toString()));
    }

    header = () => {
        return (
            <View style={[style.row, { marginTop: 20 }]}>
                <Input placeholder='Search via company, inspector name, address'
                    onChangeText={text => this.searchFilterFunction(text)}
                    inputStyle={{ fontSize: 13 }}
                    containerStyle={{ width: '84%', paddingLeft: 7 }}
                    inputContainerStyle={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 2, paddingHorizontal: 6, marginVertical: 2 }}
                    rightIcon={
                        <Icon
                            size={20}
                            name="search"
                            color="gray"
                        />
                    }
                />
                <View>
                    <Icon
                        size={26}
                        name="sliders"
                        type="font-awesome"
                        color="gray"
                        containerStyle={[style.borderIcon]}
                        onPress={ () => this.props.navigation.navigate('CreateOfflineBooking')}
                    />
                </View>
            </View>
        )
    }


    render() {
        if (this.state.refreshing || this.state.loading) return <Loader />

        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                <View>
                    <TouchableOpacity activeOpacity={0.9} style={style.showHide} onPress={this.ShowHideComponent}>
                        <View style={style.Top}>
                            <Text style={{ color: 'white' }}>{this.state.currentDate}</Text>
                        </View>
                        {this.state.show ? (
                            <View style={style.TopIcon}>
                                <Icon size={14} name='chevron-up' type='font-awesome' color="white" containerStyle={{ marginTop: 5, marginLeft: 5 }} />
                            </View>
                        ) :
                            <View style={{ position: 'absolute', alignSelf: 'flex-end', paddingRight: 15, paddingTop: 7 }}>
                                <Icon size={14} name='chevron-down' type='font-awesome' color="white" containerStyle={{ marginTop: 5, marginLeft: 5 }} />
                            </View>}

                    </TouchableOpacity>
                    {this.state.show ? (
                        <View style={{borderBottomColor:'#ccc', borderBottomWidth:1}}>
                            <CalendarPicker
                            onDateChange={this.onDateChange}
                            customDatesStyles={this.state.customDates}
                            />
                        </View>
                    ) : null}
                    <View style={style.containers}>
                        <FlatList
                            data={this.state.Data}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={this.renderItem}
                            ListHeaderComponent={this.header}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}