import React, {Component} from 'react';
import {Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity, AsyncStorage, ImageBackground} from 'react-native';
import styles from '../../assets/styles/style.js';
import { Container, Header, Content, Button, Card, CardItem,
	 Text, Body, Form, Item, Input } from 'native-base';
import { CheckBox, Avatar, Icon } from 'react-native-elements';

export default class Register extends Component {
	constructor(props) {
        super(props)
        this.state = {
            credentials: {},
        }
    }

    componentDidMount() {
        this.getRememberCredentials();
    }
    
    async getRememberCredentials() {
        var rememberUsername = await AsyncStorage.getItem("rememberUsername");
        var rememberPassword = await AsyncStorage.getItem("rememberPassword");
        if(rememberUsername && rememberPassword) {
            var data = {rememberUsername:rememberUsername,rememberPassword:rememberPassword}
            this.setState({credentials:data})    
        }
    }
    
	
    render() {
        
        return (
            <ImageBackground source={require('../../assets/images/background.png')} style={{flex:1}}>
                <View style={styles.homeLogoWrapper}>
                    <Image  source = {require('../../assets/images/logo.png')} />
                </View>
                <View style={styles.homeMiddleWrapper}>
                    <View style={styles.homeBlueWrapper}>
                        <Text style={styles.homeAreText}>Select your role below</Text>
                    </View>
                </View>
                <View style={styles.homeBottomWrapper}>
                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('Login',{role: 2, credentials:this.state.credentials})} style={styles.bottomRoleContainer}>
                        <Image style={styles.bottomImage} source = {require('../../assets/images/real_estate.png')} />
                        <Text style={styles.bottomText}>Real Estate Agent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('Login',{role: 3, credentials:this.state.credentials})} style={styles.bottomRoleContainer}>
                        <Image style={styles.bottomImage} source = {require('../../assets/images/inspection_company.png')} />
                        <Text style={styles.bottomText}>Inspection Company</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('Login',{role: 4, credentials:this.state.credentials})} style={styles.bottomRoleContainer}>
                        <Image style={styles.bottomImage} source = {require('../../assets/images/inspector.png')} />
                        <Text style={styles.bottomText}>Inspector</Text>
                    </TouchableOpacity>
                </View>
                <StatusBar backgroundColor="#28558E" barStyle="light-content" />
        </ImageBackground>
        );
    }
}