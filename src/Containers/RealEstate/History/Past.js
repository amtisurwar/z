import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, AsyncStorage, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Picker,
} from 'native-base';
import axios from 'react-native-axios'
import { CheckBox, Avatar, SearchBar, Input, Icon, Rating } from 'react-native-elements';
import Loader from '../../../Components/Loader';
import Schedule from '../../../Components/Schedule';
import Common from '../../../Containers/Common';
import API from '../../../Api/Api';

export default class Upcoming extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            value: '',
            data: [],
            originalData: []
        }
        this.common = new Common();
    }

    async componentDidMount() {
        this.getData()
    }

    async getData() {
        var userid = await AsyncStorage.getItem('userid');
        var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
        var body = {"inspectionid": 0, "userid": userid,"flag": 1};
        this.setState({loading: true})
        var response = new API('InspectionHistory',body,header).getResponse();
        response.then( data => {
            console.log("data: ",data)
            if(data.statuscode == 200) {
                this.setState({
                    data: data.result,
                    loading: false,
                })
            }
            else {
                this.setState({loading: true})
                this.common.showToast("Invalid Response")
            }
        }).catch(e => {
            this.setState({loading: true})
            this.common.showToast("Invalid Response")
        })
    }


    searchFilterFunction = text => {                  
        // var data = [...this.state.originalData];
        // this.setState({value: text})
        // const newData = data.filter(item => {
        //     // const itemData = `${item.InspectorName.toUpperCase()}${item.CompanyName.toUpperCase()}${item.Address.toUpperCase()}`;
        //     const textData = text.toUpperCase();
        //     return item.InspectorName.toUpperCase().includes(textData) || item.CompanyName.toUpperCase().includes(textData) || item.Address.toUpperCase().includes(textData);
        // });
        // this.setState({
        //     data: newData
        // });
    };
    
    onRefresh() {
        this.getData()
    }


    renderItem = ({ item, index }) => {
        return <Schedule item={item} />;
    }

    header = () => {
        return (
            <View style={[style.row,{marginTop:20}]}>
              <Input placeholder='Search via company, inspector name, address'
                  onChangeText={text => this.searchFilterFunction(text)}
                  inputStyle={{fontSize:13}}
                  containerStyle={{width:'84%',paddingLeft:7}}
                  inputContainerStyle={{borderWidth:1,borderColor:'#ccc',borderRadius:2,paddingHorizontal:6,marginVertical:2}}
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
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                <View style={style.container}>
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