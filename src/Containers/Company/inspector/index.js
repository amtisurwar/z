import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, AsyncStorage, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../../assets/styles/styles.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Picker,
} from 'native-base';
import axios from 'react-native-axios'
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import Loader from '../../../Components/Loader';
//import Errors from '../../Components/Errors';
import API from '../../../Api/Api';



export default class Inspectionlist extends Component {
    constructor(props) {
        
        super(props)
        this.state = {
            inspector_id: '',
            searchtext: '',
            company_id: '',
            value: '',
            data: [],
            fullData: [],
            errors: [],
            loading: false,
            refreshing: false
        }
    }

    componentDidMount() {
        this.Inspectorlist();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.navigation.getParam('InspectorId') !== prevProps.navigation.getParam('InspectorId')) {
            this.Inspectorlist()
        }
	}

    Inspectorlist = async () => {
        var authToken = await AsyncStorage.getItem("authToken");
        this.getRequestData().then( data => {
            var header = {"authentication":authToken};
            var response = new API('InspectorList',data,header).getResponse();
            response.then( result => {
                console.log("inspector list: ",result)
                if(result.statuscode == 200) {
                        this.setState({ 
                            data: result.result, 
                            fullData: result.result,
                            refreshing: false
                        })
                        
                }
                else {
                    var errors = [];
                    this.setState({errors: errors})
                }
            })
        });
    }
    
    async getRequestData() {
    
        var profile = JSON.parse(await AsyncStorage.getItem('profile'));
        var companyId = profile.CompanyId;
        return {
            "inspector_id": 0,
            "searchtext": '',
            "company_id": companyId,
        }
    }

    searchFilterFunction = text => {
        var fullData = this.state.fullData
        this.setState({
            value: text
        });
        const textData = text.toUpperCase();        
        const newData = fullData.filter(item => {
            return item.Name.toUpperCase().includes(textData) || item.EmailId.toUpperCase().includes(textData) || item.MobileNo.toUpperCase().includes(textData);
        });

        this.setState({
            data: newData,
            //text:text
        });
    };

    onRefresh() {
        //Clear old data of the list
        this.setState({ data: [] });
        //Call the Service to get the latest data
        this.Inspectorlist();
      }

      clickEventListener(item) {
        Alert.Alert(item.Name)
      }


    renderItem = ({ item, index }) => {
        return (
            <View style={styles.rows}>
                <Image source={{ uri: item.ProfilePic }} style={styles.pic} />
                <View>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxt}>{item.Name}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxt}>{item.EmailId}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxt}>{item.MobileNo}</Text>
                    </View>
                </View>
                <Icon
                    size={25}
                    name="angle-right"
                    type="font-awesome"
                    raised
                    color="#28558E"
                    onPress={() => this.props.navigation.navigate('InspectorDetail',{inspector:item})}
                />
            </View>
           
        );
    }

    header = () => {
      return (
        <View style={style.row}>
            <Input placeholder='Search via Inspector name, email or phone'
                inputStyle={{fontSize:12}}
                onChangeText={text => this.searchFilterFunction(text)}
                containerStyle={{width:'85%'}}
                inputContainerStyle={{borderWidth:1, borderColor:'#ccc',borderRadius:2, paddingHorizontal:6,marginVertical:2}}
                rightIcon={
                    <Icon
                        size={20}
                        name="search"
                    />
                }
            />
            <View>
                <Icon
                    size={20}
                    name="plus"
                    type="font-awesome"
                    reverse
                    color="#28558E"
                    onPress={() => this.props.navigation.navigate('CreateInspector')}
                />
            </View>
        </View>
      )
    }

    render() {
        if (this.state.refreshing) {
            return (
              //loading view while data is loading
              <View style={{ flex: 1, paddingTop: 20 }}>
                <ActivityIndicator />
              </View>
            );
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
                <View style={styles.homeContainer}>
                    <FlatList
                        extraData={this.state}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.header}
                          />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    rows: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        justifyContent: 'space-between',
        paddingLeft: 10,
        borderBottomColor:'#000',
        borderBottomWidth:1,
        backgroundColor:'#FFF'
    },
    content:{
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center'
    },
    searchfilter:{
        width:330, 
        marginLeft:10
    },
    pic: {
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    icon:{
        marginLeft:10,
        padding:5
    },
    nameContainers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
    },
    nameTxt: {
        fontWeight: '600',
        color: '#222',
        fontSize: 15,

    },
    homeContainer: {
        flex: 1,
    },
    advertisementSpace: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    white: {
        color: '#fff'
    },
    inspectionRequestFormContainer: {
        paddingLeft: 10,
        paddingRight: 30,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameTxt: {
        fontWeight: '600',
        color: '#222',
        fontSize: 15,

    },
    advertisementSpaces: {
        height: 35,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28558E',
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    loginButton: {
        backgroundColor: '#28558E',
        borderRadius: 10,
        paddingHorizontal: 30,
        marginVertical: 20,
        height: 35,
    },

});    
