import React, {Component} from 'react';
import {Platform, AsyncStorage, RefreshControl, Dimensions,SafeAreaView, ActivityIndicator , StyleSheet, View, ScrollView, Image, FlatList, TouchableOpacity} from 'react-native';
import styles from '../../../../assets/styles/style.js';
import { Container, Header, Content, Card, CardItem,DeckSwiper,
	 Text, Body, Form, Item, Picker, Grid, Col, Row } from 'native-base';
import { CheckBox, Avatar, Icon, Input,Rating, Button, Badge } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import Common from '../../Common';
import Loader from '../../../Components/Loader';
import Advertisement from '../../../Components/Advertisement';
import Errors from '../../../Components/Errors';
import API from '../../../Api/Api';
import Carousel from 'react-native-snap-carousel';


const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const viewWidth = viewportWidth;
const itemWidth = viewWidth;

export default class CompanyListing extends Component {

	constructor(props) {
        super(props)
        this.state = {
            activeSlide:0,
            loading: false,
            refreshing: false,
            inspectionMarked: [],
            list: [],
            request: [],
            inspectionsChecked: [],
            inspectionList: [],
            inspectiontype: [],
            inspectionFound:[],
            favouriteList:[],
            inspectionCompanies: [],
            finished: false,
            NotFound: false,
            page:1,
            diableNextButton: true,
            zipcode: '',
        }
        this.common = new Common();
        this.favorite = [];
    }
    
    componentDidMount() {
        
        this.setData();
        this.getCompanyList()
    }


    setData() {
        var inspectionList = this.props.navigation.getParam('inspectionList');
        var request = this.props.navigation.getParam('request');
        console.log("request: ",request)
        this.setState({
            address:request.address,
            date: request.inspectiondate,
            time: request.time,
            inspectionList: inspectionList,
            zipcode: request.other.zipcode || ''
        })
        
        // this.setState({loading: false})
    }

    handleLoadMore = (key) => {
        var request = this.props.navigation.getParam('request');
        // request.pageno = this.state.page + 1;
        console.log("handleLoadMore")
        // this.getCompanyList(request);
    }

    getCompanyList = () => {
        var request = this.props.navigation.getParam('request');
        this.setState({loading:true})
        this.common.getInspectionData(request).then(response => {
            console.log("response: ",response);
            this.setState({loading:false})
            if(response.statuscode == 200) {
                if(response.result.inspectioncompany && response.result.inspectioncompany.length > 0) {
                    console.log("in: ");
                    var data = response.result.inspectioncompany;
                    this.storeFavourite(data);
                    if(request.pageno != 1) {
                        console.log("in page ", this.state.page)
                        var existingData = [...this.state.inspectionCompanies];
                        var type = (Object.keys(data[this.state.activeSlide])).pop();
                        var newElements = data[this.state.activeSlide][type];
                        
                        newElements.map(item => {
                            existingData[this.state.activeSlide][type].push(item);
                        })
                        this.setState({inspectionCompanies: existingData})
                    }
                    else {
                        this.setState({inspectionCompanies: data})
                    }
                    this.setState({page: request.pageno})
                }
                else {
                    console.log("finished")
                    this.setState({NotFound: true})
                    // this.commong.showToast('No company found');
                }
            }
        }).catch( (error) => {
            // this.common.showToast('No company found');
        });
        
    }

    storeFavourite(list) {
        var fav = [];
        list.map(item => {
            for( var index in item) {
                item[index].map(item2 => {
                    if(item2.IsLike) {
                        fav.push(item2.InspectorPriceMetrixId);
                    }
                })
            }
        })
        console.log("fav: ",fav)
        this.setState({
            favouriteList: fav
        })
        
    }

