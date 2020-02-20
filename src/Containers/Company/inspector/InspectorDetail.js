import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../../../assets/styles/styles.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Input, Picker
} from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import { CheckBox, Avatar, Icon } from 'react-native-elements';

export default class InspectorDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedStartDate: null,
            profilePic: '',
            email: '',
            inspectorName: '',
            employeeId: '',
            phone: '',
        }
        this.onDateChange = this.onDateChange.bind(this);
    }

    componentDidMount() {
        var inspector = this.props.navigation.getParam('inspector');
        console.log(inspector)
        this.setState({
            employeeId: inspector.EmployeeId,
            inspectorName: inspector.Name,
            phone: inspector.MobileNo,
            email: inspector.EmailId,
            profilePic: inspector.ProfilePic,
        })
    }

    onDateChange(date) {
        this.setState({
          selectedStartDate: date,
        });
      }

    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <ScrollView>
                <View style={styles.homeContainers}>
                    <View>
                        <View style={styles.row}>
                        <Avatar
                            rounded
                            size="large"
                            source={{
                                uri: this.state.profilePic
                            }}
                            containerStyle={{marginRight:10}}
                        />
                        <View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>{this.state.inspectorName} / {this.state.employeeId}</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>{this.state.email}</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>{this.state.phone}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{justifyContent:'center', padding:10}}>
                        <View>
                            <Text style={{color:'#333', fontWeight:'bold'}}>Availability:-</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Monday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Tuesday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Wednesday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Thursday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Friday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Saturday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Sunday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={{marginTop:15}}>
                            <Text style={{color:'#333', fontWeight:'bold'}}>Schedules:-</Text>
                        </View>
                        <CalendarPicker
                            previousTitle="<"
                            nextTitle=">"
                            onDateChange={this.onDateChange}
                        />
                    </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}