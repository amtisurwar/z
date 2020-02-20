import React, { Component } from 'react';
import { Platform, StyleSheet, FlatList, View, StatusBar, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import styles from '../../../../assets/styles/style2.js';
import styles2 from '../../../../assets/styles/style.js';
import {
    Container, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Title, Form, Item, Picker, Toast,
} from 'native-base';
import { CheckBox, Avatar, Input, Slider, Icon, Button } from 'react-native-elements';
import API from '../../../Api/Api';
import Loader from '../../../Components/Loader';
import Common from '../../../Containers/Common';



export default class RegisterMatrix extends Component {
    constructor(props) {
        super(props)
        this.state = {
            foundation: [],
            currentPage: 0,
            loading: false,
            priceMatrix: [],
            filledMatrix: []
        }
        this.common = new Common();
    }

    componentDidMount() {
        this.getFoundation();
    }

    updateMatrix = (key,value,field) => {
        var priceMatrix = [...this.state.priceMatrix];
        priceMatrix[this.state.currentPage][key][field] = value;
        this.setState({
            priceMatrix
        })
    }


    async getFoundation() {
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var companyId = profile.CompanyId;
        this.common.getCompanyFoundation(companyId).then(foundation => {
            var list = [];
            foundation.result.foundation.map(item => {
                var arr = []
                foundation.result.custom_price_metrix.map(mat => {
                    arr.push(
                        { 
                            "PriceMetrixId":mat.PriceMetrixId,
                            "AreaStart":mat.AreaStart,
                            "AreaEnd":mat.AreaEnd,
                            "Price":0 ,
                            "DurationMin":0,
                            "InspectionTypeId":item.InspectionTypeId,
                            "FoundationId":item.FoundationId,
                            "PropertyTypeId":item.PropTypeId
                        }
                    )
                })
                list.push(arr);
            })
            this.setState({
                priceMatrix: list,
                foundation: foundation.result.foundation,
                filledMatrix: foundation.result.company_price_metrix
            })
        })
    }

    priceRow = ({ item, index }) => {
        var AreaStart = item.AreaStart
        var AreaEnd = item.AreaEnd
        var Price = item.Price
        var DurationMin = item.DurationMin
        return(
            <View style={[styles.sectionMatrixRow, {backgroundColor: (index % 2 == 0) ? '#ecf0f1' : '#fff', padding:5, width:'106%'}]}  key={item.InspectorId}>
                <View style={[styles.matrixNumber, {marginHorizontal:0}]}>
                    <Text style={[ {fontSize:13,  color:'gray', minWidth:90, textAlign:'center'}]}>{AreaStart}-{AreaEnd}</Text>
                </View>
                <View style={[styles.matrixNumber, {marginLeft:40}]}>
                <Input 
                    containerStyle={{padding:0,margin:0, width:60, alignItems:'flex-start', alignSelf:'flex-start'}} 
                    inputContainerStyle={{padding:0,margin:0}} 
                    leftIconContainerStyle={{marginRight:5}}
                    inputStyle={{padding:0,margin:0, fontSize:15}} 
                    value={Price == 0 ? "" : Price.toString()} 
                    style={{padding:0,}}
                    onChangeText={(text) => this.updateMatrix(index,text,'Price')}
                    keyboardType="numeric"  />
                </View>
                <View style={{flex:1, justifyContent:'center',alignItems:'center', marginRight:18}}>
                    <Input 
                    containerStyle={{padding:0,margin:0, width:60, alignItems:'flex-end', alignSelf:'flex-end'}} 
                    inputContainerStyle={{padding:0,margin:0}} 
                    leftIconContainerStyle={{marginRight:5}}
                    inputStyle={{padding:0,margin:0, fontSize:15}} 
                    value={DurationMin == 0 ? "" : DurationMin.toString()} 
                    style={{padding:0,}}
                    onChangeText={(text) => this.updateMatrix(index,text,'DurationMin')}
                    keyboardType="numeric"  />
                </View>
            </View>
        )
    }

    updateCheckbox = (index, checkedStatus) => {
        var foundation = [...this.state.foundation];
        foundation[index].IsChecked = !foundation[index].IsChecked;
        this.setState({foundation});
    }

    FillMatrix = (index, checkedStatus) => {
        
        var matrix = [...this.state.priceMatrix];
        var filledMatrix = [...this.state.filledMatrix];
        
        filledMatrix.map( item => {
            matrix[index].filter( (row, key) => {
                if(row.PriceMetrixId == item.PriceMetrixId && row.FoundationId == item.FoundationId && row.PropertyTypeId == item.PropertyTypeId) {
                    if(!checkedStatus) {
                        matrix[index][key].Price = item.Price;
                        matrix[index][key].DurationMin = item.DurationMin;    
                    }
                    else {
                        matrix[index][key].Price = "0";
                        matrix[index][key].DurationMin = "0";    
                    }
                }
            })
        })
        this.setState({priceMatrix: matrix})

        this.updateCheckbox(index,checkedStatus)
        
    }

    getBodyLayout(index) {
        
        var foundation = this.state.foundation[index];
        var matrix = this.state.priceMatrix[index];
        console.log("foundation: ",foundation)
        if(!foundation || !matrix) return null;
        var visibility = this.state.currentPage === index ? {display:'flex'} : {display:'none'};
        return(
            <View style={visibility} key={foundation.InspectionTypeId}>
                <CheckBox
                    containerStyle={{borderWidth:0, paddingLeft:5, backgroundColor:'#FFF'}}
                    key={index}
                    textStyle={{fontWeight:'normal'}}
                    title="Copy Price Matrix from company"
                    checked={foundation.IsChecked ? true : false}
                    onPress={() => this.FillMatrix(index, foundation.IsChecked)}
                />
                <View style={styles2.container}>
                    <View style={styles2.row}>
                        <Text style={styles2.font14}>Foundation Type - </Text>
                        <Text style={{color:'#28558E', fontSize:15}}>{foundation.FoundationName}</Text>
                    </View>
                    <View style={[styles2.row, styles2.lineSpacing]}>
                            <Text style={styles2.font14}>Property Type - </Text>
                            <Text style={{color:'#28558E', fontSize:15}}>{foundation.PropType}</Text>
                    </View>
                    <View style={[styles.twoRow]}>
                        <View style={{marginLeft:25}}>
                            <Text style={styles.heading2}>Area</Text>
                            <Text style={styles.heading3}>(sq.ft.)</Text>
                        </View>
                        <View>
                            <Text style={styles.heading2}>Price</Text>
                            <Text style={styles.heading3}>($)</Text>
                        </View>
                        <View>
                            <Text style={styles.heading2}>Duration</Text>
                            <Text style={styles.heading3}>(min)</Text>
                        </View>
                    </View>
                    <FlatList
                        data={matrix}
                        keyExtractor={(item, index) => item.InspectorId}
                        renderItem={this.priceRow}
                    />
                </View>
            </View>
        )
    }

    getRequestData = async () => {
        var request = this.props.navigation.getParam('request');
        var matrix = [];
        this.state.priceMatrix.filter(item => {
           item.map(arr => {
                matrix.push(arr);
           })
        });
        return {
            "inspector_id": request.InspectorId,
            "pricemetrix": matrix,
            "geofencingradius": request.geofencingradius,
            "zipcode": request.zipcode,
            "latitude": request.latitude,
            "longitude": request.longitude
        }
    }

    saveMatrix = async () => {
        this.setState({ loading: true });
        var authToken = await AsyncStorage.getItem("authToken");
        await this.getRequestData().then(data => {
            
            var header = { "authentication": authToken };
            console.log("request: ", data,authToken, JSON.stringify(data));
            var response = new API('UpdatePriceMatrix', data, header).getResponse();
            response.then(result => {
                console.log("result: ", result);
                if (result.statuscode == 200) {
                    this.props.navigation.navigate('Inspector',{"InspectorId": result.result.InspectorId})
                    this.setState({ loading: false });
                }
                else {
                    this.setState({ loading: false });
                    this.common.showToast(result.message);
                }
            })
        });
    }


    showButtonRow(index) {
        if(index === this.state.foundation.length - 1) {
            return (
                <View key={index} style={styles2.twoRow}>
                    <View style={styles2.nextButtonWrapper}>
                        <Button 
                            title="Back"
                            buttonStyle={styles2.btnNext}
                            icon={<Icon name="angle-left" containerStyle={{position:'absolute',left:10}} type="font-awesome" color="#FFF" />}
                            iconLeft
                            onPress={() => {this.setState({currentPage: this.state.currentPage-1}); this.scroll.scrollTo({x: 0, y: 0, animated: true})}}
                        />
                        
                    </View>
                    <View style={styles2.nextButtonWrapper}>
                        <Button 
                            title="Save"
                            buttonStyle={styles2.btnNext}
                            onPress={() => this.saveMatrix()}
                        />
                    </View>
                </View>
                
            )
        }
        else {
            return (
                <View key={index} style={styles2.twoRow}>
                    <View style={styles2.nextButtonWrapper}>
                        {index != 0 && <Button 
                            title="Back"
                            buttonStyle={styles2.btnNext}
                            icon={<Icon name="angle-left" containerStyle={{position:'absolute',left:10}} type="font-awesome" color="#FFF" />}
                            iconLeft
                            onPress={() => {this.setState({currentPage: this.state.currentPage-1}); this.scroll.scrollTo({x: 0, y: 0, animated: true})}}
                            />
                        }
                    </View>
                    <View style={styles2.nextButtonWrapper}>
                        <Button 
                            title="Next"
                            buttonStyle={styles2.btnNext}
                            icon={<Icon name="angle-right" containerStyle={{position:'absolute',right:10}} type="font-awesome" color="#FFF" />}
                            iconRight
                            onPress={() => {this.setState({currentPage: this.state.currentPage+1}); this.scroll.scrollTo({x: 0, y: 0, animated: true})}}
                        />
                    </View>
                </View>
            )
        }
    }

    render() {
        return(
            <ScrollView ref={(ref) => {this.scroll = ref}}>
                <View>
                {this.getBodyLayout(this.state.currentPage)}
                {this.showButtonRow(this.state.currentPage)}
	            </View>
            </ScrollView>
        )
    }
}
