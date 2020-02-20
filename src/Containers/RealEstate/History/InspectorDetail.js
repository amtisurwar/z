import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../../../assets/styles/style.js';
import {
    Container, Header, Content, Card, CardItem,
    Text, Body, Form, Item, Input, Picker
} from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import { Avatar, Icon, Overlay, Rating, CheckBox, Button } from 'react-native-elements';
import Common from '../../Common';
import Loader from '../../../Components/Loader';

export default class CompanyDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: [],
            availability: [],
            history: []
        }
        this.common = new Common();
    }

    componentDidMount() {
        var inspector = this.props.navigation.getParam('inspector');
        
        this.setState({
            loading: true,
            history: inspector,
        })
        this.common.getInspectorDetail(inspector.InspectorId).then(ins => {
            this.setState({
                item: ins.result.inspector,
                loading: false,
                availability: ins.result.inspector_availability || []
            })
            console.log("getInspectorDetail: ", ins);
        })
       
    }

    
    showAvailability = ({item, index}) => {
        return(
            <View style={[styles.twoRow, styles.lineSpacing]}>
                <Text style={[styles.threeRow, styles.primaryColor, styles.nameTxt2]}>{item.DayName}</Text>
                <Text style={styles.nameTxt2}>{item.StartTime}    -    {item.EndTime}</Text>
            </View>
        )
    }

    render() {
        if(this.state.loading) return <Loader />
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.summarySelectedIspector]}>
                    <View style={[styles.center,{width:80}]}>
                        <Avatar
                            rounded
                            source={{
                                uri: this.state.item.ProfilePic,
                            }}
                            size="large"
                            icon={{ name: 'user', type: 'font-awesome' }}
                            containerStyle={{marginBottom:10}}
                        />
                        <Rating
                            ratingCount={5}
                            imageSize={14}
                            readonly
                            startingValue={this.state.history.InspectorRating && 0}
                            
                        />
                        
                    </View>
                    <View style={styles.flatListItemTextRow}>
                        <Text style={styles.nameTxt2}>{this.state.item.Name}</Text>
                        <Text style={styles.nameTxt2}>{this.state.item.EmailId}</Text>
                        <Text style={styles.nameTxt2}>{this.common.formatPhoneNumber(this.state.item.MobileNo)}</Text>
                        <Text style={styles.nameTxt2}>$ {this.state.history.Price}</Text>
                    </View>
                </View>
                <Text style={[styles.heading2,styles.mtop15]}>Bio</Text>
                <Text style={styles.font15}>{this.state.history.CompanyBio}</Text>
                <Text style={[styles.heading2,styles.mtop15]}>Job Schedule</Text>
                <View>
                    <FlatList
                        data={this.state.availability}
                        renderItem={this.showAvailability}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
            </ScrollView>
        );
    }
}