    // filterList(inspectiontype, inspectionCompanies) {
    //     // var cmp = [];
    //     // inspectiontype.map( inspection => {
    //     //     inspectionCompanies.map(company => {
    //     //         if(inspection.inspectiontypeid == company.InspectionTypeId) {
    //     //             cmp.push(inspection);
    //     //             this.inspectionListMatch.push(inspection.inspectiontypeid);
    //     //         }
    //     //     })
    //     // })
    //     // let unique = [...new Set(cmp)];
    //     // this.setState({inspectiontype:unique})
    //     var cmp = [];
    //     inspectiontype.map( inspection => {
    //         var arr = [];
    //         var counter = 0;
    //         inspectionCompanies.map(company => {
    //             if(inspection.inspectiontypeid == company.InspectionTypeId) {
    //                 counter++;
    //                 if(counter < 10) {
    //                     arr.push(company);
    //                 }
    //             }
    //         })
    //         if(arr.length > 0) {
    //             cmp.push({"inspectiontypeid":inspection.inspectiontypeid, "company":arr});
    //         }
    //     })
    //     console.log("inspection : ",cmp)
    //     this.setState({inspectiontype:cmp})
    // }

    getName = (id) => {
        var name = '';
        this.state.inspectionList.filter( (item) => {
            if(item.InspectionTypeId == id) {
                name = item.InspectionTypeName;
            }
        })
        return name;
    }

