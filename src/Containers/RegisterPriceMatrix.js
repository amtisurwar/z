import React, {Component} from 'react';
import {Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity, AsyncStorage, FlatList} from 'react-native';
import styles from '../../assets/styles/style2.js';
import styles2 from '../../assets/styles/style.js';
import { Container, Header, Content,  Card, CardItem, Right, Left, Switch,
	 Text, Body, Title, Form, Item, Picker, Toast,  } from 'native-base';
import { CheckBox, Avatar, Input, Slider, Icon,Button } from 'react-native-elements';
import Errors from '../Components/Errors';
import API from '../Api/Api';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';

var priceMatrixArray = [];

export default class RegisterPriceMatrix extends Component {
	constructor(props) {
        super(props)
        this.state = {
            foundation: [],
            companyId: 0,
            currentPage: 0,
            category: '',
            errors:[],
            loading: false,
            submit: false,
            priceMatrix: [],
            foundationList: [],
            categoryList: [],
            pageList: [],
        }
        this.common = new Common();
    }
    
    componentDidMount()
	{
        this.getFoundation();
    }

   
    async getFoundation() {
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var companyId = profile.CompanyId;
        this.common.getFoundation(companyId).then(foundation => {
            if(!foundation.result.foundation.length) {
                // this.props.navigation.navigate("CompanyHome")
            }
            var list = [];
            console.log("foundation: ",foundation)
            foundation.result.foundation.map(item => {
                var arr = []
                foundation.result.pricemetrix.map(mat => {
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
                foundation: foundation.result.foundation
            })
        }) 
    }


    updateMatrix = (key,value,field) => {
        var priceMatrix = [...this.state.priceMatrix];
        priceMatrix[this.state.currentPage][key][field] = value;
        this.setState({
            priceMatrix
        })
        // console.log("matrix: ",priceMatrix)
        // this.forceUpdate();
        
    }

    priceRow = ({ item, index }) => {
        var AreaStart = item.AreaStart
        var AreaEnd = item.AreaEnd
        var Price = item.Price
        var DurationMin = item.DurationMin
        return(
            <View style={[styles.sectionMatrixRow, {backgroundColor: (index % 2 == 0) ? '#ecf0f1' : '#fff', padding:5, width:'106%'}]}  key={item.InspectorId}>
                <View style={[styles2.matrixNumber, {marginHorizontal:0,}]}>
                    <Text style={[ {fontSize:13,  color:'gray', minWidth:90, textAlign:'center'}]}>{AreaStart}-{AreaEnd}</Text>
                </View>
                <View style={[styles2.matrixNumber, {marginLeft:40}]}>
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

    saveMatrix = async() => {
        // this.setState({ loading: true });
        await this.getRequestData().then(data => {
            console.log("matrix request: ",data)
            var response = new API('CompanyChangeProfile',data).getResponse();
            response.then( result => {
            
                if(result.statuscode == 200) {
                    this.props.navigation.navigate('CompanyHome')
                    this.setState({ loading: false });
                }
                else {
                    this.setState({ loading: false });
                    this.common.showToast("Error: "+result.message);
                }
            })
        });
    }

    getRequestData = async () => {
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var matrix = [];
        this.state.priceMatrix.filter(item => {
           item.map(arr => {
                matrix.push(arr);
           })
        });
        
        return {
            "userid": profile.userid,
            "companyid": profile.CompanyId,
            "fname": profile.Fname,
            "lname":profile.Lname,
            "mobileno":profile.MobileNumber,
            "address":profile.Address,
            "country":"USA",
            "state":profile.State,
            "city":profile.City,
            "zipcode":profile.ZipCode,
            "companyname":profile.CompanyName,
            "companyemail":profile.CompanyEmail,
            "companybio":profile.CompanyBio,
            "companyphone":profile.CompanyPhone,
            "inspection_type":[],
            "pricemetrix": matrix
        }
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

    getBodyLayout(index) {
        var foundation = this.state.foundation[index];
        var matrix = this.state.priceMatrix[index];
        if(!foundation || !matrix) return null;
        var visibility = this.state.currentPage === index ? {display:'flex'} : {display:'none'};
        return(
            <View style={visibility}>
                <Item style={{borderColor: '#FFF', borderWidth:0, marginTop:15}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'gray', fontSize:15,}}>Foundation Type - </Text>
                        <Text style={{color:'#28558E', fontSize:15}}>{foundation.FoundationName}</Text>
                    </View>
                </Item>
                <Item style={{paddingTop:30, paddingBottom:20, borderColor: '#FFF', borderWidth:0,}}>
                <View style={{flexDirection:'row'}}>
                        <Text style={{color:'gray', fontSize:15}}>Property Type - </Text>
                        <Text style={{color:'#28558E', fontSize:15}}>{foundation.PropType}</Text>
                    </View>
                </Item>
                <Item style={[styles.formItem,{marginTop:20, marginBottom:20}]}>
                    <View style={styles.twoRow}>
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
                </Item>
                <FlatList
                    data={matrix}
                    keyExtractor={(item, index) => item.InspectorId}
                    renderItem={this.priceRow}
                />
                {/* {this.showMatrixView(index, foundation)} */}
            </View>
        )
    }

    render() {
    if(this.state.loading) {
        return <Loader />
    }
    // var body = this.state.foundation.map( (item, index) => {
    //     return this.getBodyLayout(item, index);
    // })
    return (
        <ScrollView ref={(ref) => {this.scroll = ref}}>
            <Header style={{backgroundColor:'#28558E'}}>
            
            <Body style={{justifyContent:'center', alignItems:'center'}}>
                <Title>Set Price Matrix</Title>
            </Body>
            
            </Header>
            <StatusBar backgroundColor="#28558E" barStyle="light-content" />
	        <View style={styles2.container}>
                {/* {body} */}
                {this.getBodyLayout(this.state.currentPage)}
                {this.showButtonRow(this.state.currentPage)}
	        </View>
	    </ScrollView>
        
    );
  }
}
