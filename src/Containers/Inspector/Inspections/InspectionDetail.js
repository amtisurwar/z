import React, {Component} from 'react';
import {
    Platform, StyleSheet, View, ScrollView, Image, RefreshControl, FlatList
} from 'react-native';
import styles from '../../../../assets/styles/style.js';
import { Container, Header, Content, Button, Card, CardItem,
	 Text, Body, Form, Item, Picker } from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import InspectionList from '../../../Components/InspectionList';
import Common from '../../Common/index.js';

export default class Company extends Component {
	constructor(props) {
        super(props)
        this.state = {
            date: null,
            data: [],
            errors: [],
            loading: false,
            meetingCode: '',
            isVisible: false,
        }
        this.common = new Common();
    }

    markComplete = () => {
        this.setState({isVisible:true})
    }

    render() {
        
        return (
            <ScrollView>
                <Overlay overlayStyle={styles.otpModel} isVisible={this.state.isVisible}>
                    <Text style={styles.otpmsg}>Are you sure you want to mark the inspection as complete?</Text>
                    <View style={styles.orWrapper}>
                        <Button style={styles.modelButton}><Text>Yes</Text></Button>
                        <Button style={styles.modelButton} onPress={() => this.setState({isVisible: false})}><Text> No </Text></Button>
                    </View>
                </Overlay>
                <View style={styles.container}>
                    <InspectionList item={this.props.navigation.state.params.item} />
                </View>
                <View style={styles.sectionRow}>
                    <View style={[styles.sectionColumn,{borderBottomWidth:0}]}>
                        <Input 
                            inputContainerStyle={this.state.meetingCode ? styles.inputError:''} 
                            errorMessage={this.state.meetingCode && "Meeting Code required"} 
                            value={this.state.meetingCode} 
                            onChangeText={(text) => this.setState({'meetingCode': text})}  
                            placeholder="Meeting Code" inputStyle={[styles.font15]}
                            inputStyle={[styles.font15]}
                        />
                    </View>
                    <View style={[styles.sectionColumn,{borderBottomWidth:0}]}>
                        <View style={styles.center}>
                            <Button onPress={() => this.markComplete()} style={[styles.loginButton,{paddingHorizontal:0}]}>
                                <Text style={styles.textCenter}>Mark Complete</Text>
                            </Button>
                        </View>
                    </View>
                    
                </View>
            </ScrollView>
        );
    }
}