    markAsFavourite = async (item, index) => {        
        this.setState({loading: true});
        var authToken = await AsyncStorage.getItem("authToken");
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var header = {"authentication":authToken};
        var data = {"inspectorid":item.InspectorId,"agentid":profile.AgentId};
        var response = new API('Favorite',data,header).getResponse();
        console.log("fav response: ",response)
        response.then( result => {
            this.setState({loading: false});
            if(result.statuscode == 200) {
                var list = [...this.state.favouriteList];
                var ind = list.indexOf(item.InspectorPriceMetrixId);
                if(ind >= 0) {
                    list.splice(ind,1);
                }
                else {
                    list.push(item.InspectorPriceMetrixId);
                }
                console.log("list: ",list)            
                this.setState({
                    favouriteList: list
                })        
            }
            else {
                this.setState({loading: false});
                this.common.showToast("Invalid Response")
            }
        }).catch(error => {
            this.setState({loading: false});
            this.common.showToast("Please try again later")
        })
        
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if(this.props.navigation.getParam('item') !== prevProps.navigation.getParam('item')) {
    //         console.log("change happened")
    //     }
    // }

    updateData = data => {
        this.markAsChecked(data);
    };

    markAsChecked = (item) => {
        var record = {"InspectionTypeId": item.InspectionTypeId, "InspectorPriceMetrixId": item.InspectorPriceMetrixId, "InspectorId" : item.InspectorId, "item": item}
        var list = [...this.state.inspectionMarked];
        for(var i = 0; i<list.length;i++) {
            if(list[i].InspectionTypeId == item.InspectionTypeId) {
                list.splice(i,1);
            }
        }
        list.push(record)
        this.setState({
            inspectionMarked: list
        }, () => {
            this.FinishSlider()
        })
        
    }
    

    FinishSlider = () => {
        if(this.state.inspectionMarked.length == this.state.inspectionCompanies.length) {
            this.searchSummary()
        }
        else {
            this._carousel.snapToItem(this.state.activeSlide+1);
        }
        // var currentPage = this.state.activeSlide;
        // var inspectionSlideFound = [...this.state.inspectionCompanies];


        // inspectionSlideFound.map( (company) => {
        // var fill = -1;
        // console.log("company: ",company)

            // for(var i=0; i<list.length;i++) {
            //     if(list[i].InspectionTypeId === id) {
            //         fill = id;
            //         //this.props.navigation.navigate('Favorites', {inspectionList:this.state.inspectionList})
            //     }
            // }
        // })
        // status.push(fill);
        // console.log("status: ",status)
        // var index = status.indexOf(-1);
        // if(index >= 0) {
        //     this._carousel.snapToItem(index);
        //     this.setState({activeSlide:index})
        //     // this.showError("Select one inspector for all inspection")
        //     //this.props.navigation.navigate('Favorites', {inspectionList:this.state.inspectionList})
        // }
        // else {
        //     this.setState({diableNextButton: false})
           
        // }



        // if(currentPage == this.state.inspectionCompanies.length-1) {
        //     var data = {
        //         "inspectionList": this.props.navigation.getParam('inspectionList'),
        //         "request": this.props.navigation.getParam('request'),
        //         "inspectionMarked": this.state.inspectionMarked
        //     }
        //     // this.props.navigation.navigate('SearchSummary',data)
        // }
        // else {
        //     var cp = currentPage+1;
        //     this._carousel.snapToItem(cp);
        //     // this.setState({activeSlide:currentPage+1})
        // }
    }

    SendData() {
        return {
            request: this.props.navigation.getParam('request'),
            inspectionMarked: this.state.inspectionMarked,
            inspectionList: this.props.navigation.getParam('inspectionList')
        }
    }
    searchSummary() {
        this.props.navigation.navigate("SearchSummary",this.SendData())
    }

    getButtonView = () => {
        return(
            <View style={[styles.twoRow]}>
                <View>
                    {/* {this.state.activeSlide != 0 && <Button 
                        title="Back"
                        buttonStyle={[styles.btnNext,{marginVertical:5}]}
                        icon={<Icon name="angle-left" containerStyle={{position:'absolute',left:10}} type="font-awesome" color="#FFF" />}
                        iconLeft
                        onPress={() => {this.setState({activeSlide: this.state.activeSlide-1})}}
                    />} */}
                </View>
                <View>
                    <Button 
                        title="Next"
                        buttonStyle={[styles.btnNext,{marginVertical:5}]}
                        icon={<Icon name="angle-right" containerStyle={{position:'absolute',right:10}} type="font-awesome" color="#FFF" />}
                        iconRight
                        // disabled={this.state.inspectionMarked.length > 0 ? false : true}
                        disabled={this.state.inspectionMarked.length == this.state.inspectionCompanies.length ? false : true}
                        onPress={() => {this.state.activeSlide == this.state.inspectionCompanies.length - 1 ? this.searchSummary() : this.setState({activeSlide: this.state.activeSlide+1})}}
                    />
                    {/* <Button 
                        title="Next"
                        buttonStyle={[styles.btnNext,{marginVertical:5}]}
                        icon={<Icon name="angle-right" containerStyle={{position:'absolute',right:10}} type="font-awesome" color="#FFF" />}
                        iconRight
                        onPress={() => {this.state.activeSlide == this.state.inspectionCompanies.length - 1 ? this.searchSummary() : this.setState({activeSlide: this.state.activeSlide+1})}}
                    /> */}
                </View>
            </View>
        )
    }

    renderSeperateItem = ({ item, index }) => {
        var radio = false;
        for(var i = 0; i<this.state.inspectionMarked.length;i++) {
            if(this.state.inspectionMarked[i].InspectorPriceMetrixId == item.InspectorPriceMetrixId) {
                radio = true;
            }
        }
        var favoriteIndex = this.state.favouriteList.indexOf(item.InspectorPriceMetrixId)
        
        return(
            <View style={[styles.inspectorListingWrapper]} key={item.InspectorPriceMetrixId}>
                <View style={{width:35}}>
                    <CheckBox
                        size={18}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={radio}
                        containerStyle={{padding:0, margin:0, left:4}}
                        onPress={() => this.markAsChecked(item)}
                    />
                </View>
               <View style={[styles.twoRow]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CompanyDetail', {updateData: this.updateData,inspector:item, favorite:favoriteIndex,send: this.SendData()})}>
                        <Avatar
                            rounded
                            source={{
                                uri: item.ProfilePic,
                            }}
                            containerStyle={{borderWidth:1,borderColor:'#ccc'}}
                            icon={{ name: 'user', type: 'font-awesome' }}
                            size="large"
                        />
                        <Text style={[styles.nameTxt,{textAlign:'center', marginBottom:6, textDecorationLine:'underline'}]}>{item.InspectorName}</Text>
                        <Rating
                            ratingCount={5}
                            imageSize={14}
                            readonly
                            startingValue={parseInt(item.Rating)}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flatListItemTextRow} onPress={() => this.props.navigation.navigate('CompanyDetail', {updateData: this.updateData,inspector:item, favorite:favoriteIndex, send: this.SendData()})}>
                        <Text style={styles.nameTxt}>{item.CompanyName}</Text>
                        <Text numberOfLines={4} style={styles.nameTxt2}>{item.CompanyBio}</Text>
                    </TouchableOpacity>
                    <View style={{justifyContent:'space-between'}}>
                        <Text style={styles.nameTxt}>$ {item.Price}</Text>
                        <CheckBox
                            size={18}
                            checkedIcon='heart'
                            checkedColor="#B9183A"
                            uncheckedIcon='heart-o'
                            checked={favoriteIndex >=0 ? true : false}
                            right
                            onPress={() => this.markAsFavourite(item,index)}
                            containerStyle={{padding:0, margin:0}}
                        />
                    </View>
               </View>
            </View>
        )
    }

    footer = () => {
        if (!this.state.finished) return null;
        return(
            <View style={{paddingVertical:20}}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    renderItem = ({item, index}) => {

        var company = [...this.state.inspectionCompanies];
        var type = (Object.keys(company[item]).pop())
        var item2 = company[item][type];
        // console.log("type: ",type,item2);
        return(
            <View>
                <View style={styles.container}>
                    <Text style={[styles.heading2,styles.capitalize]}>{this.getName(type)} Inspection</Text>
                </View>
                {this.getInspectionCompany(item2, item)}
            </View>
        )
    }

    nextPage = (index) => {
        console.log("snap: ",index)
        this._carousel.snapToItem(index);
        // this.setState({activeSlide:index})
    }

    getSlider = () => {
        var company = [...this.state.inspectionCompanies];    
        var keys = Object.keys(company)
        return(
            <View>
                <Carousel
                    extraData={this.state}
                    ref={(c) => { this._carousel = c; }}
                    data={keys}
                    renderItem={this.renderItem}
                    sliderWidth={viewWidth}
                    itemWidth={itemWidth}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                    firstItem={this.state.activeSlide}
                    // onPress={() => { this._carousel.snapToNext(() => {
                    
                    // }) }}
                    // snapToItem={this.nextPage}
                    // onBeforeSnapToItem={(slideIndex) => this.nextPage(slideIndex)}
                    // onSnapToItem={(slideIndex) => console.log("called")}
                />
                
            </View>
        )
    }

    getInspectionCompany = (list, key) => {
        return(
            <FlatList
                extraData={this.state}
                data={list}
                keyExtractor={(item, index) => `${index}`}
                renderItem={this.renderSeperateItem}
                // ListFooterComponent={() => this.footer(key)}
                // onEndReachedThreshold={0.3}
                // onEndReached={() => this.handleLoadMore(key)}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                style={{marginBottom:230}}
            />
        )
    }
    
    handleRefresh = () => {
        this.getCompanyList()
    }

    NotFound = () => {
        if (!this.state.NotFound) return null;
        return(
            <View style={styles.container}>
                <Badge 
                    status="error" 
                    value="No Inspector found, please go back and search again."
                    badgeStyle={{padding:20}}
                    textStyle={{fontSize:14, textAlign:'center'}}
                 />
            </View>
        )
    }
    
    render() {
        if(this.state.loading) return <Loader />
        return (
            <View style={{flex:1}}>
                <Advertisement />
                <View style={styles.container}>
                    <Text style={styles.heading2}>Inspection Request</Text>
                    <View style={[styles.row]}>
                        <View style={{justifyContent:"space-between",flex:1}}>
                            <Text style={styles.font12}>{this.state.address} {this.state.zipcode}</Text>
                        </View>
                        <View style={{justifyContent:"space-between",flex:1}}>
                            <Text style={[{textAlign:'right'},styles.font12]}>{this.state.date} | {this.state.time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.border2}></View>
                {this.state.inspectionCompanies.length == 0 ? this.NotFound() : this.getSlider()}
                {/* <View style={{position:'absolute', bottom:0, width:'100%'}}>
                    {this.getButtonView()}
                </View> */}
                
            </View>
        );
    }
}
